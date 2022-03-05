import { namedTypes as n, builders as b, visit } from "ast-types";
import recast from "recast";
import flow from  "flow-parser";
//import * as flow from 'espree';

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
//console.log(recast.print(sliceExpr).code);

let code = `
function tutu(x, ...rest) {
    return x + rest[0];
}
`;

// Warning!!! the AST produced by flow doesn't seem to be fully compatible with ast-types
let ast = flow.parse(code, {ecmaVersion: 7, loc: false});

//console.log(JSON.stringify(ast, null,2));

visit(ast, {
  // This method will be called for any node whose type is a subtype of
  // Function (e.g., FunctionDeclaration, FunctionExpression, and
  // ArrowFunctionExpression). Note that types.visit precomputes a
  // lookup table from every known type to the appropriate visitor
  // method to call for nodes of that type, so the dispatch takes
  // constant time.
  visitFunction(path) {
    // Visitor methods receive a single argument, a NodePath object
    // wrapping the node of interest.
    const node = path.node;

    // It's your responsibility to call this.traverse with some
    // NodePath object (usually the one passed into the visitor
    // method) before the visitor method returns, or return false to
    // indicate that the traversal need not continue any further down
    // this subtree. An assertion will fail if you forget, which is
    // awesome, because it means you will never again make the
    // disastrous mistake of forgetting to traverse a subtree. Also
    // cool: because you can call this method at any point in the
    // visitor method, it's up to you whether your traversal is
    // pre-order, post-order, or both!
    this.traverse(path);

    // This traversal is only concerned with Function nodes that have
    // rest parameters.
    // console.log(node.params[0]);

    let lastArg = node.params[node.params.length-1];

    if (lastArg.type !== "RestElement") {
      //console.log("No rest argument in this function!")
      return;
    } 
    node.params.pop();
    //console.log("Found a RestElement in this function")
    
    
    // For the purposes of this example, we won't worry about functions
    // with Expression bodies.
    n.BlockStatement.assert(node.body);

    // Use types.builders to build a variable declaration of the form
    //
    //   var rest = Array.prototype.slice.call(arguments, n);
    //
    // where `rest` is the name of the rest parameter, and `n` is a
    // numeric literal specifying the number of named parameters the
    // function takes.
    const restVarDecl = b.variableDeclaration("var", [
      b.variableDeclarator(
        lastArg.argument,
        b.callExpression(sliceExpr, [
          b.identifier("arguments"),
          b.literal(node.params.length)
        ])
      )
    ]);
    // console.log(recast.print(restVarDecl).code)

    // Similar to doing node.body.body.unshift(restVarDecl), except
    // that the other NodePath objects wrapping body statements will
    // have their indexes updated to accommodate the new statement.
    path.get("body", "body").unshift(restVarDecl);

    
    // Nullify node.rest now that we have simulated the behavior of
    // the rest parameter using ordinary JavaScript.
    // path.get("rest").replace(null);

    /*
    // There's nothing wrong with doing node.rest = null, but I wanted
    // to point out that the above statement has the same effect.
    assert.strictEqual(node.rest, null);
    */
  }
});

console.log(recast.print(ast).code);
