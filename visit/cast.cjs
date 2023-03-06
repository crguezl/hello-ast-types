// outputs a compact string representation of the AST
const espree = require("espree");
const astTypes = require("ast-types");

const code =process.argv[2] || "a =1; b = 2;";
const ast = espree.parse(code, { ecmaVersion: espree.latestEcmaVersion });

let out = '';
astTypes.visit(ast, {
  visitNode: function(path) {
    out += path.node.type+"(";
    if (path.node.type === "AssignmentExpression") {
      out += `${path.node.operator}()`;
    }
    this.traverse(path);
    if (path.node.type === "Identifier") {
      out += path.node.name;
    } else if (path.node.type === "Literal") {
      out += path.node.value;
    }
    out += ")";
  }
});

console.log(out);