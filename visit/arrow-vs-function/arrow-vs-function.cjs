//"use strict"; // comment and uncomment to see the difference

/* 
When a function is defined inside another function, the value of "this" can change. 
In particular, when a nested function is defined inside another function, 
the value of "this" inside the nested function is not automatically inherited from the parent function.

Instead, the value of "this" inside the nested function will depend on how the function is called. 
If the nested function is called with a specific "this" value using call(), apply(), or bind(), 
then that value will be used. 
If not, the value of "this" inside the nested function will default to the global object (in non-strict mode) or undefined (in strict mode).

In contrast, when a function is declared in the global scope, the value of "this" is determined by the global object. 
In a web browser environment, the global object is typically the window object. 
In node is the global object.
Therefore, when a function is defined in the global scope, "this" will refer to the global object 
unless the function is called with a specific "this" value.
*/
function parentFunction() {
  console.log("parentFunction: ",(typeof this !== 'undefined')); // If no-strict "true" else "false". Global "this" is used
  const arrowFunction = () => {
    console.log("arrowFunction: ",typeof this !== 'undefined'); // Same. If no-strict "true". Global "this" is used
  };
  arrowFunction();
}

parentFunction();
