import assert from "assert";
import { parse, Syntax } from "espree";
import {
    Type,
    namedTypes as n,
    builders as b,
    Path,
    NodePath,
    PathVisitor,
    builtInTypes as builtin,
    use,
    getSupertypeNames,
    getFieldValue,
    eachField,
    visit,
    defineMethod,
    astNodesAreEquivalent,
  } from "ast-types";

  const deb = x => (JSON.stringify(x, null, 2));
  var globalScope;

  var scope = `
    var foo = 42;
    function bar(baz) {
      return baz + foo;
    }
`;

  var ast = parse(scope);

  visit(ast, {
    visitProgram: function(path) {
      console.log(`Visiting Program node. path.scope.isGlobal= ${path.scope.isGlobal}`);
      globalScope = path.scope;
      console.log(globalScope);
      this.traverse(path);
    },

    visitFunctionDeclaration: function(path) {
      var node = path.node;
      console.log(`Visiting FunctionDeclaration node. path.scope.isGlobal= ${path.scope.isGlobal}`);


      const name = node.id ? node.id.name : null;
      assert.strictEqual(name, "bar");
      console.log(deb(path.scope));
      console.log(path.scope.parent == globalScope);

      console.log(path.scope.getGlobalScope() == globalScope);

      this.traverse(path);
    }
  });