import { createApp } from "vue";
import App from "./App.vue";
import moment from "moment";
import VueFeather from "vue-feather";
import { ClickOutside } from "./clickOutside";
import "@/assets/global.css";

moment.locale("pt");
const app = createApp(App);
app.component(VueFeather.name, VueFeather);
app.directive("click-outside", ClickOutside);
app.mount("#app");
