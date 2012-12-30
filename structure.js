Structure = (function(){
    // Constructor:
    var Structure = function(schema){
        this.schema = schema || {};
        this.results = [];

        /* This is false to make tests fail when an array is found and
           an object was expected, adding stricter semantics.
           Change this to true to respect javascript's 'typeof' values. */
        this.arraysAreObjects = false;
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

        // Type matching:
        if(typeof target === expected){
            
            // Special case, check for custom semantics for arrays:
            if(!this.arraysAreObjects && expected === 'object'){
                
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
            // Because property is not defined:
            if(typeof target === 'undefined'){
                results.push({
                    ok: false,
                    message: 'Missing ' + path + ', expecting ' + expected
                });
            // Or because property is defined incorrectly:
            }else{
                results.push({
                    ok: false,
                    message: 'Type of ' + path + ' is ' + (typeof target) +
                        ', expecting ' + expected
                });
            }
        }
    };

    // Test the structure of the target against the stored schema:
    Structure.prototype.test = function(target, path){
        path = path || 'object';

        // Clear results:
        this.results = [];

        // Abort if target is undefined or null:
        if(typeof target === "undefined" || target == null){
            this.results.push({
                ok: false,
                message: "Test target can't be " + target
            });
            return resultEvaluator(this.results);
        }

        // List of basic types:
        var basicTypes = ['boolean', 'function', 'number',
                         'object', 'string', 'xml'];

        // Test object's structure:
        for(var property in this.schema){

            // Expected type and current value for this property:
            var expected = this.schema[property];
            var propertyValue = target[property];

            // Basic type testing:
            if(basicTypes.indexOf(expected) != -1){

                basicTypeValidator({
                    target: propertyValue,
                    expected: expected,
                    path: path + '.' + property,
                    results: this.results
                });
            }

            // Explicit array requirement:
            if(expected === 'array'){
                if(propertyValue instanceof Array){
                    this.results.push({
                        ok: true,
                        message: 'Property ' + property + ' is an Array'
                    });
                }else{
                    this.results.push({
                        ok: false,
                        message: 'Type of ' + property + ' is ' + (typeof
                            propertyValue) + ', expecting an Array'
                    });
                }
            }

            // String regular expresion match:
            if(expected instanceof RegExp){
                if(expected.test(propertyValue)){
                    this.results.push({
                        ok: true,
                        message: 'Property ' + property + ' matches ' +
                            expected.toString()
                    });
                }else{
                    this.results.push({
                        ok: true,
                        message: 'Property ' + property + " doesn't match " +
                            expected.toString()
                    });
                }
            }

            // Nested structure:
            if(expected instanceof Structure){
                // Recursive evaluation:
                expected.test(propertyValue);
                var nestedResults = expected.results;
                // Append nested results to results of this Structure:
                for(var i = 0; i < nestedResults.length; ++i){
                    this.results.push(nestedResults[i]);
                }
            }

            // To do:
            
            // ...Array inner types.

        }

        // Check if all tests passed:
        return resultEvaluator(this.results);
    };
    return Structure;
})();