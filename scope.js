import util from 'util';
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

  const deb = (x, depth=null, indent=2) => (util.inspect(x, depth, indent));
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
      var scope = path.scope;
      console.log(`Visiting FunctionDeclaration node. Is this the global scope? path.scope.isGlobal= ${scope.isGlobal}`);
      const name = node.id ? node.id.name : null;
      assert.strictEqual(name, "bar");
      let bindings = scope.getBindings();
      let names = Object.keys(bindings);
      console.log(`  names inside bar: ${names}`);
      console.log(`  Type of the parent of baz: ${deb(bindings.baz[0].parentPath.node.type)}`);
      console.log(`  The parent scope of the function scope is the global scope?`,scope.getGlobalScope() == globalScope);
      console.log(`  The scope of this function is at depth ${scope.depth}`);

      console.log(`  Is 'foo' declared at global scope? ${scope.lookup("foo") == globalScope}`);
      console.log(`  Is 'baz' declared at global scope? ${scope.lookup("baz") == globalScope}`);
      console.log(`  Is 'baz' declared at the function scope? ${scope.lookup("baz") == scope}`);
      console.log(`  Is 'bar' declared at the function scope? ${scope.lookup("bar") == scope}`);
      console.log(`  Is 'bar' declared at the global scope? ${scope.lookup("bar") == globalScope}`);

      
      this.traverse(path);
    }
  });