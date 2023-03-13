#!/usr/bin/env node
/*
Example illustrating: that:

1. Arrow functions take their value of "this" from the lexical scope 
   and it is taken from the parent function scope even if the "this" in that scope is undefined.
2. Functions take their value of "this" from the context object.
*/
let g = {
    myVar: 'g',
    gFunc: function () {
        console.log(this.myVar);  // g
        function chuchu() { // Function without a defined "this"
            let nestedObj = {
                myVar: 'foo',
                a: () => console.log(this), //  1
                objFunc: function () {
                    console.log(this.myVar); // foo
                    this.a()                 // g
                }
            };
            nestedObj.objFunc() // foo
        }
        chuchu(); // 1: undefined. "this" is taken from the one it exists on "chuchu"
        chuchu.call({ myVar: 'bar' }) // 1: Now "chuchu" has a "this" and the arrow function logs the new "this" of "chuchu": { myVar: 'bar' } 
    },
}
g.gFunc();
