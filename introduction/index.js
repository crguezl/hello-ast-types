import assert from "assert";
import {
  namedTypes as n,
  builders as b,
} from "ast-types";
import recast from 'recast';

/* Build the AST for
if (foo) foo();
*/

var fooId = b.identifier("foo");
debugger;
var ifFoo = b.ifStatement(fooId, b.blockStatement([
  b.expressionStatement(b.callExpression(fooId, []))
]));

assert.ok(n.IfStatement.check(ifFoo));
assert.ok(n.Statement.check(ifFoo));
assert.ok(n.Node.check(ifFoo));

assert.ok(n.BlockStatement.check(ifFoo.consequent));
assert.strictEqual(
  ifFoo.consequent.body[0].expression.arguments.length,
  0,
);

assert.strictEqual(ifFoo.test, fooId);
assert.ok(n.Expression.check(ifFoo.test));
assert.ok(n.Identifier.check(ifFoo.test));
assert.ok(!n.Statement.check(ifFoo.test));

console.log(JSON.stringify(ifFoo,null,2));
console.log(recast.print(ifFoo).code);