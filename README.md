#Structure.js

A simple, yet powerful tool to validate javascript objects

#Why?

A key component of every project is testing, and a common case is to test that an  object complies a given set of rules. For example, *"This user object contains an id, an email and a username"*. But this is not the only case, sometimes you also need to test if these fields are what you were expecting them to be. In the previous example, username should be a string of minimum 5 characters, the id should be an integer and the email should satisfy an email regular expression. 

Another typical test case is when you are working on a team and interfaces are defined. The previous example shows such an example of such interface. 

Thus, Structure-js comes to the rescue. You can easily define the structure of your expected objects and test if any object complies. A  list with the tests results is given to you, explaining what went wrong and which field caused the problem.

#Examples:
