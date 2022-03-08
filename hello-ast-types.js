import { parse } from "espree";
import { NodePath } from "ast-types";
import cj from "color-json";

const skip = (key, value) => {
  if (key !== "start" && key !== "end" && key !== "raw") return value;
};
const deb = (x) => cj(JSON.stringify(x, skip, 2));

var programPath = new NodePath(parse("x = 1; y = 2"));

console.log(deb(programPath.node));
debugger;

var xExpressionStatement = programPath.get("body", 0);
var yExpressionStatement = programPath.get("body", 1);

var xAssignmentExpression = xExpressionStatement.get("expression");
var yAssignmentExpression = yExpressionStatement.get("expression");

console.log( // Not a direct property but an element of an array
  xExpressionStatement.node === xExpressionStatement.parent.node.body[0] // true
)
console.log(deb(xAssignmentExpression.node));
console.log(deb(yAssignmentExpression.node));
/*
{
  "type": "AssignmentExpression",
  "operator": "=",
  "left": { "type": "Identifier",  "name": "y" },
  "right": { "type": "Literal",  "value": 2 }
}
*/