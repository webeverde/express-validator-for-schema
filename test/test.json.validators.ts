/**
 * Json representation of the validation schema structur to use in tests
 */

export const TEST_JSON_VALIDATORS = {
    "MyModel": {
        "booleanValue": {
            "in": [
                "body"
            ],
            "isBoolean": {
                "errorMessage": "INVALID_BOOLEAN_VALUE"
            },
            "optional": true,
            "toBoolean": true
        },
        "customValue": {
            "in": [
                "body"
            ],
            "optional": true
        },
        "customValue.id": {
            "errorMessage": "INVALID_STRING_VALUE",
            "in": [
                "body"
            ],
            "isLength": {
                "errorMessage": "INVALID_LENGTH",
                "options": {
                    "min": 20
                }
            },
            "isString": {
                "errorMessage": "INVALID_STRING_VALUE"
            },
            "optional": true
        },
        "customValue.someNumber": {
            "errorMessage": "INVALID_FLOAT_VALUE",
            "in": [
                "body"
            ],
            "isFloat": {
                "errorMessage": "INVALID_FLOAT_VALUE",
                "options": {
                    "max": 10,
                    "min": 0
                }
            },
            "optional": true,
            "toFloat": true
        },
        "embeddedArray": {
            "in": [
                "body"
            ],
            "isArray": {
                "errorMessage": "INVALID_ARRAY_VALUE"
            },
            "optional": true
        },
        "embeddedArray.*.id": {
            "errorMessage": "INVALID_STRING_VALUE",
            "in": [
                "body"
            ],
            "isLength": {
                "errorMessage": "INVALID_LENGTH",
                "options": {
                    "min": 20
                }
            },
            "isString": {
                "errorMessage": "INVALID_STRING_VALUE"
            },
            "optional": true
        },
        "embeddedArray.*.someNumber": {
            "errorMessage": "INVALID_FLOAT_VALUE",
            "in": [
                "body"
            ],
            "isFloat": {
                "errorMessage": "INVALID_FLOAT_VALUE",
                "options": {
                    "max": 10,
                    "min": 0
                }
            },
            "optional": true,
            "toFloat": true
        },
        "dateValue": {
            "custom": {
                "errorMessage": "INVALID_DATE_VALUE",
            },
            "errorMessage": "INVALID_DATE_VALUE",
            "in": [
                "body"
            ],
            "isString": true,
            "optional": true,
            "toDate": true
        },
        "enumArray": {
            "errorMessage": "INVALID_ENUM_VALUE",
            "in": [
                "body"
            ],
            "isArray": {
                "errorMessage": "INVALID_ARRAY_VALUE"
            },
            "isIn": {
                "errorMessage": "INVALID_ENUM_VALUE",
                "options": [
                    [
                        "ONE",
                        "TWO"
                    ]
                ]
            },
            "optional": true
        },
        "enumField": {
            "errorMessage": "INVALID_ENUM_VALUE",
            "in": [
                "body"
            ],
            "isIn": {
                "errorMessage": "INVALID_ENUM_VALUE",
                "options": [
                    [
                        "ONE",
                        "TWO"
                    ]
                ]
            },
            "optional": true
        },
        "integerValue": {
            "errorMessage": "INVALID_INT_VALUE",
            "in": [
                "body"
            ],
            "isInt": true,
            "optional": true
        },
        "numberArray": {
            "errorMessage": "INVALID_FLOAT_VALUE",
            "in": [
                "body"
            ],
            "isArray": {
                "errorMessage": "INVALID_ARRAY_VALUE"
            },
            "isFloat": {
                "errorMessage": "INVALID_FLOAT_VALUE",
                "options": {}
            },
            "optional": true,
            "toFloat": true
        },
        "numberMaxMin": {
            "errorMessage": "INVALID_FLOAT_VALUE",
            "in": [
                "body"
            ],
            "isFloat": {
                "errorMessage": "INVALID_FLOAT_VALUE",
                "options": {
                    "max": 10,
                    "min": 0
                }
            },
            "optional": true,
            "toFloat": true
        },
        "stringLength": {
            "errorMessage": "INVALID_STRING_VALUE",
            "in": [
                "body"
            ],
            "isLength": {
                "errorMessage": "INVALID_LENGTH",
                "options": {
                    "max": 20,
                    "min": 10
                }
            },
            "isString": {
                "errorMessage": "INVALID_STRING_VALUE"
            },
            "optional": true
        },
        "stringLengthArray": {
            "in": [
                "body"
            ],
            "isArray": {
                "errorMessage": "INVALID_ARRAY_VALUE"
            },
            "isLength": {
                "errorMessage": "INVALID_LENGTH",
                "options": {
                    "max": 20,
                    "min": 10
                }
            },
            "optional": true
        }
    },
    "OtherModel": {
        "id": {
            "errorMessage": "INVALID_STRING_VALUE",
            "in": [
                "body"
            ],
            "isLength": {
                "errorMessage": "INVALID_LENGTH",
                "options": {
                    "min": 20
                }
            },
            "isString": {
                "errorMessage": "INVALID_STRING_VALUE"
            },
            "optional": true
        },
        "someNumber": {
            "errorMessage": "INVALID_FLOAT_VALUE",
            "in": [
                "body"
            ],
            "isFloat": {
                "errorMessage": "INVALID_FLOAT_VALUE",
                "options": {
                    "max": 10,
                    "min": 0
                }
            },
            "optional": true,
            "toFloat": true
        }
    },
    "RequiredModel": {
        "customValue": {
            "exists": {
                "errorMessage": "REQUIRED_VALUE_MISSING",
                "options": {
                    "checkNull": true
                }
            },
            "in": [
                "body"
            ]
        },
        "customValue.id": {
            "errorMessage": "INVALID_STRING_VALUE",
            "in": [
                "body"
            ],
            "isLength": {
                "errorMessage": "INVALID_LENGTH",
                "options": {
                    "min": 20
                }
            },
            "isString": {
                "errorMessage": "INVALID_STRING_VALUE"
            },
            "optional": true
        },
        "customValue.someNumber": {
            "errorMessage": "INVALID_FLOAT_VALUE",
            "in": [
                "body"
            ],
            "isFloat": {
                "errorMessage": "INVALID_FLOAT_VALUE",
                "options": {
                    "max": 10,
                    "min": 0
                }
            },
            "optional": true,
            "toFloat": true
        },
        "embedded": {
            "in": [
                "body"
            ],
            "optional": true
        },
        "embedded.booleanValue": {
            "in": [
                "body"
            ],
            "isBoolean": {
                "errorMessage": "INVALID_BOOLEAN_VALUE"
            },
            "optional": true,
            "toBoolean": true
        },
        "embedded.customValue": {
            "in": [
                "body"
            ],
            "optional": true
        },
        "embedded.customValue.id": {
            "errorMessage": "INVALID_STRING_VALUE",
            "in": [
                "body"
            ],
            "isLength": {
                "errorMessage": "INVALID_LENGTH",
                "options": {
                    "min": 20
                }
            },
            "isString": {
                "errorMessage": "INVALID_STRING_VALUE"
            },
            "optional": true
        },
        "embedded.customValue.someNumber": {
            "errorMessage": "INVALID_FLOAT_VALUE",
            "in": [
                "body"
            ],
            "isFloat": {
                "errorMessage": "INVALID_FLOAT_VALUE",
                "options": {
                    "max": 10,
                    "min": 0
                }
            },
            "optional": true,
            "toFloat": true
        },
        "embedded.dateValue": {
            "custom": {
                "errorMessage": "INVALID_DATE_VALUE"
            },
            "errorMessage": "INVALID_DATE_VALUE",
            "in": [
                "body"
            ],
            "isString": true,
            "optional": true,
            "toDate": true
        },
        "embedded.enumArray": {
            "errorMessage": "INVALID_ENUM_VALUE",
            "in": [
                "body"
            ],
            "isArray": {
                "errorMessage": "INVALID_ARRAY_VALUE"
            },
            "isIn": {
                "errorMessage": "INVALID_ENUM_VALUE",
                "options": [
                    [
                        "ONE",
                        "TWO"
                    ]
                ]
            },
            "optional": true
        },
        "embedded.enumField": {
            "errorMessage": "INVALID_ENUM_VALUE",
            "in": [
                "body"
            ],
            "isIn": {
                "errorMessage": "INVALID_ENUM_VALUE",
                "options": [
                    [
                        "ONE",
                        "TWO"
                    ]
                ]
            },
            "optional": true
        },
        "embedded.embeddedArray": {
            "in": [
                "body"
            ],
            "isArray": {
                "errorMessage": "INVALID_ARRAY_VALUE"
            },
            "optional": true
        },
        "embedded.embeddedArray.*.id": {
            "errorMessage": "INVALID_STRING_VALUE",
            "in": [
                "body"
            ],
            "isLength": {
                "errorMessage": "INVALID_LENGTH",
                "options": {
                    "min": 20
                }
            },
            "isString": {
                "errorMessage": "INVALID_STRING_VALUE"
            },
            "optional": true
        },
        "embedded.embeddedArray.*.someNumber": {
            "errorMessage": "INVALID_FLOAT_VALUE",
            "in": [
                "body"
            ],
            "isFloat": {
                "errorMessage": "INVALID_FLOAT_VALUE",
                "options": {
                    "max": 10,
                    "min": 0
                }
            },
            "optional": true,
            "toFloat": true
        },
        "embedded.integerValue": {
            "errorMessage": "INVALID_INT_VALUE",
            "in": [
                "body"
            ],
            "isInt": true,
            "optional": true
        },
        "embedded.numberArray": {
            "errorMessage": "INVALID_FLOAT_VALUE",
            "in": [
                "body"
            ],
            "isArray": {
                "errorMessage": "INVALID_ARRAY_VALUE"
            },
            "isFloat": {
                "errorMessage": "INVALID_FLOAT_VALUE",
                "options": {}
            },
            "optional": true,
            "toFloat": true
        },
        "embedded.numberMaxMin": {
            "errorMessage": "INVALID_FLOAT_VALUE",
            "in": [
                "body"
            ],
            "isFloat": {
                "errorMessage": "INVALID_FLOAT_VALUE",
                "options": {
                    "max": 10,
                    "min": 0
                }
            },
            "optional": true,
            "toFloat": true
        },
        "embedded.stringLength": {
            "errorMessage": "INVALID_STRING_VALUE",
            "in": [
                "body"
            ],
            "isLength": {
                "errorMessage": "INVALID_LENGTH",
                "options": {
                    "max": 20,
                    "min": 10
                }
            },
            "isString": {
                "errorMessage": "INVALID_STRING_VALUE"
            },
            "optional": true
        },
        "embedded.stringLengthArray": {
            "in": [
                "body"
            ],
            "isArray": {
                "errorMessage": "INVALID_ARRAY_VALUE"
            },
            "isLength": {
                "errorMessage": "INVALID_LENGTH",
                "options": {
                    "max": 20,
                    "min": 10
                }
            },
            "optional": true
        }
    }
}

