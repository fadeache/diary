import ElementPlus from "element-plus";
// import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import * as ElIcons from "@element-plus/icons-vue";
import "../theme/index.css";

export default (app) => {
  // app.use(ElementPlus, {
  //   locale: zhCn,
  // });
  app.use(ElementPlus);
  for (const name in ElIcons) {
    app.component(name, ElIcons[name]);
  }
};
