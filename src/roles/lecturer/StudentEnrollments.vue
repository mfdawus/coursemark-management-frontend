<template>
  <div class="container-fluid py-4">
    <!-- Page Title -->
    <div class="mb-3">
      <h4 class="text-white">Students Enrolled in Courses</h4>
    </div>

    <!-- Table Card -->
    <div class="card">
      <div class="card-header pb-0">
        <h5 class="mb-3">Enrollment List</h5>
      </div>
      <div class="card-body px-0 pt-0 pb-2">
        <div class="table-responsive p-0">
          <table class="table align-items-center mb-0">
            <thead class="bg-light">
              <tr>
                <th class="text-uppercase text-xs font-weight-bolder">Student</th>
                <th class="text-uppercase text-xs font-weight-bolder">Matric Number</th>
                <th class="text-uppercase text-xs font-weight-bolder">Course</th>
                <th class="text-uppercase text-xs font-weight-bolder text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="enroll in enrollments" :key="enroll.enrollment_id">
                <td class="px-3 py-2">{{ enroll.student_name }}</td>
                <td class="px-3 py-2">{{ enroll.matric_number }}</td>
                <td class="px-3 py-2">
                  {{ enroll.course_code }} - {{ enroll.course_name }}
                </td>
                <td class="px-3 py-2 text-center">
                  <button
                    class="btn btn-sm btn-primary"
                    @click="goToMarks(enroll)"
                  >
                    <i class="ni ni-send text-white me-1"></i>
                    Enter Marks
                  </button>
                </td>
              </tr>
              <tr v-if="enrollments.length === 0">
                <td colspan="4" class="text-center text-muted py-3">
                  No enrollments found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="StudentEnrollments">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const enrollments = ref([]);
const router = useRouter();

onMounted(async () => {
  try {
    const res = await fetch(`${process.env.VUE_APP_API_URL}/api/lecturer/enrolled-students`, {
          credentials: "include",
        })
    if (!res.ok) throw new Error("Failed to fetch enrollments");
    enrollments.value = await res.json();
  } catch (err) {
    console.error(err);
    enrollments.value = [];
  }
});

function goToMarks(enroll) {
  router.push({
    name: "marks-entry",
    params: {
      course_id: enroll.course_id,
      student_id: enroll.student_id,
    },
  });
}
</script>

<style scoped>
/* Optional styling */
</style>
