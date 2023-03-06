// outputs a compact string representation of the AST. Example:
// ✗ node cast2.cjs 'while (x == 1) {}' 0
// ["Program",["WhileStatement",["BinaryExpression","==",["Identifier","x"],["Literal",1]],["BlockStatement"]]]
// ✗ node cast2.cjs '' 0                 
// ["Program",["ExpressionStatement",["AssignmentExpression","=",["Identifier","a"],["Literal",1]]],["ExpressionStatement",["AssignmentExpression","=",["Identifier","b"],["Literal",2]]]]
const util = require("util");
const espree = require("espree");
const astTypes = require("ast-types");
const NodePath = astTypes.NodePath;

const code =process.argv[2] || "a = 1; b = 2;";
const ast = espree.parse(code, { ecmaVersion: espree.latestEcmaVersion });

let past = new NodePath(ast);
astTypes.visit(past, {
  visitNode: function(path) {
    path.cast = [ path.node.type ];
    if (path.node.operator) {
      path.cast.push(path.node.operator);
    }
    this.traverse(path);
    if (path.node.name) {
      path.cast.push(path.node.name);
    } else if (path.node.value) {
      path.cast.push(path.node.value);
    }
    path.parent?.cast.push(path.cast);
  }
});

//console.log(JSON.stringify(past.cast, null, space));
console.log(util.inspect(past.cast, { depth: null }))