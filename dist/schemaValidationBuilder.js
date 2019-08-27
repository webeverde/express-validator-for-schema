"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validator = __importStar(require("validator"));
const errors_1 = require("./errors");
class SchemaValidationBuilder {
    constructor() {
        this.ignoredFields = [];
        this.validFields = {};
        this.validators = {};
        this.customValidators = {};
        this.buildValidation = (schema) => {
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
        };
    }
    ignoreFields(...fields) {
        this.ignoredFields = this.ignoredFields.concat(fields);
    }
    registerValidator(model, validator) {
        this.customValidators[model] = validator;
    }
    createValidator(field, required, isArrayItem = false) {
        let out = {
            in: ['body']
        };
        if (!required) {
            out.optional = true;
        }
        else {
            out.exists = { options: { checkNull: true }, errorMessage: errors_1.REQUIRED_VALUE_MISSING };
        }
        if (field["$ref"]) {
            out["$ref"] = field["$ref"];
        }
        else {
            let numberOptions = {};
            if (field["minimum"] != undefined) {
                numberOptions.min = field["minimum"];
            }
            if (field["maximum"] != undefined) {
                numberOptions.max = field["maximum"];
            }
            let hasLengthContraint = false;
            let lengthConstraint = {};
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
                    errorMessage: errors_1.INVALID_LENGTH
                };
            }
            switch (field["type"]) {
                case "string":
                    if (field["format"] == "date-time") {
                        out.isString = true;
                        out.custom = {
                            options: (value, { req, location, path }) => {
                                let date = validator.toDate(value);
                                if (!date) {
                                    return Promise.reject(errors_1.INVALID_DATE_VALUE);
                                }
                                return Promise.resolve();
                            },
                            errorMessage: errors_1.INVALID_DATE_VALUE
                        };
                        out.toDate = true;
                        out.errorMessage = errors_1.INVALID_DATE_VALUE;
                    }
                    else if (field["enum"]) {
                        out.isIn = {
                            options: [field["enum"]],
                            errorMessage: errors_1.INVALID_ENUM_VALUE
                        };
                        out.errorMessage = errors_1.INVALID_ENUM_VALUE;
                    }
                    else if (!isArrayItem) {
                        out.isString = { errorMessage: errors_1.INVALID_STRING_VALUE };
                        out.errorMessage = errors_1.INVALID_STRING_VALUE;
                    }
                    break;
                case "boolean":
                    out.isBoolean = {
                        errorMessage: errors_1.INVALID_BOOLEAN_VALUE
                    };
                    out.toBoolean = true;
                    break;
                case "number":
                    out.isFloat = { options: numberOptions, errorMessage: errors_1.INVALID_FLOAT_VALUE };
                    out.toFloat = true;
                    out.errorMessage = errors_1.INVALID_FLOAT_VALUE;
                    break;
                case "integer":
                    out.isInt = { options: numberOptions, errorMessage: errors_1.INVALID_INT_VALUE };
                    out.isInt = true;
                    out.errorMessage = errors_1.INVALID_INT_VALUE;
                    break;
                case "array":
                    out.isArray = {
                        errorMessage: errors_1.INVALID_ARRAY_VALUE
                    };
                    let more = this.createValidator(field["items"], false, true);
                    if (more["$ref"]) {
                        out = Object.assign({}, out, { items: more });
                    }
                    else {
                        out = Object.assign({}, out, more);
                    }
                    break;
            }
        }
        return out;
    }
    resolveReferences() {
        for (const modelName in this.validators) {
            if (this.validators.hasOwnProperty(modelName)) {
                const model = this.validators[modelName];
                let addFields = {};
                for (const fieldName in model) {
                    if (model.hasOwnProperty(fieldName)) {
                        const field = model[fieldName];
                        let s;
                        let prefix;
                        let isArray = false;
                        prefix = fieldName;
                        if (field["$ref"]) {
                            s = field["$ref"];
                        }
                        else if (field["items"]) {
                            let f = field;
                            while (f["items"]) {
                                f = field["items"];
                                prefix += ".*";
                            }
                            s = f["$ref"];
                            isArray = true;
                        }
                        else {
                            continue;
                        }
                        if (s.includes("#/definitions/")) {
                            let searchModel = s.replace("#/definitions/", "");
                            if (this.customValidators[searchModel]) {
                                addFields[fieldName] = this.customValidators[searchModel];
                            }
                            else {
                                let newFields = this.expandModel(searchModel, prefix);
                                addFields = Object.assign({}, addFields, newFields);
                                if (isArray) {
                                    delete model[fieldName]["items"];
                                }
                                else {
                                    delete model[fieldName]["$ref"];
                                }
                            }
                        }
                    }
                }
                this.validators[modelName] = Object.assign({}, model, addFields);
            }
        }
    }
    expandModel(name, prefix) {
        let model = this.validators[name];
        let out = {};
        for (const fieldName in model) {
            if (model.hasOwnProperty(fieldName)) {
                const field = model[fieldName];
                let expandedName = prefix + "." + fieldName;
                let s;
                let isArray = false;
                if (field["$ref"]) {
                    s = field["$ref"];
                }
                else if (field["items"]) {
                    let f = field;
                    expandedName = expandedName + ".*";
                    while (Array.isArray(field["items"])) {
                        f = field["items"];
                        expandedName += ".*";
                    }
                    s = f["items"];
                    isArray = true;
                }
                else {
                    out[expandedName] = field;
                    continue;
                }
                if (s.includes("#/definitions/")) {
                    let searchModel = s.replace("#/definitions/", "");
                    if (this.customValidators[searchModel]) {
                        out[expandedName] = this.customValidators[searchModel];
                    }
                    else {
                        let children = this.expandModel(searchModel, expandedName);
                        out = Object.assign({}, out, children);
                    }
                }
            }
        }
        return out;
    }
    getValidation(name, overrideFields, forArray) {
        let schema = Object.assign({}, this.validators[name]);
        for (const fieldName in overrideFields) {
            if (overrideFields.hasOwnProperty(fieldName) && schema.hasOwnProperty(fieldName)) {
                const field = overrideFields[fieldName];
                schema[fieldName] = Object.assign({}, schema[fieldName], field);
            }
        }
        if (forArray) {
            let newSchema = {};
            for (const key in schema) {
                if (schema.hasOwnProperty(key)) {
                    newSchema["*." + key] = schema[key];
                }
            }
            schema = newSchema;
        }
        return express_validator_1.checkSchema(schema).concat(express_validator_1.body().custom(body => {
            if (Array.isArray(body)) {
                for (let i = 0; i < body.length; i++) {
                    const element = body[i];
                    for (const key in element) {
                        if (!this.validFields[name].includes(key)) {
                            return Promise.reject(errors_1.UNKNOWN_FIELD);
                        }
                    }
                }
            }
            else {
                for (const key in body) {
                    if (!this.validFields[name].includes(key)) {
                        return Promise.reject(errors_1.UNKNOWN_FIELD);
                    }
                }
            }
            return Promise.resolve();
        }).withMessage(errors_1.UNKNOWN_FIELD));
    }
}
exports.SchemaValidationBuilder = SchemaValidationBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hVmFsaWRhdGlvbkJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc2NoZW1hVmFsaWRhdGlvbkJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEseURBQStGO0FBQy9GLHFEQUF1QztBQUN2QyxxQ0FBbU87QUFPbk8sTUFBYSx1QkFBdUI7SUFBcEM7UUFDSSxrQkFBYSxHQUFhLEVBQUUsQ0FBQTtRQUU1QixnQkFBVyxHQUFnQyxFQUFFLENBQUE7UUFFN0MsZUFBVSxHQUF3QyxFQUFFLENBQUE7UUFFcEQscUJBQWdCLEdBQTZDLEVBQUUsQ0FBQTtRQVUvRCxvQkFBZSxHQUFHLENBQUMsTUFBVyxFQUFRLEVBQUU7WUFDcEMsS0FBSyxNQUFNLFNBQVMsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFO2dCQUN4QyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFO29CQUM5QyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRTt3QkFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7d0JBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDO3dCQUNqQyxLQUFLLE1BQU0sU0FBUyxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7NEJBQ3RDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzRCQUM1QyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJ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