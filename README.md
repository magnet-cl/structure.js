#Structure.js

A simple, yet powerful tool to validate javascript objects, using a simple and intuitive notation.

Official Page: [http://magnet-cl.github.io/structure.js/](http://magnet-cl.github.io/structure.js/)

#Why?

A key component of every project is testing, and a common case is to test that an object complies a given set of rules. For example, *"This user object contains an id, an email and a username"*. But this is not the only case, sometimes you also need to test if these fields are what you were expecting them to be. In the previous example, username should be a string of minimum 5 characters, the id should be an integer and the email should satisfy an email regular expression.

Another typical test case is when you are working on a team and interfaces are defined. The previous example shows such an example of such interface.

Thus, Structure-js comes to the rescue. You can easily define the structure of your expected objects and test if any object complies. A  list with the tests results is given to you, explaining what went wrong and which field caused the problem.

#Examples

##Basic validations
A basic example is the validation of a simple user, first you need to define a schema for your objects:
```javascript
var s = new Structure({
    id: Number,
    first_name: String,
    last_name: String
});
```
Now, given the following objects:
```javascript
var user1 = {id: 1, first_name: "Good", last_name: "Guy"};
var user2 = {id: "2", first_name: "Bad", last_name: "Guy"};
```
You can test if they match your expected pattern:
```javascript
s.test(user1); // returns true
s.test(user2); // returns false
```
Also you can check the test results:
```
>>> s.results
[ { ok: false,
    message: 'Type of object.first_name is string, expecting number' },
  { ok: true,
    message: 'Type of object.first_name is string' },
  { ok: true,
    message: 'Type of object.last_name is string' }]
```

##Nested validations
You can go deeper declaring nested structures for your validations
```javascript
var s = new Structure({
    id: Number,
    name: String,
    location: {
        latitude: Number,
        longitude: Number
    }
});
```
Note that location is defined as a nested structure, you can nest as many levels as you want.

##Non-basic types
You can use Structre.js to test against regular expressions or user defined prototypes
```javascript
var Animal = function(name){
    this.name = name;
    /*
        ... Animal implementation ...
     */
};

var s = new Structure({
    username: /^\w+$/,
    pet: Animal
});
```