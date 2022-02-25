import {
    namedTypes as n,
    builders as b,
  } from "ast-types";
  import recast from 'recast';
  
import { eachField } from "ast-types";

const fooId = b.identifier("foo");
const node = b.ifStatement(fooId, b.blockStatement([
    b.expressionStatement(b.callExpression(fooId, []))
  ]));

const copy = {};

// Iterate over all defined fields of an object, including those missing
// or undefined, passing each field name and effective value (as returned
// by getFieldValue) to the callback. If the object has no corresponding
// Def, the callback will never be called.
// export function eachField(object, callback, context) {
//    getFieldNames(object).forEach(function(name) {
//      callback.call(this, name, getFieldValue(object, name));
//    }, context);
//  }
eachField(node, function(name, value) {
  // Note that undefined fields will be visited too, according to
  // the rules associated with node.type, and default field values
  // will be substituted if appropriate.
  copy[name] = value;
})

console.log(recast.print(copy).code);