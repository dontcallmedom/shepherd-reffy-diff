const fs = require("fs");


let list = [];

const idlTypes = ["method", "attribute", "dict-member", "enum-value"];

const dirs = ["../reffy-reports/ed/dfns/", "./node_modules/reffy-reports/tr/dfns/", ];

for (let dir of dirs) {
  const files = fs.readdirSync(dir);
  files.filter(f => f.match('\.json'))
    .forEach(file => {
      const spec = file.slice(0, file.length - 5);
      const {dfns} = JSON.parse(fs.readFileSync(dir + file, 'utf-8'));
      dfns.forEach(dfn => {
        dfn.linkingText.forEach(text =>
                                list.push({text:text, type:dfn.type, spec, "for":dfn.for, id:spec + "#" + dfn.id})
                               )
      });
    });
  // we keep the 1st definition when there is more than one
  // since that's the one coming from the editors draft
  list = list.filter((dfn, i, a) => a.findIndex(d => d.id === dfn.id) === i);
  fs.writeFileSync("reffy-dfns.json", JSON.stringify(list, null, 2), "utf-8");
}

