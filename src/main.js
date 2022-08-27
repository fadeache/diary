import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElIcons from "@element-plus/icons-vue";
import store from "./store";

const app = createApp(App);
app.use(ElementPlus);
for (const name in ElIcons) {
  app.component(name, ElIcons[name]);
}
app.use(store);

app.mount("#app");
