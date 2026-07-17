import {
  mergeConfig,
  require_assert,
  require_buffer,
  require_child_process,
  require_crypto,
  require_http,
  require_https,
  require_main,
  require_module,
  require_net,
  require_node_assert,
  require_node_buffer,
  require_node_crypto,
  require_node_dns,
  require_node_events,
  require_node_net,
  require_node_readline,
  require_node_stream,
  require_node_string_decoder,
  require_node_util,
  require_node_v8,
  require_node_worker_threads,
  require_node_zlib,
  require_querystring,
  require_tls,
  require_tty,
  require_zlib
} from "./chunk-ANKGNADH.js";
import {
  require_node_module,
  require_node_url
} from "./chunk-J74MCUS5.js";
import {
  require_url
} from "./chunk-NLSDCWQO.js";
import {
  require_events,
  require_node_os,
  require_os,
  require_stream
} from "./chunk-ZAYYSBU2.js";
import {
  require_fs
} from "./chunk-QZAH7VNE.js";
import {
  require_node_child_process,
  require_node_fs,
  require_node_perf_hooks,
  require_promises
} from "./chunk-HNW5CWZO.js";
import {
  require_node_path
} from "./chunk-OYZR2EBP.js";
import {
  require_path
} from "./chunk-LXBZCEIU.js";
import {
  T
} from "./chunk-JDBHYJ36.js";
import {
  require_util
} from "./chunk-YV3EURKN.js";
import {
  require_node_http
} from "./chunk-MM644HQJ.js";
import {
  require_node_https
} from "./chunk-NZWVDDZC.js";
import {
  __toESM
} from "./chunk-SNAQBZPT.js";

// node_modules/vitest/dist/config.js
var import_node_os2 = __toESM(require_node_os());

// node_modules/vite/dist/node/index.js
var import_esbuild = __toESM(require_main());
var import_node_fs = __toESM(require_node_fs());

// node_modules/vite/dist/node/runtime.js
var SOURCEMAPPING_URL = "sourceMa";
SOURCEMAPPING_URL += "ppingURL";
var isWindows = typeof process < "u" && process.platform === "win32";
var AsyncFunction = (async function() {
}).constructor;
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var intToChar = new Uint8Array(64);
var charToInt = new Uint8Array(128);
for (let i = 0; i < chars.length; i++) {
  const c = chars.charCodeAt(i);
  intToChar[i] = c, charToInt[c] = i;
}
var VITE_RUNTIME_SOURCEMAPPING_REGEXP = new RegExp(
  `//# ${SOURCEMAPPING_URL}=data:application/json;base64,(.+)`
);
var retrieveFileHandlers = /* @__PURE__ */ new Set();
var retrieveSourceMapHandlers = /* @__PURE__ */ new Set();
var createExecHandlers = (handlers) => (...args) => {
  for (const handler of handlers) {
    const result = handler(...args);
    if (result) return result;
  }
  return null;
};
var retrieveFileFromHandlers = createExecHandlers(retrieveFileHandlers);
var retrieveSourceMapFromHandlers = createExecHandlers(
  retrieveSourceMapHandlers
);
var originalPrepare = Error.prepareStackTrace;

// node_modules/vite/dist/node/index.js
var import_promises = __toESM(require_promises());
var import_node_path = __toESM(require_node_path());
var import_node_url = __toESM(require_node_url());
var import_node_util = __toESM(require_node_util());
var import_node_perf_hooks = __toESM(require_node_perf_hooks());
var import_node_module = __toESM(require_node_module());
var import_node_crypto = __toESM(require_node_crypto());
var import_tty = __toESM(require_tty());
var import_path = __toESM(require_path());
var import_fs = __toESM(require_fs());
var import_node_events = __toESM(require_node_events());
var import_node_stream = __toESM(require_node_stream());
var import_node_string_decoder = __toESM(require_node_string_decoder());
var import_node_child_process = __toESM(require_node_child_process());
var import_node_http = __toESM(require_node_http());
var import_node_https = __toESM(require_node_https());
var import_util = __toESM(require_util());
var import_net = __toESM(require_net());
var import_events = __toESM(require_events());
var import_url = __toESM(require_url());
var import_http = __toESM(require_http());
var import_stream = __toESM(require_stream());
var import_os = __toESM(require_os());
var import_child_process = __toESM(require_child_process());
var import_node_os = __toESM(require_node_os());
var import_node_dns = __toESM(require_node_dns());
var import_crypto = __toESM(require_crypto());
var import_module = __toESM(require_module());
var import_node_assert = __toESM(require_node_assert());
var import_node_v8 = __toESM(require_node_v8());
var import_node_worker_threads = __toESM(require_node_worker_threads());
var import_node_buffer = __toESM(require_node_buffer());
var import_querystring = __toESM(require_querystring());
var import_node_readline = __toESM(require_node_readline());
var import_zlib = __toESM(require_zlib());
var import_buffer = __toESM(require_buffer());
var import_https = __toESM(require_https());
var import_tls = __toESM(require_tls());
var import_node_net = __toESM(require_node_net());
var import_assert = __toESM(require_assert());
var import_node_zlib = __toESM(require_node_zlib());

// node_modules/vitest/dist/config.js
var _a$1;
var isNode = typeof process < "u" && typeof process.stdout < "u" && !((_a$1 = process.versions) == null ? void 0 : _a$1.deno) && !globalThis.window;
isNode && process.platform === "win32";
var _a;
var _b;
var defaultInclude = ["**/*.{test,spec}.?(c|m)[jt]s?(x)"];
var defaultExclude = ["**/node_modules/**", "**/dist/**", "**/cypress/**", "**/.{idea,git,cache,output,temp}/**", "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*"];
var defaultCoverageExcludes = [
  "coverage/**",
  "dist/**",
  "**/[.]**",
  "packages/*/test?(s)/**",
  "**/*.d.ts",
  "**/virtual:*",
  "**/__x00__*",
  "**/\0*",
  "cypress/**",
  "test?(s)/**",
  "test?(-*).?(c|m)[jt]s?(x)",
  "**/*{.,-}{test,spec}?(-d).?(c|m)[jt]s?(x)",
  "**/__tests__/**",
  "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
  "**/vitest.{workspace,projects}.[jt]s?(on)",
  "**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}"
];
var coverageConfigDefaults = {
  provider: "v8",
  enabled: false,
  all: true,
  clean: true,
  cleanOnRerun: true,
  reportsDirectory: "./coverage",
  exclude: defaultCoverageExcludes,
  reportOnFailure: false,
  reporter: [["text", {}], ["html", {}], ["clover", {}], ["json", {}]],
  extension: [".js", ".cjs", ".mjs", ".ts", ".mts", ".cts", ".tsx", ".jsx", ".vue", ".svelte", ".marko"],
  allowExternal: false,
  ignoreEmptyLines: false,
  processingConcurrency: Math.min(20, ((_b = (_a = import_node_os2.default).availableParallelism) == null ? void 0 : _b.call(_a)) ?? import_node_os2.default.cpus().length)
};
var fakeTimersDefaults = {
  loopLimit: 1e4,
  shouldClearNativeTimers: true,
  toFake: [
    "setTimeout",
    "clearTimeout",
    "setInterval",
    "clearInterval",
    "setImmediate",
    "clearImmediate",
    "Date"
  ]
};
var config = {
  allowOnly: !T,
  isolate: true,
  watch: !T,
  globals: false,
  environment: "node",
  pool: "threads",
  clearMocks: false,
  restoreMocks: false,
  mockReset: false,
  include: defaultInclude,
  exclude: defaultExclude,
  testTimeout: 5e3,
  hookTimeout: 1e4,
  teardownTimeout: 1e4,
  watchExclude: ["**/node_modules/**", "**/dist/**"],
  forceRerunTriggers: [
    "**/package.json/**",
    "**/{vitest,vite}.config.*/**"
  ],
  update: false,
  reporters: [],
  silent: false,
  hideSkippedTests: false,
  api: false,
  ui: false,
  uiBase: "/__vitest__/",
  open: !T,
  css: {
    include: []
  },
  coverage: coverageConfigDefaults,
  fakeTimers: fakeTimersDefaults,
  maxConcurrency: 5,
  dangerouslyIgnoreUnhandledErrors: false,
  typecheck: {
    checker: "tsc",
    include: ["**/*.{test,spec}-d.?(c|m)[jt]s?(x)"],
    exclude: defaultExclude
  },
  slowTestThreshold: 300,
  disableConsoleIntercept: false
};
var configDefaults = Object.freeze(config);
var extraInlineDeps = [
  /^(?!.*(?:node_modules)).*\.mjs$/,
  /^(?!.*(?:node_modules)).*\.cjs\.js$/,
  // Vite client
  /vite\w*\/dist\/client\/env.mjs/,
  // Nuxt
  "@nuxt/test-utils"
];
function defineConfig2(config2) {
  return config2;
}
function defineProject(config2) {
  return config2;
}
function defineWorkspace(config2) {
  return config2;
}
export {
  configDefaults,
  coverageConfigDefaults,
  defaultExclude,
  defaultInclude,
  defineConfig2 as defineConfig,
  defineProject,
  defineWorkspace,
  extraInlineDeps,
  mergeConfig
};
//# sourceMappingURL=vitest_config.js.map
