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

  const deb = (x, depth=null) => (JSON.stringify(x, depth, 2));
  var globalScope;

  var scopeCode = `
    var foo = 42;
    function bar(baz) {
      return baz + foo;
    }
`;

  var ast = parse(scopeCode);

  visit(ast, {
    visitProgram: function(path) {
      console.log(`Visiting Program node. path.scope.isGlobal= ${path.scope.isGlobal}`);
      globalScope = path.scope;
      let bindings = globalScope.getBindings();
      let names = Object.keys(bindings);
        console.log(`  names inside global scope: ${names}`);
        console.log(`  Type of the parent of foo: ${deb(bindings.foo[0].parentPath.node.type, 2)}`);
        console.log(`  Type of the parent of bar: ${deb(bindings.bar[0].parentPath.node.type)}`);
      this.traverse(path);
    },

    visitFunctionDeclaration: function(path) {
      var node = path.node;
      console.log(`Visiting FunctionDeclaration node. Is this the global scope? path.scope.isGlobal= ${path.scope.isGlobal}`);
      const name = node.id ? node.id.name : null;
      assert.strictEqual(name, "bar");
      let bindings = path.scope.getBindings();
      let names = Object.keys(bindings);
      console.log(`  names inside bar: ${names}`);
      console.log(`  Type of the parent of baz: ${deb(bindings.baz[0].parentPath.node.type)}`);
      console.log(`  The parent scope of the function scope is the global scope?`,path.scope.getGlobalScope() == globalScope);

      this.traverse(path);
    }
  });