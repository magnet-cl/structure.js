Structure = (function(){
    // Constructor:
    var Structure = function(pattern){
        this.pattern = pattern || {};
        this.results = [];
    };

    // Returns false when at least one result is negative, true otherwise:
    var resultEvaluator = function(result){
        for(var i = 0; i < result.length; ++i){
            if(!result[i].ok){
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

            // Expected type for this property:
            var expected = this.pattern[property];

            // Basic type testing:
            if(basicTypes.indexOf(expected) != -1){
                var propertyValue = target[property];
                // Type matches:
                if(typeof propertyValue === expected){
                    this.results.push({
                        ok: true,
                        message: 'Type of ' + property + ' is ' + expected
                    });
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

            // To do:
            
            // ...Array vs Object.
            
            // ...Array inner types.

            // ...Nested structures.

        }

        // Check if all tests passed:
        return resultEvaluator(this.results);
    };
    return Structure;
})();