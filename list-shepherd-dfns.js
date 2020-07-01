const xref = require("./xref/xref.json");
const fs = require("fs");

const mapSpec = {
  "console-1": "console",
  "csp3": "CSP3",
  "encoding-1": "encoding",
  "fileapi-1": "FileAPI",
  "generic-sensor-1": "generic-sensor",
  "image-resource-1": "image-resource",
  "indexeddb-2": "IndexedDB-2",
  "intersection-observer-1": "intersection-observer",
  "mixed-content-1": "mixed-content",
  "sms-one-time-codes-1": "sms-one-time-codes",
  "secure-contexts-1": "secure-contexts",
  "screen-orientation-1": "screen-orientation",
  "quirks-1": "quirks",
  "referrer-policy-1": "referrer-policy",
  "payment-method-basic-card-1": "payment-method-basic-card",
  "payment-method-id-1": "payment-method-id",
  "payment-request-1": "payment-request",
  "permissions-1": "permissions",
  "permissions-request-1": "permissions-request",
  "permissions-revoke-1": "permissions-revoke",

  "sri-1": "SRI",
  "svg2": "SVG2",
  "webxr-1": "webxr",
  "webusb-1": "webusb",
  "webrtc-stats-1": "webrtc-stats",
  "webrtc-1": "webrtc",
  "web-bluetooth-1": "web-bluetooth",
  "web-share-1": "web-share",
  "upgrade-insecure-requests-1": "upgrade-insecure-requests",
  "webidl": "WebIDL-1",
  "webxr-hit-test-1": "hit-test",
  "webxr-layers-1": "layers",
  "webxr-dom-overlays-1": "dom-overlays",
  "css-exclusions-1": "css3-exclusions",
  "ui-events-1": "uievents",
  "webappsec-fetch-metadata-1": "fetch-metadata",
  "web-background-sync-1": "background-sync"
}

const fixSpecId = id => {
  if (mapSpec[id]) return mapSpec[id];
  return id;
};

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


fs.writeFileSync("shepherd-dfns.json",
                 JSON.stringify(
                   Object.keys(xref)
                     .map(k => xref[k]
                          .filter(e => !ignoreOld.includes(e.spec))
                          .map(e =>
                               { return {text:k, type: e.type.replace(/^css-/, ''), spec: fixSpecId(e.spec), "for": e.for, id: fixSpecId(e.spec) + "#" + e.uri.split("#")[1]};}))
                     .flat()
                     .filter((d, i, a) => a.findIndex(d2 => d2.text === d.text &&  d2.type === d.type && d2.id === d.id) === i)
                     .sort((a,b) => a.id.localeCompare(b.id))
                   , null, 2)
                 , "utf-8");

