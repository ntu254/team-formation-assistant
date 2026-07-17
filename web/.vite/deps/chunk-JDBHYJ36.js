// node_modules/std-env/dist/index.mjs
var r = /* @__PURE__ */ Object.create(null);
var i = (e) => {
  var _a7, _b5;
  return ((_a7 = globalThis.process) == null ? void 0 : _a7.env) || import.meta.env || ((_b5 = globalThis.Deno) == null ? void 0 : _b5.env.toObject()) || globalThis.__env__ || (e ? r : globalThis);
};
var o = new Proxy(r, { get(e, s) {
  return i()[s] ?? r[s];
}, has(e, s) {
  const E = i();
  return s in E || s in r;
}, set(e, s, E) {
  const B = i(true);
  return B[s] = E, true;
}, deleteProperty(e, s) {
  if (!s) return false;
  const E = i(true);
  return delete E[s], true;
}, ownKeys() {
  const e = i(true);
  return Object.keys(e);
} });
var t = typeof process < "u" && process.env && "development" || "";
var f = [["APPVEYOR"], ["AWS_AMPLIFY", "AWS_APP_ID", { ci: true }], ["AZURE_PIPELINES", "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"], ["AZURE_STATIC", "INPUT_AZURE_STATIC_WEB_APPS_API_TOKEN"], ["APPCIRCLE", "AC_APPCIRCLE"], ["BAMBOO", "bamboo_planKey"], ["BITBUCKET", "BITBUCKET_COMMIT"], ["BITRISE", "BITRISE_IO"], ["BUDDY", "BUDDY_WORKSPACE_ID"], ["BUILDKITE"], ["CIRCLE", "CIRCLECI"], ["CIRRUS", "CIRRUS_CI"], ["CLOUDFLARE_PAGES", "CF_PAGES", { ci: true }], ["CLOUDFLARE_WORKERS", "WORKERS_CI", { ci: true }], ["CODEBUILD", "CODEBUILD_BUILD_ARN"], ["CODEFRESH", "CF_BUILD_ID"], ["DRONE"], ["DRONE", "DRONE_BUILD_EVENT"], ["DSARI"], ["GITHUB_ACTIONS"], ["GITLAB", "GITLAB_CI"], ["GITLAB", "CI_MERGE_REQUEST_ID"], ["GOCD", "GO_PIPELINE_LABEL"], ["LAYERCI"], ["HUDSON", "HUDSON_URL"], ["JENKINS", "JENKINS_URL"], ["MAGNUM"], ["NETLIFY"], ["NETLIFY", "NETLIFY_LOCAL", { ci: false }], ["NEVERCODE"], ["RENDER"], ["SAIL", "SAILCI"], ["SEMAPHORE"], ["SCREWDRIVER"], ["SHIPPABLE"], ["SOLANO", "TDDIUM"], ["STRIDER"], ["TEAMCITY", "TEAMCITY_VERSION"], ["TRAVIS"], ["VERCEL", "NOW_BUILDER"], ["VERCEL", "VERCEL", { ci: false }], ["VERCEL", "VERCEL_ENV", { ci: false }], ["APPCENTER", "APPCENTER_BUILD_ID"], ["CODESANDBOX", "CODESANDBOX_SSE", { ci: false }], ["CODESANDBOX", "CODESANDBOX_HOST", { ci: false }], ["STACKBLITZ"], ["STORMKIT"], ["CLEAVR"], ["ZEABUR"], ["CODESPHERE", "CODESPHERE_APP_ID", { ci: true }], ["RAILWAY", "RAILWAY_PROJECT_ID"], ["RAILWAY", "RAILWAY_SERVICE_ID"], ["DENO-DEPLOY", "DENO_DEPLOYMENT_ID"], ["FIREBASE_APP_HOSTING", "FIREBASE_APP_HOSTING", { ci: true }]];
function b() {
  var _a7, _b5, _c, _d, _e, _f;
  if ((_a7 = globalThis.process) == null ? void 0 : _a7.env) for (const e of f) {
    const s = e[1] || e[0];
    if ((_b5 = globalThis.process) == null ? void 0 : _b5.env[s]) return { name: e[0].toLowerCase(), ...e[2] };
  }
  return ((_d = (_c = globalThis.process) == null ? void 0 : _c.env) == null ? void 0 : _d.SHELL) === "/bin/jsh" && ((_f = (_e = globalThis.process) == null ? void 0 : _e.versions) == null ? void 0 : _f.webcontainer) ? { name: "stackblitz", ci: false } : { name: "", ci: false };
}
var l = b();
var p = l.name;
function n(e) {
  return e ? e !== "false" : false;
}
var _a;
var I = ((_a = globalThis.process) == null ? void 0 : _a.platform) || "";
var T = n(o.CI) || l.ci !== false;
var _a2, _b;
var R = n(((_a2 = globalThis.process) == null ? void 0 : _a2.stdout) && ((_b = globalThis.process) == null ? void 0 : _b.stdout.isTTY));
var d = n(o.DEBUG);
var a = t === "test" || n(o.TEST);
var v = n(o.MINIMAL) || T || a || !R;
var A = /^win/i.test(I);
var M = /^linux/i.test(I);
var m = /^darwin/i.test(I);
var Y = !n(o.NO_COLOR) && (n(o.FORCE_COLOR) || (R || A) && o.TERM !== "dumb" || T);
var _a3, _b2;
var C = (((_b2 = (_a3 = globalThis.process) == null ? void 0 : _a3.versions) == null ? void 0 : _b2.node) || "").replace(/^v/, "") || null;
var V = Number(C == null ? void 0 : C.split(".")[0]) || null;
var W = globalThis.process || /* @__PURE__ */ Object.create(null);
var _ = { versions: {} };
var y = new Proxy(W, { get(e, s) {
  if (s === "env") return o;
  if (s in e) return e[s];
  if (s in _) return _[s];
} });
var _a4, _b3;
var O = ((_b3 = (_a4 = globalThis.process) == null ? void 0 : _a4.release) == null ? void 0 : _b3.name) === "node";
var _a5, _b4;
var c = !!globalThis.Bun || !!((_b4 = (_a5 = globalThis.process) == null ? void 0 : _a5.versions) == null ? void 0 : _b4.bun);
var D = !!globalThis.Deno;
var L = !!globalThis.fastly;
var S = !!globalThis.Netlify;
var u = !!globalThis.EdgeRuntime;
var _a6;
var N = ((_a6 = globalThis.navigator) == null ? void 0 : _a6.userAgent) === "Cloudflare-Workers";
var F = [[S, "netlify"], [u, "edge-light"], [N, "workerd"], [L, "fastly"], [D, "deno"], [c, "bun"], [O, "node"]];
function G() {
  const e = F.find((s) => s[0]);
  if (e) return { name: e[1] };
}
var P = G();
var K = (P == null ? void 0 : P.name) || "";

export {
  T
};
//# sourceMappingURL=chunk-JDBHYJ36.js.map
