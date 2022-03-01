import { namedTypes as n, builders as b, visit } from "ast-types";
import recast from "recast";
import flow from  "flow-parser";
import util from 'util';
const deb = x => (JSON.stringify(x, null,2));
const ins = x => util.inspect(x, {depth:3});

const code = `
const a = 4;

function tutu(a) {
    const b = a+1;
    return b;
}

tutu(a);
`;

let ast = flow.parse(code);
visit(ast, {
    visitFunction(path) {
        const node = path.node;

        console.log('/*----- tutu scope ----*/');

        console.log(Object.keys(path.scope.getBindings())); /* [ 'a', 'b' ] */

        console.log('/*----- global scope ----*/');
        console.log(ins(path.parent.scope.getBindings())); /* { a: [ NodePath {... } ], tutu: [   NodePath { ...}  ] } */

        this.abort();

        //this.traverse(path)
    },

    /*
    visitProgram(path) {
        const node = path.node;

        console.log(ins(path.scope.getBindings()));

        this.traverse(path)
    }
    */
})

