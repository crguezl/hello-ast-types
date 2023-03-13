#!/usr/bin/env node
/*
Example illustrating: that:

1. Arrow functions take their value of "this" from the lexical scope.
   That is, traverse the scopes until you find a "this" binding. 
   Notice that, if found, that "this" will reference the context of some function that wraps the arrow function.
2. Functions take their value of "this" from the context object.

*/
let g = {
    myVar: 'g',
    gFunc: function() { 
        console.log(this.myVar);  // g
        let obj = {
            myVar: 'foo',       
            a: () => console.log(this.myVar), //  this is the "this" of gFunc
            objFunc: function() { 
              console.log(this.myVar); // foo
              this.a()                 // g
            }
        };
        obj.objFunc()
    },    
} 
g.gFunc();
