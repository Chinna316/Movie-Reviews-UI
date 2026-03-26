import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const devProxyTarget = env.VITE_DEV_PROXY_TARGET || "http://localhost:5001";
  const allowedDevOrigin = "http://localhost:5173";

  return {
    plugins: [react()],
    server: {
      host: "localhost",
      port: 5173,
      proxy: {
        // During local dev, proxy /api calls to the local backend server.
        // We also normalize Origin/Referer so backend CORS checks do not vary
        // based on whether the browser was opened with localhost or 127.0.0.1.
        "/api": {
          target: devProxyTarget,
          changeOrigin: true,
          headers: {
            Origin: allowedDevOrigin,
            Referer: `${allowedDevOrigin}/`,
          },
          configure(proxy) {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("Origin", allowedDevOrigin);
              proxyReq.setHeader("Referer", `${allowedDevOrigin}/`);
            });
          },
        },
      },
    },
    preview: {
      host: "localhost",
      port: 4173,
    },
  };
});
