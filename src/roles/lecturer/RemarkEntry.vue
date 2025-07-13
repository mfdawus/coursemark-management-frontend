<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-xl-6 col-lg-7">

        <!-- Page Title -->
        <div class="mb-4">
          <h5 class="text-white">Remark Entry</h5>
        </div>

        <!-- Existing Remark Summary -->
        <div
          v-if="hasExistingRemark"
          class="alert alert-success border shadow-sm"
        >
          <h6 class="text-success mb-2">Existing Remark Summary</h6>
          <p class="mb-1"><strong>Assessment ID:</strong> {{ remark.assessment_id }}</p>
          <p class="mb-1"><strong>Message:</strong> {{ remark.message }}</p>
          <p class="mb-0"><strong>Status:</strong> {{ remark.status }}</p>
        </div>

        <!-- Form Card -->
        <div class="card shadow-sm">
          <div class="card-body">

            <!-- Assessment Select -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Assessment</label>
              <select
                v-model="remark.assessment_id"
                class="form-select"
              >
                <option value="" disabled>Select assessment</option>
                <option
                  v-for="a in assessments"
                  :key="a.id"
                  :value="a.id"
                >
                  {{ a.title }} ({{ a.type }})
                </option>
              </select>
            </div>

            <!-- Message Textarea -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Message</label>
              <textarea
                v-model="remark.message"
                class="form-control"
                rows="4"
                placeholder="Enter remark message"
              ></textarea>
            </div>

            <!-- Status Select -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Status</label>
              <select
                v-model="remark.status"
                class="form-select"
              >
                <option disabled value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <!-- Submit Button -->
            <div class="text-end">
              <button
                class="btn btn-primary"
                :disabled="loading"
                @click="saveRemark"
              >
                {{ loading ? "Saving..." : "Save Remark" }}
              </button>
            </div>

            <!-- Success Message -->
            <div
              v-if="message"
              class="mt-3 alert alert-success text-center"
            >
              {{ message }}
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const courseId = route.params.course_id;
const studentId = route.params.student_id;

const remark = ref({
  assessment_id: "",
  message: "",
  status: "",
});
const assessments = ref([]);
const loading = ref(false);
const message = ref("");

const hasExistingRemark = computed(
  () =>
    remark.value.assessment_id || remark.value.message || remark.value.status,
);

onMounted(async () => {
  await loadAssessments();
  await loadExistingRemark();
});

async function loadAssessments() {
  try {
    const res = await fetch(`/api/lecturer/assessments/${courseId}`);
    if (res.ok) {
      assessments.value = await res.json();
    }
  } catch (err) {
    console.error("Failed to load assessments", err);
  }
}

async function loadExistingRemark() {
  try {
    const res = await fetch(
      `/api/lecturer/remark-requests/${courseId}/${studentId}`,
    );
    if (res.ok) {
      const data = await res.json();
      if (data && Object.keys(data).length) {
        remark.value = data;
      }
    }
  } catch (err) {
    console.error("Failed to load remark", err);
  }
}

async function saveRemark() {
  message.value = "";
  loading.value = true;
  try {
    const res = await fetch(
      `/api/lecturer/remark-requests/${courseId}/${studentId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(remark.value),
      },
    );
    const data = await res.json();
    if (data.success) {
      message.value = "Remark saved successfully!";
    } else {
      message.value = "Failed to save remark.";
    }
  } catch (err) {
    console.error("Error saving remark:", err);
    message.value = "Error occurred while saving.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
select,
input,
textarea {
  transition: border-color 0.2s;
}
select:focus,
input:focus,
textarea:focus {
  border-color: #2563eb;
  outline: none;
}
</style>
