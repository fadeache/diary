import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    // 根据当前工作目录中的 `mode` 加载 .env 文件
    // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
    // https://cn.vitejs.dev/config/#environment-variables
    // loadEnv(mode, process.cwd(), '')

    // Thomas
    // if (command === 'build' && mode === 'production')
    // base: loadEnv('production', process.cwd()).VITE_APP_PATH,

    // Ache
    // base: "diary",
    // base: loadEnv(mode, process.cwd()).VITE_APP_PATH,
    base: "/",
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
  };
});
