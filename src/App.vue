<!-- src/App.vue -->
<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

// Argon layout components
import Sidenav from "./examples/Sidenav";

const store = useStore();

// Vuex state bindings
const isNavFixed = computed(() => store.state.isNavFixed);
const darkMode = computed(() => store.state.darkMode);
const isAbsolute = computed(() => store.state.isAbsolute);
const showSidenav = computed(() => store.state.showSidenav);
const layout = computed(() => store.state.layout);
const showNavbar = computed(() => store.state.showNavbar);
const showFooter = computed(() => store.state.showFooter);
const showConfig = computed(() => store.state.showConfig);
const hideConfigButton = computed(() => store.state.hideConfigButton);

// Vuex mutations
const toggleConfigurator = () => store.commit("toggleConfigurator");

// Navbar class logic
const navClasses = computed(() => {
  return {
    "position-sticky bg-white left-auto top-2 z-index-sticky":
      isNavFixed.value && !darkMode.value,
    "position-sticky bg-default left-auto top-2 z-index-sticky":
      isNavFixed.value && darkMode.value,
    "position-absolute px-4 mx-0 w-100 z-index-2": isAbsolute.value,
    "px-0 mx-4": !isAbsolute.value,
  };
});
</script>

<template>
  <!-- Optional: Landing Background for login pages -->
  <div
    v-show="layout === 'landing'"
    class="landing-bg h-100 bg-gradient-primary position-fixed w-100"
  ></div>

  <!-- Sidenav Component -->
  <sidenav v-if="showSidenav" />

  <!-- Main Content -->
  <main
    class="main-content position-relative max-height-vh-100 h-100 border-radius-lg"
  >
    <!-- Navbar -->
    <navbar v-if="showNavbar" :class="[navClasses]" />

    <!-- Routed Content -->
    <router-view />

    <!-- Footer -->
    <app-footer v-show="showFooter" />

    <!-- Configurator Panel -->
    <configurator
      :toggle="toggleConfigurator"
      :class="[showConfig ? 'show' : '', hideConfigButton ? 'd-none' : '']"
    />
  </main>
</template>
