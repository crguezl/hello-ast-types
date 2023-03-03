# Learning ast-types 

The examples here are based in the examples in <https://github.com/benjamn/ast-types>
README.md

## index.js

```
$ node index.js > salida.js
```

The AST built for 

```js
if (foo) {
    foo();
}
```

is:

```js
{
  "test": {
    "name": "foo",
    "loc": null,
    "type": "Identifier",
    "comments": null,
    "optional": false,
    "typeAnnotation": null
  },
  "consequent": {
    "body": [
      {
        "expression": {
          "callee": {
            "name": "foo",
            "loc": null,
            "type": "Identifier",
            "comments": null,
            "optional": false,
            "typeAnnotation": null
          },
          "arguments": [],
          "loc": null,
          "type": "CallExpression",
          "comments": null,
          "optional": false,
          "typeArguments": null
        },
        "loc": null,
        "type": "ExpressionStatement",
        "comments": null
      }
    ],
    "loc": null,
    "type": "BlockStatement",
    "comments": null,
    "directives": []
  },
  "alternate": null,
  "loc": null,
  "type": "IfStatement",
  "comments": null
}
```

## visitmemberexpression.js 

```
➜  hello-ast-types git:(flow-parser) ✗ node visitmemberexpression.js 
Input:

/* Early versions of JavaScript did not allow named function expressions, 
and for this reason you could not make a recursive function expression. 
May be you want to detect uses of this old trick to update the code.
*/

var fac = function(n) { return !(n > 1) ? 1 : arguments.callee(n - 1) * n; }

---
Warning! 'arguments.callee' is used in this code
```

## spread-operator.js

Translate ES6 spread operator to older versions of JS.

Transforming `...rest` parameters into browser-runnable ES5 JavaScript:


For the input:

```js 
let code = `
function tutu(x, ...rest) {
    return x + rest[0];
}
`;
```

gives the output:

```js
➜  hello-ast-types git:(flow-parser) ✗ node spread-operator.js
{ parse: [Function (anonymous)] }
function tutu(x) {
    var rest = Array.prototype.slice.call(arguments, 1);
    return x + rest[0];
}
```

## check-this-usage.js

Implement a function that determines if a given function node refers to `this`

This example has been modified regarding not only the usage of `super`  but also due to the fact
that `visitFunction` is triggered by the outer function and the original  produced an erroneous result 


```
➜  hello-ast-types git:(master) ✗ npm run this

> hello-ast-types@1.0.0 this
> node check-this-usage.js


function tutu() {
    return this.prop+4;
}

Inside Function visitor tutu
inside thisexpression
true
----

function tutu() {
    return prop+4;
}

Inside Function visitor tutu
false
----

function tutu() {
    function titi() {
        return this.prop+4;
    }
    
    return prop+4;
}

Inside Function visitor tutu
Inside Function visitor titi
false
----

  function tutu() {
    return super();
  }

Inside Function visitor tutu
true
----

  function tutu() {
    return super.meth();
  }

Inside Function visitor tutu
true
----
```


