// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { log } = await import("./lib/logger");
    log("Application started", "info");
  }
}
