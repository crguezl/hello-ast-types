import { namedTypes as n, builders as b, visit } from "ast-types";
import flow from "flow-parser";
import util from 'util';
const ins = x => util.inspect(x, {depth:3});

const codes = [
    `$a = 4 + 2 , $b = 5 * $a , $print($b)`, // no declarations
    `const $print = console.log; let $a; let $b; $a = 4 + 2 , $b = 5 * $a , $print($b);`
];

codes.forEach(code => {
    let ast = flow.parse(code);
    visit(ast, {
        visitProgram(path) {
            console.log(ins(Object.keys(path.scope.getBindings())));
            this.traverse(path)
        }        
    })
})

