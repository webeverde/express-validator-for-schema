
# express-validator-for-schema
Generates schema validation for a given JSON Schema. https://express-validator.github.io/docs/schema-validation.html

Sorry that this is not packaged properly yet.

**Usage**:

    import { SchemaValidationBuilder } from  "express-validator-for-schema";
    let  builder  =  new  SchemaValidationBuilder();
    let  str  =  fs.readFileSync("./test/test.json", "utf-8")
    let  schema  =  JSON.parse(str);
    builder.buildValidation(schema);
    
    
    
    router.post('/my-model', builder.getValidation("MyModel"), (req:  express.Request, res:  express.Response) => {
	    // Handle errors 
	    const  errors  =  validationResult(req);
	    if (!errors.isEmpty()) {
		    return  res.status(422).json({ errors:  errors.array() });
	    }
	    // Everything is ok
    })
