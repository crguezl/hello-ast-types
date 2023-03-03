import { builders as b } from "ast-types";
import recast from "recast";
import { eachField } from "ast-types";
const deb = x => (JSON.stringify(x, null,2));

/* Let us build a node corresponding to s.t. like: 
const dupNode = flow.parse(`if (foo) foo()`).body[0];
console.log(dupNode) */
const fooId = b.identifier("foo");
const node = b.ifStatement(
               fooId,
                b.blockStatement([
                    b.expressionStatement(
                        b.callExpression(fooId, []))
                ])
);

// Now let us copy it using eachField to traverse the original
const copy = {};

// eachField iterates over all defined fields of an object, including those missing
// or undefined, passing to the callback each field name and effective value (as returned
// by getFieldValue). If the object has no corresponding
// Def, the callback will never be called. Here is the code:
// export function eachField(object, callback, context) {
//    getFieldNames(object).forEach(function(name) {
//      callback.call(this, name, getFieldValue(object, name));
//    }, context);
//  }
eachField(node, function (name, value) {
  // Note that undefined fields will be visited too, according to
  // the rules associated with node.type, and default field values
  // will be substituted if appropriate.
  copy[name] = value;
});

node.test.loc = "Is it a shallow copy?"
console.log(deb(copy)); // the output shows that it is a shallow copy

console.log(recast.print(copy).code); /* if (foo) { foo(); } */