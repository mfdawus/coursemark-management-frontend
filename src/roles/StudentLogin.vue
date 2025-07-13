<script setup>
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

// UI components
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";

const router = useRouter();
const store = useStore();
const body = document.getElementsByTagName("body")[0];

// Hide layout elements
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

// Form data
const matricNumber = ref("");
const password = ref("");
const pin = ref("");
const error = ref("");

// Handle login
async function submit() {
  error.value = "";

  if (!matricNumber.value || !password.value || !pin.value) {
    error.value = "Please enter matric number, password, and PIN.";
    return;
  }

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matric_number: matricNumber.value,
        password: password.value,
        pin: pin.value,
      }),
      credentials: "include",
    });

    const result = await response.json();

    if (response.ok && result.success) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          matric: result.matric,
          name: result.name,
          role: result.role,
        })
      );
      router.push("/student");
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

  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <!-- Left Form Section -->
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Student Login</h4>
                  <p class="mb-0">Enter your details to sign in</p>
                </div>
                <div class="card-body">
                  <form @submit.prevent="submit">
                    <div class="mb-3">
                      <argon-input
                        id="matric"
                        v-model="matricNumber"
                        type="text"
                        placeholder="Matric Number"
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
                    <div class="mb-3">
                      <argon-input
                        id="pin"
                        v-model="pin"
                        type="text"
                        placeholder="PIN"
                        size="lg"
                      />
                    </div>

                    <div v-if="error" class="text-danger text-sm mb-2">
                      {{ error }}
                    </div>

                    <div class="text-center">
                      <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                        type="submit"
                      >
                        Sign in
                      </argon-button>
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Staff?&nbsp;
                    <router-link
                      to="/login/staff"
                      class="text-success text-gradient font-weight-bold"
                    >
                      Click here
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
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg');
                  background-size: cover;
                "
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4 class="mt-5 text-white font-weight-bolder position-relative">
                  "Attention is the new currency"
                </h4>
                <p class="text-white position-relative">
                  The more effortless the writing looks, the more effort the writer actually put into it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
