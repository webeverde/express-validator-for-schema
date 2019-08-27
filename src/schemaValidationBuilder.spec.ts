import * as fs from "fs";
import stringify from "json-stable-stringify";
import { SchemaValidationBuilder } from "./schemaValidationBuilder";
import { INVALID_ENUM_VALUE, INVALID_STRING_VALUE, INVALID_FLOAT_VALUE, INVALID_INT_VALUE, INVALID_BOOLEAN_VALUE, INVALID_DATE_VALUE, REQUIRED_VALUE_MISSING, UNKNOWN_FIELD, INVALID_LENGTH } from "./errors";
import { expect } from "chai";
import 'mocha';
import { ValidationError } from "express-validator";
import { TEST_JSON_VALIDATORS } from "../test/test.json.validators";

describe("Schema validation builder", function () {
    describe("Schema generation", function () {
        let builder = new SchemaValidationBuilder();
        let str = fs.readFileSync("./test/test.json", "utf-8")
        let schema = JSON.parse(str);
        builder.buildValidation(schema);
        it("Should generate correct validation schema", function () {
            let v = stringify(builder.validators);
            let parsed = JSON.parse(v);
            expect(parsed).to.be.deep.equal(TEST_JSON_VALIDATORS);
        })
    })

    describe("Enum", function () {
        let builder = new SchemaValidationBuilder();
        let str = fs.readFileSync("./test/test.json", "utf-8")
        let schema = JSON.parse(str);
        builder.buildValidation(schema);

        this.timeout(30000);
        it("should accept value for enum", async function () {
            let validators = builder.getValidation("MyModel");
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        enumField: "TWO"
                    }
                })
                expect(res.errors).to.be.empty
            }
            return Promise.resolve();
        })

        it("should fail on value not in enum", async function () {
            let validators = builder.getValidation("MyModel");
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        enumField: "THREE"
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(1);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("enumField");
            expect(errors[0].msg).to.be.equal(INVALID_ENUM_VALUE);
            return Promise.resolve();
        })

    })

    describe("Enum Array", function () {
        let builder = new SchemaValidationBuilder();
        let str = fs.readFileSync("./test/test.json", "utf-8")
        let schema = JSON.parse(str);
        builder.buildValidation(schema);
        const json = stringify(builder.validators, { space: 4 }) + "\n\n";
        fs.writeFileSync("validators.json", json);
        this.timeout(30000);
        it("should accept value for enum lists", async function () {
            let validators = builder.getValidation("MyModel");
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        enumArray: ["ONE", "TWO"]
                    }
                })
                expect(res.errors).to.be.empty
            }
            return Promise.resolve();
        })

        it("should fail on value not enum lists", async function () {
            let validators = builder.getValidation("MyModel");
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        enumArray: ["THREE"]
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(1);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("enumArray");
            expect(errors[0].msg).to.be.equal(INVALID_ENUM_VALUE);
            return Promise.resolve();
        })

    })

    describe("String length", function () {
        let builder = new SchemaValidationBuilder();
        let str = fs.readFileSync("./test/test.json", "utf-8")
        let schema = JSON.parse(str);
        builder.buildValidation(schema);

        this.timeout(30000);
        it("should accept value length between 10 and 20", async function () {
            let validators = builder.getValidation("MyModel");
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        stringLength: "is right length"
                    }
                })
                expect(res.errors).to.be.empty
            }
            return Promise.resolve();
        })

        it("should fail on value length < 10", async function () {
            let validators = builder.getValidation("MyModel");
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        stringLength: "short"
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(1);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("stringLength");
            expect(errors[0].msg).to.be.equal(INVALID_LENGTH);
            return Promise.resolve();
        })

        it("should fail on value length > 20", async function () {
            let validators = builder.getValidation("MyModel");
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        stringLength: "this string is way too long"
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(1);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("stringLength");
            expect(errors[0].msg).to.be.equal(INVALID_LENGTH);
            return Promise.resolve();
        })

    })

    describe("String length array", function () {
        let builder = new SchemaValidationBuilder();
        let str = fs.readFileSync("./test/test.json", "utf-8")
        let schema = JSON.parse(str);
        builder.buildValidation(schema);

        this.timeout(30000);
        it("should accept value length between 10 and 20", async function () {
            let validators = builder.getValidation("MyModel");
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        stringLengthArray: ["is right length"]
                    }
                })
                expect(res.errors).to.be.empty
            }
            return Promise.resolve();
        })

        it("should fail on value length < 10", async function () {
            let validators = builder.getValidation("MyModel");
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        stringLengthArray: ["short"]
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(1);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("stringLengthArray");
            expect(errors[0].msg).to.be.equal(INVALID_LENGTH);
            return Promise.resolve();
        })

        it("should fail on value length > 20", async function () {
            let validators = builder.getValidation("MyModel");
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        stringLengthArray: ["this string is way too long"]
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(1);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("stringLengthArray");
            expect(errors[0].msg).to.be.equal(INVALID_LENGTH);
            return Promise.resolve();
        })

    })

    describe("Number min max", function () {
        let builder = new SchemaValidationBuilder();
        let str = fs.readFileSync("./test/test.json", "utf-8")
        let schema = JSON.parse(str);
        builder.buildValidation(schema);

        this.timeout(30000);
        it("should accept value between 0 and 10", async function () {
            let validators = builder.getValidation("MyModel");
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        numberMaxMin: 5
                    }
                })
                expect(res.errors).to.be.empty
            }
            return Promise.resolve();
        })

        it("should fail on illegal value", async function () {
            let validators = builder.getValidation("MyModel");
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        numberMaxMin: "not a number"
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(1);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("numberMaxMin");
            expect(errors[0].msg).to.be.equal(INVALID_FLOAT_VALUE);
            return Promise.resolve();
        })

        it("should fail on value > 10", async function () {
            let validators = builder.getValidation("MyModel");
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        numberMaxMin: 11
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(1);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("numberMaxMin");
            return Promise.resolve();
        })

        it("should fail on value < 0", async function () {
            let validators = builder.getValidation("MyModel");
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        numberMaxMin: -1
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(1);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("numberMaxMin");
            return Promise.resolve();
        })

    })

    describe("Number array", function () {
        let builder = new SchemaValidationBuilder();
        let str = fs.readFileSync("./test/test.json", "utf-8")
        let schema = JSON.parse(str);
        builder.buildValidation(schema);
        const json = stringify(builder.validators, { space: 4 }) + "\n\n";
        fs.writeFileSync("validators.json", json);
        this.timeout(30000);
        it("should accept value for enum lists", async function () {
            let validators = builder.getValidation("MyModel");
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        numberArray: [0, 1, 2, 3]
                    }
                })
                expect(res.errors).to.be.empty
            }
            return Promise.resolve();
        })

        it("should fail on value not enum lists", async function () {
            let validators = builder.getValidation("MyModel");
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        numberArray: ["THREE"]
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(1);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("numberArray");
            expect(errors[0].msg).to.be.equal(INVALID_FLOAT_VALUE);
            return Promise.resolve();
        })

    })

    describe("Integer", function () {
        let builder = new SchemaValidationBuilder();
        let str = fs.readFileSync("./test/test.json", "utf-8")
        let schema = JSON.parse(str);
        builder.buildValidation(schema);

        this.timeout(30000);
        it("should accept integer value ", async function () {
            let validators = builder.getValidation("MyModel");
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        integerValue: 5
                    }
                })
                expect(res.errors).to.be.empty
            }
            return Promise.resolve();
        })

        it("should fail on float", async function () {
            let validators = builder.getValidation("MyModel");
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        integerValue: 11.5
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(1);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("integerValue");
            expect(errors[0].msg).to.be.equal(INVALID_INT_VALUE);
            return Promise.resolve();
        })

    })

    describe("Boolean", function () {
        let builder = new SchemaValidationBuilder();
        let str = fs.readFileSync("./test/test.json", "utf-8")
        let schema = JSON.parse(str);
        builder.buildValidation(schema);

        this.timeout(30000);
        it("should accept boolean value ", async function () {
            let validators = builder.getValidation("MyModel");
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        booleanValue: true
                    }
                })
                expect(res.errors).to.be.empty
            }
            return Promise.resolve();
        })

        it("should fail on not mappable value", async function () {
            let validators = builder.getValidation("MyModel");
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        booleanValue: "notABoolean"
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(1);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("booleanValue");
            expect(errors[0].msg).to.be.equal(INVALID_BOOLEAN_VALUE);
            return Promise.resolve();
        })

    })

    describe("Date", function () {
        let builder = new SchemaValidationBuilder();
        let str = fs.readFileSync("./test/test.json", "utf-8")
        let schema = JSON.parse(str);
        builder.buildValidation(schema);

        this.timeout(30000);
        it("should accept date value ", async function () {
            let validators = builder.getValidation("MyModel");
            let req = {
                body: {
                    dateValue: new Date().toISOString()
                }
            }
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run(req)
                errors = errors.concat(res.errors);

            }
            expect(errors).to.be.empty
            expect(req.body.dateValue).to.be.instanceOf(Date);
            return Promise.resolve();
        })

        it("should fail on not mappable value", async function () {
            let validators = builder.getValidation("MyModel");
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        dateValue: "not a date"
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(1);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("dateValue");
            expect(errors[0].msg).to.be.equal(INVALID_DATE_VALUE);
            return Promise.resolve();
        })

    })

    describe("Object field names check", function () {
        let builder = new SchemaValidationBuilder();
        let str = fs.readFileSync("./test/test.json", "utf-8")
        let schema = JSON.parse(str);
        builder.buildValidation(schema);

        this.timeout(30000);

        it("should fail on fields that are not in schema", async function () {
            let validators = builder.getValidation("MyModel");
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        unknownValue: "I dont belong here"
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(1);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].msg).to.be.equal(UNKNOWN_FIELD);
            return Promise.resolve();
        })

    })

    describe("Required value", function () {
        let builder = new SchemaValidationBuilder();
        let str = fs.readFileSync("./test/test-required.json", "utf-8")
        let schema = JSON.parse(str);
        builder.buildValidation(schema);

        this.timeout(30000);
        it("should accept when value is present", async function () {
            let validators = builder.getValidation("MyModel");
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        requiredValue: "I am here"
                    }
                })
                expect(res.errors).to.be.empty
            }
            return Promise.resolve();
        })

        it("should fail on missing value", async function () {
            let validators = builder.getValidation("MyModel");
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(2);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("requiredValue");
            expect(errors[0].msg).to.be.oneOf([INVALID_STRING_VALUE, REQUIRED_VALUE_MISSING])
            expect(errors[1].location).to.be.equal("body");
            expect(errors[1].param).to.be.equal("requiredValue");
            expect(errors[1].msg).to.be.oneOf([INVALID_STRING_VALUE, REQUIRED_VALUE_MISSING])
            return Promise.resolve();
        })

    })

    describe("array of values", function () {
        let builder = new SchemaValidationBuilder();
        let str = fs.readFileSync("./test/test-required.json", "utf-8")
        let schema = JSON.parse(str);
        builder.buildValidation(schema);

        this.timeout(30000);
        it("should accept when value is present", async function () {
            let validators = builder.getValidation("MyModel", null, true);
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: [{
                        requiredValue: "I am here"
                    }, {
                        requiredValue: "I am here"
                    }]
                })
                expect(res.errors).to.be.empty
            }
            return Promise.resolve();
        })

        it("should fail on missing value", async function () {
            let validators = builder.getValidation("MyModel", null, true);
            let errors: ValidationError[] = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: [{
                        requiredValue: "I am here"
                    }, {
                    }]
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(2);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("[1].requiredValue");
            expect(errors[0].msg).to.be.oneOf([INVALID_STRING_VALUE, REQUIRED_VALUE_MISSING])
            expect(errors[1].location).to.be.equal("body");
            expect(errors[1].param).to.be.equal("[1].requiredValue");
            expect(errors[1].msg).to.be.oneOf([INVALID_STRING_VALUE, REQUIRED_VALUE_MISSING])
            return Promise.resolve();
        })

    })

    describe("Override field", function () {
        let builder = new SchemaValidationBuilder();
        let str = fs.readFileSync("./test/test-required.json", "utf-8")
        let schema = JSON.parse(str);
        builder.buildValidation(schema);

        this.timeout(30000);
        it("should override required on value", async function () {
            let validators = builder.getValidation("MyModel", {
                "requiredValue": {
                    exists: undefined,
                    optional: true
                }
            });
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                    }
                })
                expect(res.errors).to.be.empty
            }
            return Promise.resolve();
        })

        it("should still work normally without overrides", async function () {
            let validators = builder.getValidation("MyModel");
            let errors = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(2);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("requiredValue");
            expect(errors[0].msg).to.be.oneOf([INVALID_STRING_VALUE, REQUIRED_VALUE_MISSING])
            expect(errors[1].location).to.be.equal("body");
            expect(errors[1].param).to.be.equal("requiredValue");
            expect(errors[1].msg).to.be.oneOf([INVALID_STRING_VALUE, REQUIRED_VALUE_MISSING])
            return Promise.resolve();
        })

    })

    describe("Embedded field", function () {
        let builder = new SchemaValidationBuilder();
        let str = fs.readFileSync("./test/test.json", "utf-8")
        let schema = JSON.parse(str);
        builder.buildValidation(schema);

        this.timeout(30000);
        it("should accept correct value", async function () {
            let validators = builder.getValidation("RequiredModel");
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        customValue: {
                            id: "some string that is long enough"
                        }
                    }
                })
                expect(res.errors).to.be.empty
            }
            return Promise.resolve();
        })

        it("should return correct errors ", async function () {
            let validators = builder.getValidation("RequiredModel");
            let errors = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        customValue: {
                            id: "short"
                        }
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(1);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("customValue.id");
            return Promise.resolve();
        })

        it("should return correct errors for required field", async function () {
            let validators = builder.getValidation("RequiredModel");
            let errors = [];
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                    }
                })
                errors = errors.concat(res.errors);
            }
            expect(errors).to.be.of.length(1);
            expect(errors[0].location).to.be.equal("body");
            expect(errors[0].param).to.be.equal("customValue");
            expect(errors[0].msg).to.be.equal(REQUIRED_VALUE_MISSING);
            return Promise.resolve();
        })



    })

    describe("Custom validator", function () {
        let builder = new SchemaValidationBuilder();
        let str = fs.readFileSync("./test/test.json", "utf-8")
        let schema = JSON.parse(str);
        builder.registerValidator("MyModel", {
            custom: {
                options: (value) => {
                    return value == 10;
                }
            }
        })
        builder.buildValidation(schema);

        this.timeout(30000);
        it("should use custom validation", async function () {
            let validators = builder.getValidation("MyModel");
            for (let i = 0; i < validators.length; i++) {
                const v = validators[i];
                let res = await v.run({
                    body: {
                        customValue: 10
                    }
                })
                expect(res.errors).to.be.empty
            }
            return Promise.resolve();
        })

    })
})