<script setup>
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

// Handle login
import { Modal } from "bootstrap"; 


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


let pinModalInstance = null;

async function submit() {
  error.value = "";

  if (!matricNumber.value || !password.value) {
    error.value = "Please enter matric number and password.";
    return;
  }

  // Show the PIN modal
  const modalElement = document.getElementById("pinModal");
  pinModalInstance = new Modal(modalElement);
  pinModalInstance.show();
}


async function confirmLogin() {
  error.value = "";

  if (!pin.value) {
    error.value = "Please enter your PIN.";
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

      pinModalInstance.hide(); // Hide modal on success
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
                  <h2
                    class="text-center fw-bold mb-5 py-3 px-4 border border-radius-lg shadow-sm bg-lighter text-success"
                    style="font-size: 2.2rem; letter-spacing: 1px;"
                  >
                    E-KLAS <br />
                    <span class="fs-5 text-dark">Course Management</span>
                  </h2>

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
                  :style="{
                    backgroundImage: `url(${require('@/assets/img/eklas-pic.jpg')})`,
                    backgroundSize: 'cover'
                  }"
                >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4 class="mt-5 text-dark font-weight-bolder position-relative">
                  "Attention is the new currency"
                </h4>
                <p class="text-dark bg-l position-relative">
                  The more effortless the writing looks, the more effort the writer actually put into it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- Bootstrap PIN Modal -->
      <div
        class="modal fade"
        id="pinModal"
        tabindex="-1"
        aria-labelledby="pinModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="pinModalLabel">Enter Your PIN</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <argon-input
                id="pin"
                v-model="pin"
                type="text"
                placeholder="PIN"
                size="lg"
              />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-success"
                @click="confirmLogin"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>

    </section>
  </main>
</template>



