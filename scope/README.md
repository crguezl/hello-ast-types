## Output for scope.js

```
➜  scope git:(master) ✗ node scope.js 
Visiting Program node. path.scope.isGlobal= true
  names inside global scope: foo,bar
  Type of the parent of foo: 'VariableDeclarator'
  Type of the parent of bar: 'FunctionDeclaration'
Visiting FunctionDeclaration node. Is this the global scope? path.scope.isGlobal= false
  names inside bar: baz
  Type of the parent of baz: 'FunctionDeclaration'
  The parent scope of the function scope is the global scope? true
  The scope of this function is at depth 1
  Is 'foo' declared at global scope? true
  Is 'baz' declared at global scope? false
  Is 'baz' declared at the function scope? true
  Is 'bar' declared at the function scope? false
  Is 'bar' declared at the global scope? true
  ```