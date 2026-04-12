import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/main.css";
import "./assets/styles/variables.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { useUiStore } from "@/stores/ui";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const uiStore = useUiStore();
uiStore.initTheme();

app.mount("#root");
