Structure = (function(){
    // Constructor:
    var Structure = function(schema){
        this.schema = schema || {};
        this.results = [];

        /* This is false to make tests fail when an array is found and
           an object was expected, adding stricter semantics.
           Change this to true to respect javascript's 'typeof' values. */
        this.arraysAreObjects = false;

        /* This is true to make tests fail when regular expresions are
           tested with objects that are not strings (nulls, undefineds, etc).
           For example, prevents /\w+/.test(null) of returning true.
           Change this to false to respect javascript's RegExp behavior. */
        this.regExpRequiresString = true;
    };

    // Returns false when at least one result is negative, true otherwise:
    var resultEvaluator = function(results){
        for(var i = 0; i < results.length; ++i){
            if(!results[i].ok){
                return false;
            }
        }
        return true;
    };

    // Validates when object type is a primitive type, handling special cases:
    var basicTypeValidator = function(options){
        var target = options.target;
        var expected = options.expected;
        var path = options.path;
        var results = options.results;
        var arraysAreObjects = options.arraysAreObjects;

        // Object is not defined:
        if(typeof target === 'undefined'){
            results.push({
                ok: false,
                message: 'Missing ' + path + ', expecting ' + expected
            });
            return;
        }

        // Type matches:
        if(typeof target === expected){
            
            // Special case, check for custom semantics for arrays:
            if(!arraysAreObjects && expected === 'object'){
                
                // It is an Array, but semantics reject it as an object:
                if(target instanceof Array){
                    results.push({
                        ok: false,
                        message: path + ' is an Array, expecting object ' +
                            '(Structure.arraysAreObjects is set to false)'
                    });
                // Is a not-an-array-object:
                }else{
                    results.push({
                        ok: true,
                        message: 'Type of ' + path + ' is ' + expected
                    });
                }
            // Basic type match, no special case:
            }else{
                results.push({
                    ok: true,
                    message: 'Type of ' + path + ' is ' + expected
                });
            }

        // Type doesn't match:
        }else{
            results.push({
                ok: false,
                message: 'Type of ' + path + ' is ' + (typeof target) +
                    ', expecting ' + expected
            });
        }
    };

    // Validates when the target is an array:
    var arrayValidator = function(options){
        var target = options.target;
        var path = options.path;
        var results = options.results;

        // Object is not defined:
        if(typeof target === 'undefined'){
            results.push({
                ok: false,
                message: 'Missing ' + path + ', expecting an Array'
            });
            return;
        }

        // Check if Array is in the prototype chain:
        if(target instanceof Array){
            results.push({
                ok: true,
                message: path + ' is an Array'
            });
        }else{
            results.push({
                ok: false,
                message: 'Type of ' + path + ' is ' + (typeof target) +
                    ', expecting an Array'
            });
        }
    };

    // Validates when the target matches a given regular expression:
    var regExpValidator = function(options){
        var target = options.target;
        var regExp = options.regExp;
        var path = options.path;
        var results = options.results;
        var regExpRequiresString = options.regExpRequiresString;

        // If RegExp requires strings, fail if target isn't one:
        if(regExpRequiresString && typeof target !== 'string'){
            if(typeof target === 'undefined'){
                results.push({
                    ok: false,
                    message: 'Missing ' + path + ', expecting a string ' +
                        'that matches ' + regExp.toString()
                });
            }else{
                results.push({
                    ok: false,
                    message: 'Type of ' + path + ' is ' + (typeof target) +
                        ', expecting a string that matches ' +
                        regExp.toString() + ' (Structure.' +
                        'regExpRequiresString is set to false)'
                });
            }
            return;
        }

        // Check if target matches:
        if(regExp.test(target)){
            results.push({
                ok: true,
                message: path + ' matches ' + regExp.toString()
            });
        }else{
            results.push({
                ok: false,
                message: path + " doesn't match " + regExp.toString()
            });
        }
    };

    /* Custom structure used to represent special schema requirements like
       specific array contents or specific numeric ranges. */
    var CustomStructure = function(){
        this.validator = function(){};
    };

    /* Tests if something is an object, but not an array or other valid
       schema node. Useful to find trees in schemas. */
    var isNotAStructureObject = function(obj){
        var result = typeof obj === 'object';
        result = result && !(obj instanceof Array);
        result = result && !(obj instanceof RegExp);
        result = result && !(obj instanceof Structure);
        result = result && !(obj instanceof CustomStructure);
        return result;
    };

    // Represents a numeric range in a schema:
    Structure.NumericRange = function(lower, upper){
        var customStructure = new CustomStructure();
        var bounds = [lower, upper];

        // Validator used to test a numric range:
        customStructure.validator = function(options){
            var target = options.target;
            var path = options.path;
            var results = options.results;

            // Target is not defined:
            if(typeof target === 'undefined'){
                results.push({
                    ok: false,
                    message: 'Missing ' + path + ', expecting a number'
                });
                return;
            }

            // Is not a number:
            if(typeof target !== 'number'){
                results.push({
                    ok: false,
                    message: 'Type of ' + path + ' is ' + (typeof target) +
                    ', expecting number in range [' + bounds[0] + ', ' +
                    bounds[1] + ']'
                });
                return;
            }

            // Lower bound is defined:
            if(typeof bounds[0] === 'number'){
                // Check it:
                if(bounds[0] <= target){
                    results.push({
                        ok: true,
                        message: path + ' is equal or larger than ' + bounds[0]
                    });
                }else{
                    results.push({
                        ok: false,
                        message: path + ' is not equal or larger than ' +
                        bounds[0] + " (it's " + target + ')'
                    });
                }
            }

            // Upper bound is defined:
            if(typeof bounds[1] === 'number'){
                // Check it:
                if(target <= bounds[1]){
                    results.push({
                        ok: true,
                        message: path + ' is equal or less than ' + bounds[1]
                    });
                }else{
                    results.push({
                        ok: false,
                        message: path + ' is not equal or less than ' +
                        bounds[1] + " (it's " + target + ')'
                    });
                }
            }
        };
        return customStructure;
    };

    // Represent an array with specific contents in a schema:
    Structure.ArrayOf = function(){
        var customStructure = new CustomStructure();
        var validTypes = [];
        // Copy arguments into an Array (because arguments it's not an Array!):
        for(var a = 0; a < arguments.length; ++a){
            validTypes.push(arguments[a]);
        }

        // Validator ussed to test contents of an array:
        customStructure.validator = function(options){
            var target = options.target;
            var path = options.path;
            var results = options.results;
            var tempResults = [];
            var i = 0;
            var j = 0;
            var r = 0;

            // Test if it's an array:
            arrayValidator({
                target: target,
                path: path,
                results: tempResults
            });

            // Copy array test results:
            for(r = 0; r < tempResults.length; ++r){
                results.push(tempResults[r]);
            }

            // Is not an array, abort:
            if(!resultEvaluator(tempResults)){
                return;
            }

            var allOk = true;
            // For each element in the array:
            for(i = 0; i < target.length; i++){
                // Tests each valid type:
                for(j = 0; j < validTypes.length; ++j){
                    var testStructure = new Structure(validTypes[j]);
                    if(testStructure.test(target[i])){
                        break;
                    }
                }

                // No break at this point is an invalid content type:
                allOk = false;
                results.push({
                    ok: false,
                    message: path + ' does not have a valid content type ' +
                    'at position ' + i + '. "' + target[i] + '" does not ' +
                    'match (' + validTypes.join('|') + ')'
                });
            }
        };
        return customStructure;
    };

    // Test the structure of the target against the stored schema:
    Structure.prototype.test = function(target, path){
        path = path || 'object';

        // Clear results:
        this.results = [];

        // List of basic types:
        var basicTypes = ['boolean', 'function', 'number',
                         'object', 'string', 'xml'];

        // Basic type testing:
        if(basicTypes.indexOf(this.schema) !== -1){

            basicTypeValidator({
                target: target,
                expected: this.schema,
                path: path,
                results: this.results,
                arraysAreObjects: this.arraysAreObjects
            });
        }

        // Explicit array requirement:
        if(this.schema === 'array'){
            
            arrayValidator({
                target: target,
                path: path,
                results: this.results
            });
        }

        // String regular expresion match:
        if(this.schema instanceof RegExp){

            regExpValidator({
                target: target,
                regExp: this.schema,
                path: path,
                results: this.results,
                regExpRequiresString: this.regExpRequiresString
            });
        }

        // Custom structure:
        if(this.schema instanceof CustomStructure){
            this.schema.validator({
                target: target,
                path: path,
                results: this.results
            });
        }

        // Nested structure:
        if(this.schema instanceof Structure){
            // Recursive evaluation:
            this.schema.test(target, path);
            var nestedResults = this.schema.results;
            // Append nested results to results of this Structure:
            for(var i = 0; i < nestedResults.length; ++i){
                this.results.push(nestedResults[i]);
            }
        }

        // Tree:
        if(isNotAStructureObject(this.schema)){
            // Abort if target is undefined or null:
            if(typeof target === "undefined" || target === null){
                this.results.push({
                    ok: false,
                    message: path + " can't be " + target
                });
                return resultEvaluator(this.results);
            }

            // Explore and test each property:
            for(var property in this.schema){
                // Expected type and current value for this property:
                var expected = this.schema[property];
                var propertyValue = target[property];

                // Build a nested schema to test the property:
                var structure = new Structure(expected);
                structure.test(propertyValue, path + '.' + property);

                // Append nested results:
                for(var i = 0; i < structure.results.length; ++i){
                    this.results.push(structure.results[i]);
                }

            }
        }


        // Check if all tests passed:
        return resultEvaluator(this.results);
    };
    return Structure;
})();