<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="mb-4">
      <h2 class="text-dark font-weight-bolder">Welcome Back, Advisor!</h2>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search student or course..."
        class="form-control mt-2"
        style="max-width: 300px"
      />
    </div>

    <!-- Metrics Cards -->
    <div class="row">
      <div class="col-md-3 col-12 mb-3">
        <mini-statistics-card
          title="Total Advisees"
          :value="metrics.total_advisees.toString()"
          :icon="{
            component: 'ni ni-single-02',
            background: 'bg-gradient-info',
            shape: 'rounded-circle',
          }"
        />
      </div>
      <div class="col-md-3 col-12 mb-3">
        <mini-statistics-card
          title="Good Standing"
          :value="metrics.good_standing.toString()"
          :icon="{
            component: 'ni ni-check-bold',
            background: 'bg-gradient-success',
            shape: 'rounded-circle',
          }"
        />
      </div>
      <div class="col-md-3 col-12 mb-3">
        <mini-statistics-card
          title="Warning"
          :value="metrics.warning.toString()"
          :icon="{
            component: 'fa fa-exclamation-circle',
            background: 'bg-gradient-warning',
            shape: 'rounded-circle',
          }"
        />
      </div>
      <div class="col-md-3 col-12 mb-3">
        <mini-statistics-card
          title="Probation"
          :value="metrics.probation.toString()"
          :icon="{
            component: 'ni ni-fat-remove',
            background: 'bg-gradient-danger',
            shape: 'rounded-circle',
          }"
        />
      </div>
    </div>
    <!-- Avg CGPA -->
    <div class="mb-4">
      <mini-statistics-card
        title="Avg. CGPA"
        :value="metrics.avg_cgpa.toFixed(2)"
        :icon="{
          component: 'ni ni-chart-bar-32',
          background: 'bg-gradient-primary',
          shape: 'rounded-circle',
        }"
      />
    </div>

    <!-- Banner -->
    <div class="card bg-gradient-success text-white mb-4 px-4 py-4 shadow">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <h4 class="mb-2 mb-md-0">Guide Your Students to Academic Success</h4>
        <button class="btn btn-outline-light" @click="scrollToMentors">
          View Student List
        </button>
      </div>
    </div>

    <!-- Monitored Courses -->
    <div class="mb-4">
      <h5 class="mb-3">Monitored Courses</h5>
      <div class="row">
        <div
          class="col-md-4 mb-3"
          v-for="course in courses"
          :key="course.id"
        >
          <div class="card card-hover" @click="openCourseStudents(course)" style="cursor:pointer;">
            <div class="card-body">
              <h5 class="card-title">{{ course.course_name }}</h5>
              <p class="card-text">{{ course.course_code }} | {{ course.semester }} {{ course.year }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for students in course -->
    <div v-if="showModal" class="modal fade show" tabindex="-1" style="display:block; background:rgba(0,0,0,0.4);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Students in {{ selectedCourse?.course_name }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="loadingStudents">Loading...</div>
            <div v-else-if="studentsError">{{ studentsError }}</div>
            <ul v-else class="list-group">
              <li v-if="studentsInCourse.length === 0" class="list-group-item text-muted">No students enrolled.</li>
              <li v-for="student in studentsInCourse" :key="student.id" class="list-group-item">
                {{ student.name }} ({{ student.matric_number }})
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="row justify-content-center">
      <div class="col-md-6 d-flex justify-content-center">
        <div class="card p-4 mb-4 w-100" style="max-width: 500px;">
          <h6 class="text-center">CGPA Distribution</h6>
          <canvas id="cgpaPieChart" height="200"></canvas>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="card p-4 mb-4">
          <h6>Average CGPA by Course</h6>
          <canvas id="avgCgpaBarChart" height="120"></canvas>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="card p-4 mb-4">
          <h6>Advisees by Course</h6>
          <canvas id="adviseeCourseBarChart" height="200"></canvas>
        </div>
      </div>
    </div>

    <!-- Advisee List -->
    <div ref="mentorSection" class="card p-4 mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5>Top 10 Students You Advise</h5>
      </div>
      <ul class="list-group">
        <li
          class="list-group-item"
          v-for="student in top10Students"
          :key="student.matric_number"
        >
          {{ student.name }} ({{ student.matric_number }}) - CGPA: {{ student.cgpa }}
        </li>
        <li v-if="top10Students.length === 0" class="list-group-item text-muted">No data available.</li>
      </ul>
    </div>

    <!-- At-Risk Students -->
    <div class="card p-4 bg-light border-danger">
      <h5 class="text-danger mb-3">🚨 At-Risk Students (CGPA &lt; 2.0)</h5>
      <ul class="list-group">
        <li
          v-for="student in atRiskStudents"
          :key="student.matric_number"
          class="list-group-item text-danger"
        >
          {{ student.name }} ({{ student.matric_number }}) - CGPA: {{ student.cgpa }}
        </li>
        <li v-if="atRiskStudents.length === 0" class="list-group-item text-muted">
          No at-risk students.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import axios from "axios";

// Courses state
const courses = ref([]);
const selectedCourse = ref(null);
const studentsInCourse = ref([]);
const showModal = ref(false);
const loadingStudents = ref(false);
const studentsError = ref("");
const studentsByCourse = ref([]);

const openCourseStudents = async (course) => {
  selectedCourse.value = course;
  showModal.value = true;
  studentsInCourse.value = [];
  studentsError.value = "";
  loadingStudents.value = true;
  try {
    const res = await axios.get(`/api/advisor/courses/${course.id}/students`);
    studentsInCourse.value = res.data;
  } catch (e) {
    studentsError.value = "Failed to load students.";
  }
  loadingStudents.value = false;
};

const closeModal = () => {
  showModal.value = false;
  selectedCourse.value = null;
  studentsInCourse.value = [];
  studentsError.value = "";
};

const searchQuery = ref("");
const mentorSection = ref(null);

const scrollToMentors = () => {
  mentorSection.value?.scrollIntoView({ behavior: "smooth" });
};

// Metrics state
const metrics = ref({
  total_advisees: 0,
  good_standing: 0,
  warning: 0,
  probation: 0,
  avg_cgpa: 0,
});

const cgpaDistribution = ref({ excellent: 0, good: 0, average: 0, low: 0 });
const avgCgpaByCourse = ref([]);
const top10Students = ref([]);
const atRiskStudents = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get("/api/advisor/dashboard");
    if (res.data) {
      metrics.value = res.data;
    }
  } catch (e) {
    // handle error (optional)
  }

  try {
    const res = await axios.get("/api/advisor/courses");
    if (res.data) {
      courses.value = res.data;
    }
  } catch (e) {
    // handle error (optional)
  }

  try {
    const res = await axios.get("/api/advisor/students-by-course");
    if (res.data) {
      studentsByCourse.value = res.data;
    }
  } catch (e) {
    // handle error (optional)
  }

  try {
    const res = await axios.get("/api/advisor/cgpa-distribution");
    if (res.data) {
      cgpaDistribution.value = res.data;
    }
  } catch (e) {
    // handle error (optional)
  }

  try {
    const res = await axios.get("/api/advisor/avg-cgpa-by-course");
    if (res.data) {
      avgCgpaByCourse.value = res.data;
    }
  } catch (e) {
    // handle error (optional)
  }

  try {
    const res = await axios.get("/api/advisor/top-10-students");
    if (res.data) {
      top10Students.value = res.data;
    }
  } catch (e) { /* ignore error */ }
  try {
    const res = await axios.get("/api/advisor/at-risk-students");
    if (res.data) {
      atRiskStudents.value = res.data;
    }
  } catch (e) { /* ignore error */ }

  // Pie Chart Setup (now using real data)
  new Chart(document.getElementById("cgpaPieChart"), {
    type: "pie",
    data: {
      labels: [
        "3.5 - 4.0 (Excellent)",
        "3.0 - 3.49 (Good)",
        "2.5 - 2.99 (Average)",
        "< 2.5 (Low)",
      ],
      datasets: [
        {
          data: [
            cgpaDistribution.value.excellent,
            cgpaDistribution.value.good,
            cgpaDistribution.value.average,
            cgpaDistribution.value.low,
          ],
          backgroundColor: ["#28a745", "#17a2b8", "#ffc107", "#dc3545"],
        },
      ],
    },
  });

  // Bar chart for advisees by course (now using real data)
  const barCtx = document.getElementById("adviseeCourseBarChart");
  if (barCtx) {
    new Chart(barCtx, {
      type: "bar",
      data: {
        labels: studentsByCourse.value.map((c) => c.course_name),
        datasets: [
          {
            label: "Number of Students",
            data: studentsByCourse.value.map((c) => c.student_count),
            backgroundColor: "#6c63ff",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  // Bar chart for Average CGPA by Course
  const avgCgpaCtx = document.getElementById("avgCgpaBarChart");
  if (avgCgpaCtx) {
    new Chart(avgCgpaCtx, {
      type: "bar",
      data: {
        labels: avgCgpaByCourse.value.map((c) => c.course_name),
        datasets: [
          {
            label: "Average CGPA",
            data: avgCgpaByCourse.value.map((c) => c.avg_cgpa),
            backgroundColor: "#17a2b8",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            min: 0,
            max: 4,
            title: { display: true, text: "CGPA" },
          },
        },
      },
    });
  }
});
</script>

<style scoped>
.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f9f9f9;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header input {
  padding: 0.5rem;
  width: 300px;
}

.metrics-cards {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.metric-card {
  background: #fff;
  border-radius: 8px;
  padding: 1.2rem 2rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  text-align: center;
  min-width: 120px;
}
.metric-title {
  font-size: 1rem;
  color: #888;
  margin-bottom: 0.5rem;
}
.metric-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.course-banner {
  background-color: #6c63ff;
  color: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-banner button {
  background: white;
  color: #6c63ff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.continue-watching .courses {
  display: flex;
  gap: 1rem;
}

.course-card {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  width: 200px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.course-card img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.mentor-section ul {
  list-style-type: none;
  padding-left: 0;
}

.mentor-section li {
  background: #fff;
  margin-bottom: 0.5rem;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.at-risk-section ul {
  list-style-type: none;
  padding-left: 0;
}
.at-risk-section li {
  background: #fff0f0;
  color: #b71c1c;
  margin-bottom: 0.5rem;
  padding: 0.8rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(183, 28, 28, 0.05);
}

.advisor-charts-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  justify-content: center;
}
.advisor-chart-col {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex: 1 1 0;
  min-width: 300px;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.advisor-chart-col h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.mentor-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.mentor-header-row h3 {
  margin: 0;
  font-size: 1.3rem;
}
.mentor-header-actions {
  display: flex;
  gap: 0.5rem;
}
@media (max-width: 600px) {
  .mentor-header-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .mentor-header-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
.card-hover:hover {
  box-shadow: 0 4px 16px rgba(44,62,80,0.15);
  border-color: #6c63ff;
}
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-backdrop {
  opacity: 0.4;
}
</style>
