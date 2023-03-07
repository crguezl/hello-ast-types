import {
    getFieldNames,
    getFieldValue,
  } from "ast-types";
  
  const dummyNode = { type: "FunctionExpression" };
  
  // Even though dummyNode doesn't actually contain all the fields that
  // are expected for a FunctionExpression, types.getFieldNames knows:
  console.log(getFieldNames(dummyNode));
  /*
  [
  'type',           'id',
  'params',         'body',
  'generator',      'async',
  'expression',     'defaults',
  'rest',           'returnType',
  'typeParameters', 'predicate'
  ]
  */

  // For fields that have default values, types.getFieldValue will return
  // the default if the field is not actually defined.
  console.log(getFieldValue(dummyNode, "id"));
  // null