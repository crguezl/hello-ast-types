import assert from "assert";
import { parse, Syntax } from "esprima";
import { namedTypes as n, visit, NodePath,} from "ast-types";
import * as esprimaFb from "esprima-fb"; // Esprima-FB is a fork of the Harmony branch of Esprima that implements JSX specification on top of ECMAScript syntax.

  var scope = `
    var foo = 42;
    function bar(baz) {
      return baz + foo;
    }
    var nom = function rom(pom) {
      var zom;
      return rom(pom);
    };
  `;

  // it("getBindings should get local and global scope bindings", function() {
    var ast = parse(scope);
    var checked = [];

    visit(ast, {
      visitProgram: function(path) {
        var bindings = path.scope.getBindings();
        assert.deepEqual(["bar", "foo", "nom"], Object.keys(bindings).sort());
        assert.equal(1, bindings.foo.length);
        assert.equal(1, bindings.bar.length);
        checked.push(path.node);
        this.traverse(path);
      },

      visitFunctionDeclaration: function(path) {
        var bindings = path.scope.getBindings();
        assert.deepEqual(["baz"], Object.keys(bindings));
        assert.equal(1, bindings.baz.length);
        checked.push(path.node);
        this.traverse(path);
      },

      visitReturnStatement: function(path) {
        var node = path.node;
        if (n.CallExpression.check(node.argument) &&
            n.Identifier.check(node.argument.callee) &&
            node.argument.callee.name === "rom") {
          var bindings = path.scope.getBindings();
          assert.deepEqual(["pom", "rom", "zom"], Object.keys(bindings).sort());
          checked.push(node);
        }
        this.traverse(path);
      }
    });

    assert.deepEqual(
      checked.map(function(node) { return node.type; }),
      ['Program', 'FunctionDeclaration', 'ReturnStatement']
    );
  

  //it("getBindings should work for import statements (esprima-fb)", function() {
    var ast = esprimaFb.parse(`
        import {x, y as z} from 'xy'
        import xyDefault from 'xy';
        import * as xyNamespace from 'xy';`,
      {sourceType: "module"}
    );

    var names;

    visit(ast, {
      visitProgram: function(path) {
        names = Object.keys(path.scope.getBindings()).sort();
        this.traverse(path);
      }
    });

    assert.deepEqual(names, ["x", "xyDefault", "xyNamespace", "z"]);
  
/*
  it("getBindings should work for import statements (acorn)", function() {
    var ast = babylonParse([
      "import {x, y as z} from 'xy';",
      "import xyDefault from 'xy';",
      "import * as xyNamespace from 'xy';"
    ].join("\n"), {
      sourceType: "module",
      ecmaVersion: 6
    });

    var names;

    visit(ast, {
      visitProgram: function(path) {
        names = Object.keys(path.scope.getBindings()).sort();
        this.traverse(path);
      }
    });

    assert.deepEqual(names, ["x", "xyDefault", "xyNamespace", "z"]);
  });

  describe("getBindings should work with destructuring operations", function() {
    const code = `
function aFunction(arg1, { arg2 }) {
  const { arg3, nested: { something: arg4 } } = arg1;
  const [arg5] = arg1;
  return 0;
}`;
    for (const { parser, parserName } of [
      { parser: parse, parserName: "esprima" },
      { parser: babylonParse, parserName: "babel" }
    ]) {
      it(`produces the correct bindings with ${parserName} parser`, function() {
        const ast = parser(code);

        visit(ast, {
          visitReturnStatement: function(path) {
            const names = Object.keys(path.scope.getBindings()).sort();
            assert.deepEqual(names, ["arg1", "arg2", "arg3", "arg4", "arg5"]);
            return false;
          }
        })
      });
    }
  });

  (nodeMajorVersion >= 6 ? it : xit)
  ("should work for ES6 syntax (espree)", function() {
    var names;

    var ast = espree.parse([
      "var zap;",
      "export default function(zom) {",
      "    var innerFn = function(zip) {};",
      "    return innerFn(zom);",
      "};"
    ].join("\n"), {
      sourceType: "module",
      ecmaVersion: 2020,
    });

    visit(ast, {
      visitFunctionDeclaration: function(path) {
        names = Object.keys(path.scope.lookup("zap").getBindings()).sort();
        assert.deepEqual(names, ["zap"]);
        this.traverse(path);
      }
    });
  });

(nodeMajorVersion >= 6 ? it : xit)
  ("should work with classes for ES6 syntax (espree)", function() {
    var names;

    var ast = espree.parse([
      "var zap;",
      "export default class {",
      "    render () {",
      "        var innerFn = function(zip) {};",
      "        return innerFn(zom);",
      "    }",
      "};"
    ].join("\n"), {
      sourceType: "module",
      ecmaVersion: 2020,
    });

    visit(ast, {
      visitCallExpression: function(path) {
        names = Object.keys(path.scope.lookup("zap").getBindings()).sort();
        assert.deepEqual(names, ["zap"]);
        this.traverse(path);
      }
    });
  });

  it("should inject temporary into current scope", function() {
    var ast = parse(scope.join("\n"));
    var bindings;

    visit(ast, {
      visitProgram: function(path) {
        path.scope.injectTemporary();
        bindings = path.scope.getBindings();
        assert.deepEqual(["bar", "foo", "nom", "t$0$0"], Object.keys(bindings).sort());
        this.traverse(path);
      },

      visitFunctionDeclaration: function(path) {
        path.scope.injectTemporary(
          path.scope.declareTemporary("t$")
        )
        bindings = path.scope.getBindings();
        assert.deepEqual(["baz", "t$1$0"], Object.keys(bindings));
        this.traverse(path);
      }
    });
  });

  it("declareTemporary should use distinct names in nested scopes", function() {
    var ast = parse(scope.join("\n"));
    var globalVarDecl: any;
    var barVarDecl: any;
    var romVarDecl: any;

    visit(ast, {
      visitProgram: function(path) {
        path.get("body").unshift(
          globalVarDecl = b.variableDeclaration("var", [
            b.variableDeclarator(
              path.scope.declareTemporary("$"),
              b.literal("global")
            ),
            b.variableDeclarator(
              path.scope.declareTemporary("$"),
              b.literal("global")
            )
          ])
        );

        this.traverse(path);
      },

      visitFunction: function(path) {
        var funcId = path.value.id;

        var varDecl = b.variableDeclaration("var", [
          b.variableDeclarator(
            path.scope.declareTemporary("$"),
            b.literal(funcId.name + 1)
          ),
          b.variableDeclarator(
            path.scope.declareTemporary("$"),
            b.literal(funcId.name + 2)
          )
        ]);

        path.get("body", "body").unshift(varDecl);

        if (funcId.name === "bar") {
          barVarDecl = varDecl;
        } else if (funcId.name === "rom") {
          romVarDecl = varDecl;
        }

        this.traverse(path);
      }
    });

    assert.strictEqual(globalVarDecl.declarations[0].id.name, "$0$0");
    assert.strictEqual(globalVarDecl.declarations[1].id.name, "$0$1");
    assert.strictEqual(barVarDecl.declarations[0].id.name, "$1$0");
    assert.strictEqual(barVarDecl.declarations[1].id.name, "$1$1");
    assert.strictEqual(romVarDecl.declarations[0].id.name, "$1$0");
    assert.strictEqual(romVarDecl.declarations[1].id.name, "$1$1");
  });

*/