#!/usr/bin/env node
import { builders as b, visit } from "ast-types";
import recast from "recast";
import flow from  "flow-parser";
import { simpleDeb as deb } from "../deb.js"

var sliceExpr = b.memberExpression(
    b.memberExpression(
      b.memberExpression(
        b.identifier("Array"),
        b.identifier("prototype"),
        false
      ),
      b.identifier("slice"),
      false
    ),
    b.identifier("call"),
    false
  );

// Array.prototype.slice.call
// console.log(deb(sliceExpr)); 

let code = `
function tutu(x, ...rest) {
    return x + rest[0];
}
module.exports = tutu;
`;

let ast = flow.parse(code, {ecmaVersion: 7, loc: false});

visit(ast, {
  visitFunction(path) {
    const node = path.node;
    this.traverse(path);

    let n = node.params.length-1;
    let lastArg = node.params[n];

    if (lastArg.type !== "RestElement") {
      return;
    } 
    node.params.pop();

    // For the purposes of this example, we won't worry about functions
    // with Expression bodies.

    const restVarDecl = b.variableDeclaration("var", [
      b.variableDeclarator(
        lastArg.argument,
        b.callExpression(sliceExpr, [
          b.identifier("arguments"),
          b.literal(n)
        ])
      )
    ]);

    path.get("body", "body").unshift(restVarDecl);

    // Delete node.rest now that we have simulated the behavior of the rest parameter using ordinary JavaScript.
    delete(node.rest);

  }
});

console.log(recast.print(ast).code);
