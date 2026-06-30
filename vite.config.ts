import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "node:child_process";

function getVersion() {
  try {
    const sha = process.env.GITHUB_SHA?.slice(0, 7) ?? execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
    const dirty = execSync("git status --porcelain", { encoding: "utf8" }).trim() ? "-dirty" : "";

    return `${sha}${dirty}`;
  } catch {
    return "unknown";
  }
}

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/devtools/" : "/",
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(getVersion()),
  },
  plugins: [react()],
});
