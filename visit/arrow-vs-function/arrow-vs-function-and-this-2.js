#!/usr/bin/env node
/*
Example illustrating: that:

1. Arrow functions take their value of "this" from the lexical scope 
   and it is taken from the parent function scope even if the "this" in that scope is undefined.
2. Functions take their value of "this" from the context object.

When a function is defined inside another function, the value of "this" can change. 
In particular, when a nested function is defined inside another function, 
the value of "this" inside the nested function is not automatically inherited from the parent function.

Instead, the value of "this" inside the nested function will depend on how the function is called. 
If the nested function is called with a specific "this" value using call(), apply(), or bind(), 
then that value will be used. 
If not, the value of "this" inside the nested function will default to the global object (in non-strict mode) or undefined (in strict mode).
*/
let g = {
    myVar: 'g',
    gFunc: function () {
        console.log(this.myVar);  // g
        function chuchu() { // Function without a defined "this"
            let nestedObj = {
                myVar: 'foo',
                a: () => console.log("arrow function: ",this), //  1
                objFunc: function () {
                    console.log(this.myVar); // foo
                    this.a()                 // g
                }
            };
            nestedObj.objFunc() // foo
        }
        chuchu(); // 1: undefined. "this" is taken from the one it exists on "chuchu" wich is "undefined"
        chuchu.call({ myVar: 'bar' }) // 1: Now "chuchu" has a "this" and the arrow function logs the new "this" of "chuchu": { myVar: 'bar' } 
    },
}
g.gFunc();
