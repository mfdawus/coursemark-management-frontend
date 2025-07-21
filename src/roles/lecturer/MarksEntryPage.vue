<template>
  <div class="container-fluid py-4">
    <!-- Title -->
    <div class="mb-3">
      <h4 class="text-white"> Marks Entry</h4>
    </div>

    <!-- Loading / Error -->
    <div v-if="loading" class="alert alert-info">Loading data...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Student & Course Info -->
    <div v-else>
      <div class="card mb-3 shadow-sm">
        <div class="card-body">
          <p class="mb-1">
            <strong>Student:</strong>
            {{ data.student.name }} ({{ data.student.matric_number }})
          </p>
          <p class="mb-0">
            <strong>Course:</strong>
            {{ data.course.code }} - {{ data.course.name }}
          </p>
        </div>
      </div>

      <!-- Marks Table -->
      <div class="card">
        <div class="card-header pb-0">
          <h6 class="mb-3">Assessment Marks</h6>
        </div>
        <div class="card-body px-0 pt-0 pb-2">
          <div class="table-responsive p-0">
            <table class="table align-items-center mb-0">
              <thead class="bg-light">
                <tr>
                  <th class="text-uppercase text-xs font-weight-bolder">Assessment</th>
                  <th class="text-uppercase text-xs font-weight-bolder">Type</th>
                  <th class="text-uppercase text-xs font-weight-bolder">Max Mark</th>
                  <th class="text-uppercase text-xs font-weight-bolder">Obtained</th>
                  <th class="text-uppercase text-xs font-weight-bolder text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mark in data.marks" :key="mark.assessment_id">
                  <td class="px-3 py-2">{{ mark.title }}</td>
                  <td class="px-3 py-2">{{ mark.type }}</td>
                  <td class="px-3 py-2">{{ mark.max_mark }}</td>
                  <td class="px-3 py-2">
                    <input
                      v-model.number="mark.mark_obtained"
                      type="number"
                      :max="mark.max_mark"
                      class="form-control form-control-sm w-50"
                    />
                  </td>
                  <td class="px-3 py-2 text-center">
                    <button
                      class="btn btn-sm btn-success"
                      @click="saveMark(mark)"
                    >
                      Save
                    </button>
                  </td>
                </tr>
                <tr v-if="data.marks.length === 0">
                  <td colspan="5" class="text-center text-muted py-3">
                    No assessments assigned yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const courseId = route.params.course_id;
const studentId = route.params.student_id;

const data = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const res = await fetch(
      `${process.env.VUE_APP_API_URL}/api/lecturer/marks?course_id=${courseId}&student_id=${studentId}`, {
          credentials: "include",
        })
    if (!res.ok) throw new Error("Failed to load data");
    data.value = await res.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

async function saveMark(mark) {
  try {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/api/lecturer/marks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assessment_id: mark.assessment_id,
        student_id: studentId,
        mark_obtained: mark.mark_obtained,
      }),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to save mark");
    alert("Mark saved!");
  } catch (err) {
    alert(err.message);
  }
}
</script>

<style scoped>
.input {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 4px 8px;
}
</style>
