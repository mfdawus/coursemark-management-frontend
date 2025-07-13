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
          :value="mentors.length.toString()"
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
          :value="mentors.filter((m) => m.cgpa >= 3.0).length.toString()"
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
          :value="mentors.filter((m) => m.cgpa >= 2.0 && m.cgpa < 3.0).length.toString()"
          :icon="{
            component: 'ni ni-alert-circle-exc',
            background: 'bg-gradient-warning',
            shape: 'rounded-circle',
          }"
        />
      </div>
      <div class="col-md-3 col-12 mb-3">
        <mini-statistics-card
          title="Probation"
          :value="mentors.filter((m) => m.cgpa < 2.0).length.toString()"
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
        :value="(mentors.reduce((sum, m) => sum + m.cgpa, 0) / mentors.length).toFixed(2)"
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
          <div class="card">
            <img
              :src="course.thumbnail"
              class="card-img-top"
              alt="Course thumbnail"
            />
            <div class="card-body">
              <h5 class="card-title">{{ course.title }}</h5>
              <p class="card-text">{{ course.instructor }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="row">
      <div class="col-md-6">
        <div class="card p-4 mb-4">
          <h6>CGPA Distribution</h6>
          <canvas id="cgpaPieChart" height="200"></canvas>
        </div>
      </div>
      <div class="col-md-6">
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
        <div>
          <button class="btn btn-outline-secondary me-2" @click="printMentors">
            Print
          </button>
          <button
            class="btn btn-outline-info"
            @click="router.push('/advisor/adviseereport')"
          >
            View All Report
          </button>
        </div>
      </div>
      <ul class="list-group">
        <li
          class="list-group-item"
          v-for="mentor in filteredMentors.slice(0, 10)"
          :key="mentor.id"
        >
          {{ mentor.name }} - {{ mentor.course }} (CGPA: {{ mentor.cgpa }})
        </li>
      </ul>
    </div>

    <!-- At-Risk Students -->
    <div class="card p-4 bg-light border-danger">
      <h5 class="text-danger mb-3">🚨 At-Risk Students (CGPA &lt; 2.0)</h5>
      <ul class="list-group">
        <li
          v-for="mentor in mentors.filter((m) => m.cgpa < 2.0)"
          :key="mentor.id"
          class="list-group-item text-danger"
        >
          {{ mentor.name }} - {{ mentor.course }} (CGPA: {{ mentor.cgpa }})
        </li>
        <li
          v-if="mentors.filter((m) => m.cgpa < 2.0).length === 0"
          class="list-group-item text-muted"
        >
          No at-risk students.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Chart from "chart.js/auto";
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";

// Dummy Data
const courses = ref([
  {
    id: 1,
    title: "Data Structures",
    instructor: "Prof. Amir",
    thumbnail: "https://via.placeholder.com/200x100",
  },
  {
    id: 2,
    title: "Database Systems",
    instructor: "Dr. Nurul",
    thumbnail: "https://via.placeholder.com/200x100",
  },
]);

const mentors = ref([
  {
    id: 1,
    name: "Aliya Binti Zainal",
    course: "Software Engineering",
    cgpa: 3.7,
  },
  { id: 2, name: "John Lee", course: "Cybersecurity", cgpa: 2.8 },
  { id: 3, name: "Sarah Lim", course: "AI & Robotics", cgpa: 3.4 },
  { id: 4, name: "Hafiz Zulkarnain", course: "Multimedia", cgpa: 2.4 },
  { id: 5, name: "Nadira Yusof", course: "Networking", cgpa: 3.9 },
]);

const searchQuery = ref("");
const mentorSection = ref(null);

const filteredMentors = computed(() =>
  mentors.value.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.course.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ),
);

const printMentors = () => {
  const win = window.open("", "", "width=600,height=800");
  const content = filteredMentors.value
    .map((m) => `${m.name} - ${m.course} (CGPA: ${m.cgpa})`)
    .join("<br>");
  win.document.write(
    `<html><head><title>Advisee List</title></head><body>${content}</body></html>`,
  );
  win.document.close();
  win.print();
};

const scrollToMentors = () => {
  mentorSection.value?.scrollIntoView({ behavior: "smooth" });
};

// Pie Chart Setup
onMounted(() => {
  const cgpaBuckets = {
    excellent: mentors.value.filter((m) => m.cgpa >= 3.5).length,
    good: mentors.value.filter((m) => m.cgpa >= 3.0 && m.cgpa < 3.5).length,
    average: mentors.value.filter((m) => m.cgpa >= 2.5 && m.cgpa < 3.0).length,
    low: mentors.value.filter((m) => m.cgpa < 2.5).length,
  };

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
            cgpaBuckets.excellent,
            cgpaBuckets.good,
            cgpaBuckets.average,
            cgpaBuckets.low,
          ],
          backgroundColor: ["#28a745", "#17a2b8", "#ffc107", "#dc3545"],
        },
      ],
    },
  });

  // Bar chart for advisees by course
  const courseCounts = {};
  mentors.value.forEach((m) => {
    courseCounts[m.course] = (courseCounts[m.course] || 0) + 1;
  });
  const barCtx = document.getElementById("adviseeCourseBarChart");
  if (barCtx) {
    new Chart(barCtx, {
      type: "bar",
      data: {
        labels: Object.keys(courseCounts),
        datasets: [
          {
            label: "Number of Advisees",
            data: Object.values(courseCounts),
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
</style>
