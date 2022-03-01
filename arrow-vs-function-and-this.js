/*
Example illustrating: that:

1. Arrow functions take their value of "this" from the lexical scope.
2. Functions take their value of "this" from the context object.

*/
let g = {
    myVar: 'g',
    gFunc: function() { 
        console.log(this.myVar);  // global
        let obj = {
            myVar: 'foo',       
            a: () => console.log(this.myVar), //  this is the "this" of gFunc
            objFunc: function() { 
              console.log(this.myVar); // foo
              this.a()                 // global
            }
        };
        obj.objFunc()
    },    
} 
g.gFunc();
