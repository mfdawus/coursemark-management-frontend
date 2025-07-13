<template>
  <div class="container-fluid py-4">
    <!-- Page Title -->
    <div class="mb-4">
      <h4 class="text-white">Assign Students to Assessments</h4>
    </div>

    <!-- Course Selector -->
    <div class="card mb-4">
      <div class="card-body d-flex flex-wrap align-items-center gap-3">
        <label class="fw-semibold mb-0">Select Course:</label>
        <select
          v-model="selectedCourse"
          class="form-select w-auto"
          @change="fetchAssignments"
        >
          <option value="">-- Select Course --</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.course_code }} - {{ course.course_name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Assignment Table -->
    <div v-if="students.length > 0" class="card">
      <div class="card-header">
        <h6 class="mb-0">Student Assessment Assignment</h6>
      </div>
      <div class="table-responsive">
        <table class="table align-items-center mb-0">
          <thead class="bg-light">
            <tr>
              <th>Student</th>
              <th>Matric</th>
              <template v-if="assessments.length > 0">
                <th
                  v-for="assessment in assessments"
                  :key="assessment.id"
                  class="text-center"
                >
                  {{ assessment.title }}<br />
                  <small class="text-muted">({{ assessment.type }})</small>
                </th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.student_id">
              <td>{{ student.name }}</td>
              <td>{{ student.matric_number }}</td>
              <template v-if="assessments.length > 0">
                <td
                  v-for="ass in student.assessments"
                  :key="ass.assessment_id"
                  class="text-center"
                >
                  <input
                    type="checkbox"
                    class="form-check-input"
                    :checked="ass.assigned"
                    @change="toggleAssignment(student.student_id, ass)"
                  />
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No Assessments Notice -->
      <div
        v-if="assessments.length === 0"
        class="alert alert-warning m-4 d-flex align-items-center"
      >
        ⚠ This course currently has no assessments.
        <router-link
          to="/lecturer/assessments"
          class="ms-2 text-decoration-underline text-primary"
        >
          Create Assessments
        </router-link>
      </div>
    </div>

    <!-- No Students Message -->
    <div v-else-if="selectedCourse" class="alert alert-secondary">
      No students enrolled in this course yet.
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";

const selectedCourse = ref("");
const courses = ref([]);
const students = ref([]);
const assessments = ref([]);

async function fetchCourses() {
  try {
    const res = await fetch("/api/lecturer/courses");
    if (!res.ok) throw new Error("Failed to fetch courses");
    courses.value = await res.json();
  } catch (err) {
    console.error(err);
    courses.value = [];
  }
}

async function fetchAssignments() {
  if (!selectedCourse.value) return;
  try {
    const res = await fetch(
      `/api/lecturer/course-assignment/${selectedCourse.value}`,
    );
    if (!res.ok) throw new Error("Failed to fetch assignments");
    const data = await res.json();
    students.value = data;

    if (data.length > 0 && data[0].assessments) {
      assessments.value = data[0].assessments.map((a) => ({
        id: a.assessment_id,
        title: a.title,
        type: a.type,
      }));
    } else {
      assessments.value = [];
    }
  } catch (err) {
    console.error(err);
    students.value = [];
    assessments.value = [];
  }
}

async function toggleAssignment(studentId, ass) {
  try {
    if (ass.assigned) {
      await fetch(
        `/api/lecturer/assign-mark/${ass.assessment_id}/${studentId}`,
        {
          method: "DELETE",
        },
      );
      ass.assigned = false;
    } else {
      await fetch("/api/lecturer/assign-mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessment_id: ass.assessment_id,
          student_id: studentId,
        }),
      });
      ass.assigned = true;
    }
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  fetchCourses();
});
</script>

<style scoped>
input[type="checkbox"] {
  width: 20px;
  height: 20px;
  appearance: checkbox; /* 🔥 force native checkbox look */
  -webkit-appearance: checkbox; /* For Safari */
  -moz-appearance: checkbox;    /* For Firefox */
}
</style>