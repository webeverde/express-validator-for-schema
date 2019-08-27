import { ValidationParamSchema, ValidationSchema } from "express-validator";
export interface FieldOverride {
    [key: string]: ValidationParamSchema;
}
export declare class SchemaValidationBuilder {
    ignoredFields: string[];
    validFields: {
        [key: string]: string[];
    };
    validators: {
        [key: string]: ValidationSchema;
    };
    customValidators: {
        [key: string]: ValidationParamSchema;
    };
    ignoreFields(...fields: string[]): void;
    registerValidator(model: string, validator: ValidationParamSchema): void;
    buildValidation: (schema: any) => void;
    private createValidator;
    private resolveReferences;
    private expandModel;
    getValidation(name: string, overrideFields?: FieldOverride, forArray?: boolean): import("express-validator").ValidationChain[];
}
