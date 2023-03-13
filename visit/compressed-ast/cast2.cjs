// outputs a compact string representation of the AST. Example:
// ✗ node cast2.cjs 'while (x == 1) {}' 0
// ["Program",["WhileStatement",["BinaryExpression","==",["Identifier","x"],["Literal",1]],["BlockStatement"]]]
// ✗ node cast2.cjs '' 0                 
// ["Program",["ExpressionStatement",["AssignmentExpression","=",["Identifier","a"],["Literal",1]]],["ExpressionStatement",["AssignmentExpression","=",["Identifier","b"],["Literal",2]]]]
const espree = require("espree");
const astTypes = require("ast-types");

const code =process.argv[2] || "a =1; b = 2;";
const depth = process.argv[3] || null;
const ast = espree.parse(code, { ecmaVersion: espree.latestEcmaVersion });

let tree = [];
let top = () => tree[tree.length - 1];

astTypes.visit(ast, {
  visitNode: function(path) {
    let oldTree = tree;
    tree.push([ path.node.type ]);
    tree = top();
    if (path.node.operator) {
      tree.push(path.node.operator);
    }
    this.traverse(path);
    if (path.node.name) {
      tree.push(path.node.name);
    } else if (path.node.value) {
      tree.push(path.node.value);
    }
    oldTree.pop();
    oldTree.push(tree);
    tree = oldTree;
  }
});

console.log(JSON.stringify(tree[0], depth));