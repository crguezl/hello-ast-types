//import  * as espree from "espree";
import recast from "recast";
import { builders as b, visit } from "ast-types";

let ast = b.functionDeclaration(
  b.identifier("fn"),
  [],
  b.blockStatement([
    b.variableDeclaration("var", [
      b.variableDeclarator(b.identifier("a"), b.literal("hello world!")),
    ]),
  ])
);
console.log(recast.print(ast).code) // function fn() { var a = "hello world!"; }

visit(ast, {
  visitVariableDeclaration: function (path) {
    path.replace(b.returnStatement(null));
    this.traverse(path);
  },
});

console.log(ast.body.body[0]); // { argument: null, loc: null, type: 'ReturnStatement', comments: null }
console.log(recast.print(ast).code) // function fn() { return; }
