import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import installElement from "./plugins/element";

const app = createApp(App);
app.use(store);
installElement(app);

app.mount("#app");
