const fs = require("fs");

const mapTypes = t => t.replace('css-', '');

const ignoreOld = [
  "webauthn-1", // replaced by webauthn-2
  "svg", // replaced by SVG2
  "css2", // outdated
  "css-conditional-3", // outdated? @@@
  "css-template-1", // abandoned
  "css-egg-1", // joke
  "css-preslev-1", // abandoned
  "json-ld11-api", // now browser
  "fingerprinting-guidance-1",// non normative
  "css-2018",// non normative 
  "css-2020", // non normative
  "box-tree-api-1", // not ready yet?
  "css-2015", // non normative
  "css-2017", // non normative
  "hr-time-2", // hr time 3
  "custom-1", // now in filters
  "navigation-timing-1" // navigation-timing-2
]

const ignoreType = ["html"]; // https://github.com/tidoust/reffy/issues/332#issuecomment-648092475

const mapSpec = {
  "webidl": "webidl-1",
  "webxr-hit-test-1": "hit-test",
  "webxr-layers-1": "layers",
  "webxr-dom-overlays-1": "dom-overlays",
  "css-exclusions-1": "css3-exclusions",
  "ui-events-1": "uievents",
  "webappsec-fetch-metadata-1": "fetch-metadata",
  "web-background-sync-1": "background-sync"
}

const canonicalizeTerm = dfn =>
      // https://github.com/tidoust/reffy/issues/332#issuecomment-648234059
      (["method", "function", "constructor"].includes(dfn[1]) ? dfn[0].replace(/\([^\)]*\)/, '()')
       // https://github.com/tidoust/reffy/issues/332#issuecomment-648278220
       // html includes quoted terms, where shepherd mostly dismisses the quotes (maybe for good reasons)
       : (dfn[1] === "enum-value" || dfn[2] === "html" ? dfn[0].replace(/^"/, '').replace(/"$/, '')
          : (
            dfn[1] === "value" || dfn[1] === "css-value") && dfn[0].match(/^'.*'$/) ? dfn[0].replace(/^'/,"").replace(/'$/, "") // ignore single quotes wrapping https://github.com/tidoust/reffy/issues/332#issuecomment-648606994
          : dfn[0]))
      .toLowerCase() // TODO: make sure the cases where this is needed are legit for reffy (to reduce the work in ignoring old shepherd data)

       // https://github.com/tidoust/reffy/issues/332#issuecomment-648275828
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      // shepherd replaces curly apostrophe with simple one @@@
      .replace(/’/g, "'");

const reffy = require("./reffy-dfns.json").map(d => [canonicalizeTerm(d), d[1], d[2], d[3]]);

const shepherd = require("./shepherd-dfns.json");


const reviewedDiffs = ["compositing-1",
                       "compositing-2", // https://github.com/tidoust/reffy/issues/332#issuecomment-648283605
                       "css-color-3", // "color", "opacity" properties, <alpha-value>, <color> types not properly marked up, currentColor (camel case in -3, lower case in 4?) value not properly marked up; bogus "color:<color>" entry in shepherd
                       "css3-exclusions", // shepherd use data from old draft
                       // "css-fonts-3", // FIXME Reffy parses -4 because of the mix up on nightly drafts
                       // "geometry-1"
                       "network-error-logging-1", // https://github.com/tidoust/reffy/issues/332#issuecomment-648642550,
                       "web-animations-1", // shepherd extracts method name with return type?,
                       "webxr-layers-1" // shepherd extracts bogus definitions https://github.com/immersive-web/layers/pulls
];

//console.error(JSON.stringify([...new Set(shepherd.map(x => x[2]).filter(x => !ignoreOld.includes(x) && !reffy.find(y => (mapSpec[x] || x).startsWith(y[2].toLowerCase()))))], null, 2));

    const diff = 
          shepherd.filter(dfn => 
                          !ignoreOld.includes(dfn[2]) && !reffy.find(d => d[0] === canonicalizeTerm(dfn) && (ignoreType.includes(dfn[2]) || d[1] === mapTypes(dfn[1])) && (mapSpec[dfn[2]] || dfn[2]).startsWith(d[2].toLowerCase())))
          .sort((a, b) => a[1].localeCompare(b[1]))
          .filter(d => !reviewedDiffs.includes(d[2]))
          .map(d => { return {term: d[0], type: d[1], spec: d[2], for: d[3]};})
console.log(
  JSON.stringify(diff, null, 2)
);

