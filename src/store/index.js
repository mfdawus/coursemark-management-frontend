// src/store/index.js
import { createStore } from "vuex";

export default createStore({
  state: {
    hideConfigButton: false,
    isPinned: false,
    showConfig: false,
    sidebarType: "bg-white",
    isRTL: false,
    mcolor: "",
    darkMode: false,
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    layout: "default",
  },
  mutations: {
    toggleConfigurator(state) {
      state.showConfig = !state.showConfig;
    },
    sidebarMinimize(state) {
      const appElement = document.querySelector("#app");
      if (state.isPinned) {
        appElement.classList.add("g-sidenav-hidden");
        appElement.classList.remove("g-sidenav-pinned");
        state.isPinned = false;
      } else {
        appElement.classList.add("g-sidenav-pinned");
        appElement.classList.remove("g-sidenav-hidden");
        state.isPinned = true;
      }
    },
    sidebarType(state, payload) {
      state.sidebarType = payload;
    },
    navbarFixed(state) {
      state.isNavFixed = !state.isNavFixed;
    },
  },
  actions: {
    toggleSidebarColor({ commit }, payload) {
      commit("sidebarType", payload);
    },
  },
  getters: {},
});
