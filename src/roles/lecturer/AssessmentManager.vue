<template>
  <div class="container-fluid py-4">
    <!-- Title -->
    <div class="mb-4">
      <h4 class="text-white">Assessment Manager</h4>
    </div>

    <!-- Filter by Course -->
    <div class="card mb-4">
      <div class="card-body d-flex align-items-center flex-wrap gap-3">
        <label class="mb-0 fw-semibold">Filter by Course:</label>
        <select
          v-model="selectedCourse"
          class="form-select w-auto"
          @change="fetchAssessments"
        >
          <option value="">All Courses</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.course_code }} - {{ course.course_name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Assessment Table -->
    <div class="card mb-4">
      <div class="card-header">
        <h6 class="mb-0">Assessments</h6>
      </div>
      <div class="table-responsive">
        <table class="table align-items-center mb-0">
          <thead class="bg-light">
            <tr>
              <th>Course</th>
              <th>Title</th>
              <th>Type</th>
              <th>Max Mark</th>
              <th>Weight (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="assess in assessments" :key="assess.id">
              <td>{{ assess.course_name }}</td>
              <td>{{ assess.title }}</td>
              <td>{{ assess.type }}</td>
              <td>{{ assess.max_mark }}</td>
              <td>{{ assess.weight }}%</td>
              <td>
                <button
                  class="btn btn-outline-success btn-sm me-2"
                  @click="editAssessment(assess)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  @click="deleteAssessment(assess.id)"
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="assessments.length === 0">
              <td colspan="6" class="text-center text-muted">No assessments found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Form -->
    <div class="card">
      <div class="card-header">
        <h6 class="mb-0">
          {{ editingId ? "Edit" : "Add" }} Assessment
        </h6>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Course</label>
            <select v-model="form.course_id" class="form-select">
              <option v-for="course in courses" :key="course.id" :value="course.id">
                {{ course.course_code }} - {{ course.course_name }}
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Title</label>
            <input
              v-model="form.title"
              type="text"
              class="form-control"
              placeholder="Assessment title"
            />
          </div>
          <div class="col-md-4">
            <label class="form-label">Type</label>
            <select v-model="form.type" class="form-select">
              <option>quiz</option>
              <option>assignment</option>
              <option>lab</option>
              <option>test</option>
              <option>exercise</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Max Mark</label>
            <input
              v-model.number="form.max_mark"
              type="number"
              class="form-control"
              placeholder="100"
            />
          </div>
          <div class="col-md-4">
            <label class="form-label">Weight (%)</label>
            <input
              v-model.number="form.weight"
              type="number"
              class="form-control"
              placeholder="e.g. 10"
            />
          </div>
        </div>

        <div class="mt-4">
          <button class="btn btn-primary" @click="saveAssessment">
            Save
          </button>
          <button
            v-if="editingId"
            class="btn btn-outline-secondary ms-2"
            @click="cancelEdit"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const courses = ref([]);
const assessments = ref([]);
const selectedCourse = ref("");
const form = ref({
  course_id: "",
  title: "",
  type: "quiz",
  max_mark: 100,
  weight: 0,
});
const editingId = ref(null);

onMounted(async () => {
  await fetchCourses();
  await fetchAssessments();
});

async function fetchCourses() {
  const res = await fetch(`${process.env.VUE_APP_API_URL}/api/lecturer/courses`, {
          credentials: "include",
        })
  courses.value = await res.json();
}

async function fetchAssessments() {
  const url = selectedCourse.value
    ? `${process.env.VUE_APP_API_URL}/api/lecturer/assessments/${selectedCourse.value}`
    : `${process.env.VUE_APP_API_URL}/api/lecturer/assessments`;
  const res = await fetch(url, {
          credentials: "include",
        })
  assessments.value = await res.json();
}

async function saveAssessment() {
  // Calculate total weight for the selected course
  const totalWeight = assessments.value
    .filter(
      (a) => a.course_id === form.value.course_id && a.id !== editingId.value,
    )
    .reduce((sum, a) => sum + Number(a.weight), 0);

  // Check if adding this assessment exceeds 70%
  if (totalWeight + Number(form.value.weight) > 70) {
    alert(
      `Total weight for this course exceeds 70%. Currently: ${totalWeight}%, adding: ${form.value.weight}%`,
    );
    return;
  }

  try {
    const method = editingId.value ? "PUT" : "POST";
    const url = editingId.value
      ? `${process.env.VUE_APP_API_URL}/api/lecturer/assessments/${editingId.value}`
      : `${process.env.VUE_APP_API_URL}/api/lecturer/assessments`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form.value, created_by: 13 }),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed");
    await fetchAssessments();
    resetForm();
  } catch (err) {
    alert(err.message);
  }
}

function editAssessment(assess) {
  editingId.value = assess.id;
  form.value = { ...assess };
}

async function deleteAssessment(id) {
  if (!confirm("Are you sure?")) return;
  await fetch(`${process.env.VUE_APP_API_URL}/api/lecturer/assessments/${id}`, { method: "DELETE",credentials: "include" });
  await fetchAssessments();
}

function resetForm() {
  editingId.value = null;
  form.value = {
    course_id: "",
    title: "",
    type: "quiz",
    max_mark: 100,
    weight: 0,
  };
}
</script>

<style scoped>
/* Keep your preferred style or tailwind here */
</style>
