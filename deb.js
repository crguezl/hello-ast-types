import cj from "color-json";

const Radical = ["loc", "comments", "start", "end", "raw", 
                 "sourceType", "optional", "computed", 
                 "typeAnnotation"];
const Brutal = Radical.concat(["name"]);

const SkippedKeys = new Set(Radical);
const BrutalKeys = new Set(Brutal);


const skip = (key, value) => SkippedKeys.has(key)? undefined : value;
const skipBrutal = (key, value) => BrutalKeys.has(key)? undefined : value;
const colorDeb = x => cj(JSON.stringify(x, skip, 2));
const simpleDeb = x => JSON.stringify(x, skip, 2);
const deb = x => JSON.stringify(x, skipBrutal, 1);

export { deb, simpleDeb, colorDeb };