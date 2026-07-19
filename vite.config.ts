// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

export default defineConfig({
  // Mount the app's MCP server at /mcp. The plugin reads src/lib/mcp/index.ts
  // and generates the HTTP endpoint, OAuth metadata route, and companion routes.
  vite: {
    plugins: [mcpPlugin()],
  },
  // Enable the Nitro deploy plugin for non-sandbox (e.g. Netlify) builds.
  // Inside the Lovable sandbox this is overridden to the Cloudflare preset
  // automatically, so the live preview keeps working. On Netlify (where the
  // NETLIFY env var is present) Nitro builds SSR Functions + static client
  // and emits the proper deploy output into `dist/`.
  nitro: { preset: "netlify" },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
