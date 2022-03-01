//import  * as espree from "espree";
import { parse } from "espree";
import {  NodePath } from "ast-types";

  const deb = x => (JSON.stringify(x, null, 2));

  var programPath = new NodePath(parse("var y = 1,x = 2;"));
  
  var variableDeclaration = programPath.get("body", 0); 
  // { ... declarations: [ VariableDeclarator, VariableDeclarator], ... }
  
  var yVariableDeclaratorPath = variableDeclaration.get("declarations", 0);
  var xVariableDeclaratorPath = variableDeclaration.get("declarations", 1);

  var remainingNodePath = yVariableDeclaratorPath.prune(); // returns the closest parent NodePath
  remainingNodePath = xVariableDeclaratorPath.prune();

  console.log(deb(programPath.node)); 
  /*
  {
  "type": "Program",
  "start": 0,
  "end": 16,
  "body": [],
  "sourceType": "script"
}
*/
