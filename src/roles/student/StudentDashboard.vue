<template>
  <div class="px-4 py-2">
    <!-- Welcome Header -->
    <h2 class="text-white mb-4">Welcome, {{ dashboard.studentName }}</h2>

    <!-- Summary Cards -->
    <div class="d-flex gap-3 overflow-auto pb-3">
      <div
        v-for="(item, i) in summaryCards"
        :key="i"
        class="card text-center shadow-sm border-0 rounded-2xl"
        style="min-width: 220px"
      >
        <div class="card-body py-2">
          <h6 class="text-muted text-uppercase text-sm mb-2">{{ item.label }}</h6>
          <h3 :class="item.colorClass">{{ item.value }}</h3>
        </div>
      </div>
    </div>

    <!-- Student Progress Table -->
    <div class="card shadow-sm">
      <div class="card-body table-responsive">
        <h5 class="mb-3">Progress Overview</h5>
        <table class="table align-items-center table-hover">
          <thead class="table-light">
            <tr>
              <th>Course</th>
              <th># Assessments</th>
              <th># Marks</th>
              <th>Total Marks</th>
              <th>Final Exam</th>
              <th>GPA</th>
              <th># Remarks</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in progressData"
              :key="`${row.student_id}-${row.course_id}`"
            >
              <td>{{ row.course_name }}</td>
              <td>{{ row.assessment_count }}</td>
              <td>{{ row.marks_count }}</td>
              <td>{{ row.total_marks }}</td>
              <td>{{ row.final_mark ?? '-' }}</td>
              <td>
                <span v-if="row.gpa !== null && row.gpa !== undefined">
                  {{ Number(row.gpa).toFixed(2) }}
                </span>
                <span v-else class="text-muted">-</span>
              </td>
              <td>{{ row.remark_count }}</td>
              <td style="min-width: 120px;">
                <div class="progress" style="height: 8px;">
                  <div
                    class="progress-bar bg-info"
                    role="progressbar"
                    :style="{ width: Math.min(row.total_weight_completed, 100) + '%' }"
                  ></div>
                </div>
                <small class="text-muted">{{ row.total_weight_completed }}%</small>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="!progressData.length" class="text-center text-muted py-4">
          No student progress data available.
        </div>
      </div>
    </div>

    
    <!-- Enrolled Courses + Top Courses (side by side) -->
    <div class="row mt-4">
      <!-- Enrolled Courses -->
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title mb-3">Enrolled Courses</h5>
            <div v-if="dashboard.enrolledCourses.length">
              <ul class="list-group list-group-flush">
                <li
                  v-for="course in dashboard.enrolledCourses"
                  :key="course.id"
                  class="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div class="me-auto">
                    <div class="fw-semibold">
                      {{ course.course_code }} – {{ course.course_name }}
                    </div>
                    <small class="text-muted">
                      {{ course.year }} – Semester {{ course.semester }}
                    </small>
                  </div>
                </li>
              </ul>
            </div>
            <p v-else class="text-muted mb-0">No enrolled courses available.</p>
          </div>
        </div>
      </div>

      <!-- Top Performing Courses -->
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title mb-3">Top Performing Courses</h5>
            <div v-if="dashboard.topCourses.length">
              <ul class="list-group list-group-flush">
                <li
                  v-for="course in dashboard.topCourses"
                  :key="course.course_id"
                  class="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div class="me-auto">
                    <div class="fw-semibold">
                      {{ course.course_code }} – {{ course.course_name }}
                    </div>
                  </div>
                  <span class="text-success fw-semibold">
                    {{ course.final_mark }}%
                  </span>
                </li>
              </ul>
            </div>
            <p v-else class="text-muted mb-0">No top performing data available.</p>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

// Dashboard data
const dashboard = ref({
  studentName: "",
  totalCourses: 0,
  averageMark: 0,
  highestMark: 0,
  lowestMark: 0,
  pendingRemarks: 0,
  enrolledCourses: [],
  topCourses: [],
});

// Table data
const progressData = ref([]);

// Card summary generator
const summaryCards = computed(() => [
  {
    label: "Courses Enrolled",
    value: dashboard.value.totalCourses,
    colorClass: "text-slate-800",
  },
  {
    label: "Average Mark",
    value: dashboard.value.averageMark,
    colorClass: "text-slate-800",
  },
  {
    label: "Highest Mark",
    value: dashboard.value.highestMark,
    colorClass: "text-green-600",
  },
  {
    label: "Lowest Mark",
    value: dashboard.value.lowestMark,
    colorClass: "text-red-500",
  },
  {
    label: "Pending Recheck",
    value: dashboard.value.pendingRemarks,
    colorClass: "text-yellow-500",
  },
]);

// Fetch functions
const fetchDashboard = async () => {
  try {
    const res = await axios.get("/api/student/dashboard");
    dashboard.value = res.data;
  } catch (err) {
    console.error("Failed to load dashboard data:", err);
    alert("Failed to load dashboard data.");
  }
};

const fetchProgressData = async () => {
  try {
    const res = await axios.get("/api/student/progress");
    progressData.value = res.data;
  } catch (err) {
    console.error("Failed to load progress data:", err);
  }
};

onMounted(() => {
  fetchDashboard();
  fetchProgressData();
});
</script>


<style scoped>
.student-dashboard {
  padding: 1.5rem;
}

.dashboard-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  background-color: #f7f7f7;
  padding: 1rem;
  border-radius: 8px;
  flex: 1 1 220px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section {
  margin-top: 2rem;
}

.section ul {
  list-style: none;
  padding: 0;
}

.section li {
  margin-bottom: 0.75rem;
  border-bottom: 1px dashed #ddd;
  padding-bottom: 0.5rem;
}

.progress-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
  border-radius: 12px;
  overflow: hidden;
}

.progress-table th,
.progress-table td {
  border: 1px solid #ddd;
  padding: 10px 12px;
  text-align: left;
}

.progress-table th {
  background-color: #f8f8f8;
  font-weight: 600;
  color: #444;
}

.progress-table tr {
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.progress-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.progress-table tr:hover {
  background-color: #e2e8f0;
  transform: scale(1.02);
}

.progress-bar-container {
  background-color: #e2e8f0;
  border-radius: 8px;
  height: 8px;
  width: 100%;
}

.progress-bar {
  background-color: #4299e1; /* blue bar */
  height: 8px;
  border-radius: 8px;
  transition: width 0.4s ease;
}
</style>



