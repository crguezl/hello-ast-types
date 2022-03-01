import assert from "assert";
import { parse } from "espree";
import { namedTypes as n, NodePath,} from "ast-types";

// "catch block scope" https://astexplorer.net/#/gist/f00452c960b249ed36aacc08cacaaa34/646c9796cf42772a97f8b6448a12e99f7610838c
var catchWithVarDecl = `
  function foo(e) {
    try {
      bar();
    } catch (e) {
      var f = e + 1;
      return function(g) {
        return e + g;
      };
    }
    return f;
  }
`;

var path = new NodePath(parse(catchWithVarDecl));
var fooPath = path.get("body", 0);
var fooScope = fooPath.scope;
var catchPath = fooPath.get("body", "body", 0, "handler");
var catchScope = catchPath.scope;

// it should not affect outer scope declarations
n.FunctionDeclaration.assert(fooScope.node);
assert.strictEqual(fooScope.declares("e"), true);
assert.strictEqual(fooScope.declares("f"), true);
assert.strictEqual(fooScope.lookup("e"), fooScope);

//it should declare only the guard parameter
n.CatchClause.assert(catchScope.node);
assert.strictEqual(catchScope.declares("e"), true);
assert.strictEqual(catchScope.declares("f"), false);

assert.strictEqual(catchScope.lookup("e"), catchScope);
assert.strictEqual(catchScope.lookup("f"), fooScope);

//it should shadow only the parameter in nested scopes
var closurePath = catchPath.get("body", "body", 1, "argument");
var closureScope = closurePath.scope;
n.FunctionExpression.assert(closureScope.node);

assert.strictEqual(closureScope.declares("e"), false);
assert.strictEqual(closureScope.declares("f"), false);
assert.strictEqual(closureScope.declares("g"), true);

assert.strictEqual(closureScope.lookup("g"), closureScope);
assert.strictEqual(closureScope.lookup("e"), catchScope);
assert.strictEqual(closureScope.lookup("f"), fooScope);

