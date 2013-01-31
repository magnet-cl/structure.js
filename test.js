Structure = require('./structure');

var testStructure = new Structure({
  boolean1: "boolean",
  boolean2: Boolean,
  function1: "function",
  function2: Function,
  positiveInteger: 'number',
  negativeInteger: 'number',
  positiveFloat: "number",
  negativeFloatNumber: "number",
  object1: "object",
  object2: Object,
  string1: 'string',
  string2: String,
  array: "array",
  regExp1: /\w+/,
  regExp2: new RegExp("\w"),
  email: 'email'
});

var example = {
  boolean1: true,
  boolean2: false,
  function1: function(){console.log('hello')},
  function2: console.log,
  positiveInteger: 1,
  negativeInteger: -2,
  positiveFloat: 3.4,
  negativeFloatNumber: -5.6,
  object1: {},
  object2: this,
  string1: 'Testing is fun',
  string2: "Structure is even more fun",
  array: [1,2,3],
  regExp1: 'a',
  regExp2: 'b',
  email: 'magnet@magnet.cl',
};

console.log("The structure is valid: " + testStructure.test(example, 'example'));
console.log(testStructure.results);
