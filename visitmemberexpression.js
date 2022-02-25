import assert from "assert";
import * as espree from  "espree";

import {
  visit,
  namedTypes as n,
} from "ast-types";

let code = `
/* Early versions of JavaScript did not allow named function expressions, 
and for this reason you could not make a recursive function expression. */

var fac = function(n) { return !(n > 1) ? 1 : arguments.callee(n - 1) * n; }
`;

let ast = espree.parse(code, {loc: false});

console.log(JSON.stringify(ast, null,2));

visit(ast, {
  // This method will be called for any node with .type "MemberExpression":
  visitMemberExpression(path) {
    // Visitor methods receive a single argument, a NodePath object
    // wrapping the node of interest.
    var node = path.node;

    if (
      n.Identifier.check(node.object) &&
      node.object.name === "arguments" &&
      n.Identifier.check(node.property)
    ) {
      if (node.property.name == "callee") console.error("Warning! 'arguments.callee' is used in this code");
    }

    // It's your responsibility to call this.traverse with some
    // NodePath object (usually the one passed into the visitor
    // method) before the visitor method returns, or return false to
    // indicate that the traversal need not continue any further down
    // this subtree.
    this.traverse(path);
  }
});