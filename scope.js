import { namedTypes as n, builders as b, visit } from "ast-types";
import recast from "recast";
import flow from  "flow-parser";
const deb = x => (JSON.stringify(x, null,2));

const code = `
const a = 4;

function tutu(a) {
    const b = a+1;
    function titi(x) {
        return x+1:
    }
    return b;
}

tutu(a);
`;

let ast = flow.parse(code);

visit(ast, {

    visitVariableDeclarator(path) {
        const node = path.node;
        console.log(node.id.name, path.scope.isGlobal, path.scope.depth);

        this.traverse(path)
    }
})

