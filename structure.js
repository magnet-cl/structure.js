Structure = (function(){
    // Constructor:
    var Structure = function(pattern){
        this.pattern = pattern || {};
        this.results = [];

        /* This is false to make tests fail when an array is found and
           a object was expected, adding stricter semantics.
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

    // Test the structure of the target against the stored pattern:
    Structure.prototype.test = function(target){
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
        for(var property in this.pattern){

            // Expected type and current value for this property:
            var expected = this.pattern[property];
            var propertyValue = target[property];

            // Basic type testing:
            if(basicTypes.indexOf(expected) != -1){

                // Type matches:
                if(typeof propertyValue === expected){
                    
                    // Special case, check for custom semantics for arrays:
                    if(!this.arraysAreObjects && expected === 'object'){
                        
                        // Is an Array, but semantics reject it as an object:
                        if(propertyValue instanceof Array){
                            this.results.push({
                                ok: false,
                                message: 'Property ' + property + ' is an ' +
                                    'Array, expecting object (Structure.' + 
                                    'arraysAreObjects is set to false)'
                            });
                        // Is a not-an-array-object:
                        }else{
                            this.results.push({
                                ok: true,
                                message: 'Type of ' + property + ' is object'
                            });
                        }
                    // Basic type match, no special case:
                    }else{
                        this.results.push({
                            ok: true,
                            message: 'Type of ' + property + ' is ' + expected
                        });
                    }

                // Type doesn't match:
                }else{
                    // Because property is not defined:
                    if(typeof propertyValue === 'undefined'){
                        this.results.push({
                            ok: false,
                            message: 'Missing property ' + property +
                                ', expecting ' + expected
                        });
                    // Or because property is defined incorrectly:
                    }else{
                        this.results.push({
                            ok: false,
                            message: 'Type of ' + property + ' is ' + (typeof
                                propertyValue) + ', expecting ' + expected
                        });
                    }
                }
            }

            // Explicit array requirement:
            if(expected == 'array'){

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

            // To do:
            
            // ...Array inner types.

            // ...Nested structures.

        }

        // Check if all tests passed:
        return resultEvaluator(this.results);
    };
    return Structure;
})();