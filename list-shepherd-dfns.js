const xref = require("./xref/xref.json");
const fs = require("fs");

fs.writeFileSync("shepherd-dfns.json",
                 JSON.stringify(
                   Object.keys(xref)
                     .map(k => xref[k].map(e =>
                                           [k, e.type, e.spec, e.for ? e.for[0] : null]))
                     .flat()
                     .filter((x,i,a) => a.findIndex(x2 => x2[0] === x[0] && x2[1] === x[1] && x2[2] === x[2] && x2[3] === x[3]) === i)
                     .sort((a, b) => a[0].localeCompare(b[0]))
                   , null, 2)
                 , "utf-8");

