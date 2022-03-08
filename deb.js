import cj from "color-json";

const SkippedKeys = new Set(["start", "end", "raw", "sourceType"]);
const skip = (key, value) => SkippedKeys.has(key)? undefined : value;
const deb = x => cj(JSON.stringify(x, skip, 2));

export default deb;