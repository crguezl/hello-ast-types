import {
    getFieldNames,
    getFieldValue,
  } from "ast-types";
  
  const partialFunExpr = { type: "FunctionExpression" };
  
  // Even though partialFunExpr doesn't actually contain all the fields that
  // are expected for a FunctionExpression, types.getFieldNames knows:
  console.log(getFieldNames(partialFunExpr));
  // [ 'type', 'id', 'params', 'body', 'generator', 'expression',
  //   'defaults', 'rest', 'async' ]
  
  // For fields that have default values, types.getFieldValue will return
  // the default if the field is not actually defined.
  console.log(getFieldValue(partialFunExpr, "generator"));
  // false