import { ValidationParamSchema, ValidationSchema, checkSchema, body } from "express-validator";
import * as validator from 'validator';
import { REQUIRED_VALUE_MISSING, INVALID_DATE_VALUE, INVALID_ENUM_VALUE, INVALID_STRING_VALUE, INVALID_BOOLEAN_VALUE, INVALID_FLOAT_VALUE, INVALID_INT_VALUE, INVALID_ARRAY_VALUE, UNKNOWN_FIELD, INVALID_LENGTH } from "./errors";
import { MinMaxOptions } from "express-validator/src/options";

export interface FieldOverride {
    [key: string]: ValidationParamSchema
}

export class SchemaValidationBuilder {
    ignoredFields: string[] = []

    validFields: { [key: string]: string[] } = {}

    validators: { [key: string]: ValidationSchema } = {}

    customValidators: { [key: string]: ValidationParamSchema } = {}

    ignoreFields(...fields: string[]) {
        this.ignoredFields = this.ignoredFields.concat(fields);
    }

    registerValidator(model: string, validator: ValidationParamSchema) {
        this.customValidators[model] = validator;
    }

    buildValidation = (schema: any): void => {
        for (const modelName in schema.definitions) {
            if (schema.definitions.hasOwnProperty(modelName)) {
                const model = schema.definitions[modelName];
                if (!this.validators[modelName]) {
                    this.validators[modelName] = {};
                    this.validFields[modelName] = [];
                    for (const fieldName in model.properties) {
                        this.validFields[modelName].push(fieldName);
                        if (model.properties.hasOwnProperty(fieldName) && !this.ignoredFields.includes(fieldName) && !this.ignoredFields.includes(modelName + "." + fieldName)) {
                            let field = model.properties[fieldName];
                            let required = model.required && model.required.includes(fieldName);
                            this.validators[modelName][fieldName] = this.createValidator(field, required);
                        }
                    }
                }
            }
        }
        this.resolveReferences();
    }

    private createValidator(field: {}, required: boolean, isArrayItem = false): ValidationParamSchema {
        let out: any = {
            in: ['body']
        };
        if (!required) {
            out.optional = true;
        } else {
            out.exists = { options: { checkNull: true }, errorMessage: REQUIRED_VALUE_MISSING };
        }

        if (field["$ref"]) {
            out["$ref"] = field["$ref"]
        } else {
            let numberOptions: MinMaxOptions = {};
            if (field["minimum"] != undefined) {
                numberOptions.min = field["minimum"];
            }
            if (field["maximum"] != undefined) {
                numberOptions.max = field["maximum"];
            }
            let hasLengthContraint = false;
            let lengthConstraint: MinMaxOptions = {};
            if (field["minLength"]) {
                lengthConstraint.min = field["minLength"];
                hasLengthContraint = true;
            }
            if (field["maxLength"]) {
                lengthConstraint.max = field["maxLength"];
                hasLengthContraint = true;
            }
            if (hasLengthContraint) {
                out.isLength = {
                    options: lengthConstraint,
                    errorMessage: INVALID_LENGTH
                }
            }

            switch (field["type"]) {
                case "string":

                    if (field["format"] == "date-time") {
                        out.isString = true
                        out.custom = {
                            options: (value, { req, location, path }) => {
                                let date = validator.toDate(value);
                                if (!date) {
                                    return Promise.reject(INVALID_DATE_VALUE)
                                }
                                return Promise.resolve();
                            },
                            errorMessage: INVALID_DATE_VALUE
                        }
                        out.toDate = true;
                        out.errorMessage = INVALID_DATE_VALUE
                    } else if (field["enum"]) {
                        out.isIn = {
                            options: [field["enum"]],
                            errorMessage: INVALID_ENUM_VALUE
                        }
                        out.errorMessage = INVALID_ENUM_VALUE
                    } else if (!isArrayItem) {
                        out.isString = { errorMessage: INVALID_STRING_VALUE }
                        out.errorMessage = INVALID_STRING_VALUE
                    }
                    break;
                case "boolean":
                    out.isBoolean = {
                        errorMessage: INVALID_BOOLEAN_VALUE
                    };
                    out.toBoolean = true;

                    break;
                case "number":
                    out.isFloat = { options: numberOptions, errorMessage: INVALID_FLOAT_VALUE }
                    out.toFloat = true;
                    out.errorMessage = INVALID_FLOAT_VALUE
                    break;
                case "integer":
                    out.isInt = { options: numberOptions, errorMessage: INVALID_INT_VALUE }
                    out.isInt = true;
                    out.errorMessage = INVALID_INT_VALUE
                    break;
                case "array":
                    out.isArray = {
                        errorMessage: INVALID_ARRAY_VALUE
                    };
                    let more = this.createValidator(field["items"], false, true);
                    if (more["$ref"]) {
                        out = { ...out, items: more }
                    } else {
                        out = { ...out, ...more };
                    }
                    break;
            }
        }
        return out;
    }

    private resolveReferences() {
        for (const modelName in this.validators) {
            if (this.validators.hasOwnProperty(modelName)) {
                const model = this.validators[modelName];
                let addFields = {};
                for (const fieldName in model) {
                    if (model.hasOwnProperty(fieldName)) {
                        const field = model[fieldName];
                        let s: string;
                        let prefix: string;
                        let isArray = false;
                        prefix = fieldName
                        if (field["$ref"]) {
                            s = field["$ref"];
                        } else if (field["items"]) {
                            let f = field;
                            while (f["items"]) {
                                f = field["items"]
                                prefix += ".*"
                            }
                            s = f["$ref"];
                            isArray = true;
                        } else {
                            continue;
                        }
                        if (s.includes("#/definitions/")) {
                            let searchModel = s.replace("#/definitions/", "");
                            if (this.customValidators[searchModel]) {
                                addFields[fieldName] = this.customValidators[searchModel];
                            } else {
                                let newFields = this.expandModel(searchModel, prefix);
                                addFields = { ...addFields, ...newFields };
                                if (isArray) {
                                    delete model[fieldName]["items"];
                                } else {
                                    delete model[fieldName]["$ref"];
                                }
                            }
                        }
                    }
                }
                this.validators[modelName] = { ...model, ...addFields };
            }
        }
    }

    private expandModel(name: string, prefix: string) {
        let model = this.validators[name];
        let out: ValidationSchema = {};
        for (const fieldName in model) {
            if (model.hasOwnProperty(fieldName)) {
                const field = model[fieldName];
                let expandedName = prefix + "." + fieldName;
                let s: string;
                let isArray = false;
                if (field["$ref"]) {
                    s = field["$ref"];
                } else if (field["items"]) {
                    let f = field;
                    expandedName = expandedName + ".*";
                    while (Array.isArray(field["items"])) {
                        f = field["items"]
                        expandedName += ".*"
                    }
                    s = f["items"] as string;
                    isArray = true;
                } else {
                    out[expandedName] = field;
                    continue;
                }

                if (s.includes("#/definitions/")) {
                    let searchModel = s.replace("#/definitions/", "");
                    if (this.customValidators[searchModel]) {
                        out[expandedName] = this.customValidators[searchModel];
                    } else {
                        let children = this.expandModel(searchModel, expandedName);
                        out = { ...out, ...children }
                    }

                }
            }
        }
        return out;

    }

    getValidation(name: string, overrideFields?: FieldOverride, forArray?: boolean) {
        let schema = { ...this.validators[name] };
        for (const fieldName in overrideFields) {
            if (overrideFields.hasOwnProperty(fieldName) && schema.hasOwnProperty(fieldName)) {
                const field = overrideFields[fieldName];
                schema[fieldName] = { ...schema[fieldName], ...field }
            }
        }
        if (forArray) {
            let newSchema = {}
            for (const key in schema) {
                if (schema.hasOwnProperty(key)) {
                    newSchema["*." + key] = schema[key];
                }
            }
            schema = newSchema;
        }
        return checkSchema(schema).concat(body().custom(body => {
            if (Array.isArray(body)) {
                for (let i = 0; i < body.length; i++) {
                    const element = body[i];
                    for (const key in element) {
                        if (!this.validFields[name].includes(key)) {
                            return Promise.reject(UNKNOWN_FIELD);
                        }
                    }

                }
            } else {
                for (const key in body) {
                    if (!this.validFields[name].includes(key)) {
                        return Promise.reject(UNKNOWN_FIELD);
                    }
                }
            }
            return Promise.resolve();
        }).withMessage(UNKNOWN_FIELD))
    }
}