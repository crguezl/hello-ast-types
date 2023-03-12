/* Early versions of JavaScript did not allow named function expressions, 
and for this reason you could not make a recursive function expression. 
May be you want to detect uses of this old trick to update the code.
*/

import flow from  "flow-parser";
import { visit, namedTypes as n, } from "ast-types";

let code = `var fac = function(n) { return !(n > 1) ? 1 : arguments.callee(n - 1) * n; }`;

console.log(`Input:\n${code}\n---`);

let ast = flow.parse(code, {loc: false});

visit(ast, {
  visitMemberExpression(path) {
    var node = path.node;

    if (
      n.Identifier.check(node.object) &&
      node.object.name === "arguments" &&
      n.Identifier.check(node.property) &&
      node.property.name === "callee"
    ) { console.error("Warning! 'arguments.callee' is used in this code"); }

    this.traverse(path);
  }
});