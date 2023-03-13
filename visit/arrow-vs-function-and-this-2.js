#!/usr/bin/env node
/*
Example illustrating: that:

1. Arrow functions take their value of "this" from the lexical scope.
2. Functions take their value of "this" from the context object.

*/
let g = {
    myVar: 'g',
    gFunc: function () {
        console.log(this.myVar);  // g
        function chuchu() {
            let nestedObj = {
                myVar: 'foo',
                a: () => console.log(this), //  undefined. this is taken from "chuchu"
                objFunc: function () {
                    console.log(this.myVar); // foo
                    this.a()                 // g
                }
            };
            nestedObj.objFunc() // foo
        }
        chuchu();
    },
}
g.gFunc();
