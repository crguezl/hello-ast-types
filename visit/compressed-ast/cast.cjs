// outputs a compact string representation of the AST. Example:
//   ✗ node cast.cjs 'if(a) 1; else 2'             
//   Program(IfStatement(Identifier(a)ExpressionStatement(Literal(1))ExpressionStatement(Literal(2))))
//   ✗ node cast.cjs 'while (x == 1) {}'             
//   Program(WhileStatement(BinaryExpression(==()Identifier(x)Literal(1))BlockStatement()))
const espree = require("espree");
const astTypes = require("ast-types");

const code =process.argv[2] || "a =1; b = 2;";
const ast = espree.parse(code, { ecmaVersion: espree.latestEcmaVersion });

let out = '';
astTypes.visit(ast, {
  visitNode: function(path) {
    out += path.node.type+"(";
    if (path.node.operator) {
      out += `${path.node.operator}()`;
    }
    this.traverse(path);
    if (path.node.name) {
      out += path.node.name;
    } else if (path.node.value) {
      out += path.node.value;
    }
    out += ")";
  }
});

console.log(out);