const fs = require("fs");


const list = [];

const idlTypes = ["method", "attribute", "dict-member", "enum-value"];

const dirs = ["./node_modules/reffy-reports/tr/dfns/", "./node_modules/reffy-reports/ed/dfns/"];

for (let dir of dirs) {
  const files = fs.readdirSync(dir);
  files.filter(f => f.match('\.json'))
    .forEach(file => {
      const spec = file.slice(0, file.length - 5);
      const {dfns} = JSON.parse(fs.readFileSync(dir + file, 'utf-8'));
      dfns.forEach(dfn => {
        dfn.linkingText.forEach(text =>
                                list.push([text, dfn.type, spec, dfn.for[0]])
                               )
      });
    });
  list.sort((a, b) => a[0].localeCompare(b[0]));
  fs.writeFileSync("reffy-dfns.json", JSON.stringify(list, null, 2), "utf-8");
}

