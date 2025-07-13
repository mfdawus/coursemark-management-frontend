<script setup>
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

// Components
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";

const router = useRouter();
const store = useStore();
const body = document.getElementsByTagName("body")[0];

// Hide layout elements on login screen
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});

// Login form state
const email = ref("");
const password = ref("");
const error = ref("");

// Handle login
async function submit() {
  error.value = "";

  if (!email.value || !password.value) {
    error.value = "Please enter both email and password.";
    return;
  }

  try {
    const response = await fetch("/api/login/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
      credentials: "include",
    });

    const result = await response.json();

    if (response.ok && result.success) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: result.name,
          role: result.role,
        })
      );
      router.push(`/${result.role}`);
    } else {
      error.value = result.message || "Login failed.";
    }
  } catch (err) {
    error.value = "Server error. Please try again later.";
  }
}
</script>

<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          isBlur="blur border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          :darkMode="true"
          isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div>

  <main class="main-content mt-0">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <!-- Left Form Section -->
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="card-header text-start pb-0">
                  <h4 class="font-weight-bolder">Staff Login</h4>
                  <p class="mb-0">Enter your staff credentials to sign in</p>
                </div>
                <div class="card-body">
                  <form @submit.prevent="submit">
                    <div v-if="error" class="text-danger text-sm mb-2">
                      {{ error }}
                    </div>

                    <div class="mb-3">
                      <argon-input
                        id="email"
                        v-model="email"
                        type="email"
                        placeholder="Email"
                        size="lg"
                      />
                    </div>

                    <div class="mb-3">
                      <argon-input
                        id="password"
                        v-model="password"
                        type="password"
                        placeholder="Password"
                        size="lg"
                      />
                    </div>

                    <div class="text-center">
                      <argon-button
                        type="submit"
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                      >
                        Login
                      </argon-button>
                    </div>
                  </form>
                </div>

                <div class="card-footer px-1 pt-0 text-center">
                  <p class="mx-auto mb-4 text-sm">
                    Student?
                    <router-link
                      to="/login"
                      class="text-success text-gradient font-weight-bold"
                    >
                      Login here
                    </router-link>
                  </p>
                </div>
              </div>
            </div>

            <!-- Right Image Section -->
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-success h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg');
                  background-size: cover;
                "
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4 class="mt-5 text-white font-weight-bolder position-relative">
                  "Empowering Educators"
                </h4>
                <p class="text-white position-relative">
                  Efficient access to your courses and students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
