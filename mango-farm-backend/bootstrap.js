process.on("uncaughtException", (err) => {
  console.error("[FATAL] uncaughtException at startup:", err && err.stack ? err.stack : err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] unhandledRejection at startup:", reason);
});

console.log(
  "[bootstrap] starting backend, node:",
  process.version,
  "PORT:",
  process.env.PORT || "(unset)",
  "cwd:",
  process.cwd()
);

try {
  require("./dist/server.js");
} catch (err) {
  console.error("[FATAL] server module load failed:", err && err.stack ? err.stack : err);
  process.exit(1);
}
