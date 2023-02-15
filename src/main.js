import { createApp } from "vue";
import App from "./App.vue";
import moment from "moment";
import VueFeather from "vue-feather";
import "@/assets/global.css";

moment.locale("pt");
const app = createApp(App);
app.component(VueFeather.name, VueFeather);

app.mount("#app");
