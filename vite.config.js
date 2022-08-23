import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.join(__dirname, "./src"),
    },
  },
  plugins: [vue()],
  server: {
    port: 3000, // 打开的端口号
    open: true, // 运行时打开浏览器
    proxy: {
      "/ache": {
        target: "http://82.157.160.30:8080/",
        // target: "http://localhost:8080/",
        pathRewrite: {
          "^/ache": "",
        },
      },
    },
  },
});
