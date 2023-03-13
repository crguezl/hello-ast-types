#!/usr/bin/env node
import { namedTypes as n, visit } from "ast-types";
import flow from "flow-parser";
const deb = (x) => JSON.stringify(x, null, 2);

let code1 = `
function tutu() {
    return this.prop+4;
}
`;
let code2 = `
function tutu() {
    return prop+4;
}
`;
let code3 = `
function tutu() {
    function titi() {
        return this.prop+4;
    }
    
    return prop+4;
}
`;
let code4 = `
  function tutu() {
    return super();
  }
`;
let code5 = `
  function tutu() {
    return super.meth();
  }
`;
let test = [code1, code2, code3, code4, code5];

test.forEach(transform);

function transform(code) {
  console.log(code);

  let ast = flow.parse(code).body[0];
  //console.log(deb(ast));
  //process.exit(0);

  function usesThis(funcNode) {
    n.Function.assert(funcNode);
    var result = false;

    visit(funcNode, {
      visitThisExpression(path) {
        result = true;
        console.log("inside thisexpression");

        // The quickest way to terminate the traversal is to call
        // this.abort(), which throws a special exception (instanceof
        // this.AbortRequest) that will be caught in the top-level
        // types.visit method, so you don't have to worry about
        // catching the exception yourself.
        this.abort();
      },

      visitFunction(path) {
        console.log("Inside Function visitor " + path.node.id.name);
        // ThisExpression nodes in nested scopes don't count as `this`
        // references for the original function node, so we can safely
        // avoid traversing this subtree.
        if (path.node !== funcNode) {
          return false;
        }
        this.traverse(path);
      },

      visitCallExpression(path) {
        const node = path.node;

        // If the function contains CallExpression nodes involving
        // super, those expressions will implicitly depend on the
        // value of `this`, even though they do not explicitly contain
        // any ThisExpression nodes.
        if (this.isSuperCallExpression(node)) {
          result = true;
          this.abort(); // Throws AbortRequest exception.
        }

        this.traverse(path);
      },

      // Yes, you can define arbitrary helper methods.
      isSuperCallExpression(callExpr) {
        //console.log('inside callExpr')
        n.CallExpression.assert(callExpr);
        return (
          this.isSuperIdentifier(callExpr) ||
          this.isSuperMemberExpression(callExpr)
        );
      },

      // And even helper helper methods!
      isSuperIdentifier(node) {
        // console.log(deb(node));
        return n.Identifier.check(node.callee) && node.callee.name === "super";
      },

      isSuperMemberExpression(node) {
        return (
          n.MemberExpression.check(node.callee) &&
          n.Identifier.check(node.callee.object) &&
          node.callee.object.name === "super"
        );
      },
    });

    return result;
  }

  console.log(usesThis(ast));
  console.log("----");
}
