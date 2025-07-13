// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";

// Argon Assets
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ArgonDashboard from "./argon-dashboard";

// Create app instance
const app = createApp(App);

// Use plugins
app.use(store);
app.use(router);
app.use(ArgonDashboard);

// Mount app
app.mount("#app");
