<template>
  <div class="main-content">
    <!-- Header -->
    <header class="dashboard-header">
      <h1>Welcome Back, Advisor!</h1>
      <input v-model="searchQuery" type="text" placeholder="Search student or course..." class="form-control" />
    </header>

    <!-- Metrics Cards -->
    <section class="metrics-cards mb-4">
      <div class="card metric-card">
        <div class="metric-title">Total Advisees</div>
        <div class="metric-value">{{ mentors.length }}</div>
      </div>
      <div class="card metric-card">
        <div class="metric-title">Good Standing</div>
        <div class="metric-value">{{ mentors.filter(m => m.cgpa >= 3.0).length }}</div>
      </div>
      <div class="card metric-card">
        <div class="metric-title">Warning</div>
        <div class="metric-value">{{ mentors.filter(m => m.cgpa >= 2.0 && m.cgpa < 3.0).length }}</div>
      </div>
      <div class="card metric-card">
        <div class="metric-title">Probation</div>
        <div class="metric-value">{{ mentors.filter(m => m.cgpa < 2.0).length }}</div>
      </div>
      <div class="card metric-card">
        <div class="metric-title">Avg. CGPA</div>
        <div class="metric-value">
          {{ (mentors.reduce((sum, m) => sum + m.cgpa, 0) / mentors.length).toFixed(2) }}
        </div>
      </div>
    </section>

    <!-- Banner -->
    <section class="course-banner">
      <h2>Guide Your Students to Academic Success</h2>
      <button @click="scrollToMentors">View Student List</button>
    </section>

    <!-- Courses -->
    <section class="continue-watching">
      <h3>Monitored Courses</h3>
      <div class="courses">
        <div class="course-card" v-for="course in courses" :key="course.id">
          <img :src="course.thumbnail" alt="Course thumbnail" />
          <h4>{{ course.title }}</h4>
          <p>{{ course.instructor }}</p>
        </div>
      </div>
    </section>

    <!-- Chart Row: Pie and Bar Side by Side -->
    <section class="advisor-charts-row mt-5">
      <div class="advisor-chart-col">
        <h3>CGPA Distribution</h3>
        <canvas id="cgpaPieChart" height="220"></canvas>
      </div>
      <div class="advisor-chart-col">
        <h3>Advisees by Course</h3>
        <canvas id="adviseeCourseBarChart" height="220"></canvas>
      </div>
    </section>

    <!-- Advisee List -->
    <section class="mentor-section mt-5" ref="mentorSection">
      <div class="mentor-header-row mb-2">
        <h3>Top 10 Students You Advise</h3>
        <div class="mentor-header-actions">
          <button class="btn btn-outline-secondary" @click="printMentors">
            Print Advisee List
          </button>
          <button class="btn btn-outline-secondary" @click="$router.push('/advisor/adviseereport')">
            View All Report
          </button>
        </div>
      </div>
      <ul>
        <li v-for="mentor in filteredMentors" :key="mentor.id">
          {{ mentor.name }} - {{ mentor.course }} (CGPA: {{ mentor.cgpa }})
        </li>
      </ul>
    </section>

    <!-- At-Risk Students Section -->
    <section class="at-risk-section mt-5">
      <h3>🚨 At-Risk Students (CGPA &lt; 2.0)</h3>
      <ul>
        <li v-for="mentor in mentors.filter(m => m.cgpa < 2.0)" :key="mentor.id">
          {{ mentor.name }} - {{ mentor.course }} (CGPA: {{ mentor.cgpa }})
        </li>
        <li v-if="mentors.filter(m => m.cgpa < 2.0).length === 0">No at-risk students.</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Chart from 'chart.js/auto'

// Dummy Data
const courses = ref([
  {
    id: 1,
    title: 'Data Structures',
    instructor: 'Prof. Amir',
    thumbnail: 'https://via.placeholder.com/200x100'
  },
  {
    id: 2,
    title: 'Database Systems',
    instructor: 'Dr. Nurul',
    thumbnail: 'https://via.placeholder.com/200x100'
  }
])

const mentors = ref([
  { id: 1, name: 'Aliya Binti Zainal', course: 'Software Engineering', cgpa: 3.7 },
  { id: 2, name: 'John Lee', course: 'Cybersecurity', cgpa: 2.8 },
  { id: 3, name: 'Sarah Lim', course: 'AI & Robotics', cgpa: 3.4 },
  { id: 4, name: 'Hafiz Zulkarnain', course: 'Multimedia', cgpa: 2.4 },
  { id: 5, name: 'Nadira Yusof', course: 'Networking', cgpa: 3.9 }
])

const searchQuery = ref('')
const mentorSection = ref(null)

const filteredMentors = computed(() =>
  mentors.value.filter(
    m =>
      m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.course.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const printMentors = () => {
  const win = window.open('', '', 'width=600,height=800')
  const content = filteredMentors.value
    .map(m => `${m.name} - ${m.course} (CGPA: ${m.cgpa})`)
    .join('<br>')
  win.document.write(`<html><head><title>Advisee List</title></head><body>${content}</body></html>`)
  win.document.close()
  win.print()
}

const scrollToMentors = () => {
  mentorSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// Pie Chart Setup
onMounted(() => {
  const cgpaBuckets = {
    excellent: mentors.value.filter(m => m.cgpa >= 3.5).length,
    good: mentors.value.filter(m => m.cgpa >= 3.0 && m.cgpa < 3.5).length,
    average: mentors.value.filter(m => m.cgpa >= 2.5 && m.cgpa < 3.0).length,
    low: mentors.value.filter(m => m.cgpa < 2.5).length
  }

  new Chart(document.getElementById('cgpaPieChart'), {
    type: 'pie',
    data: {
      labels: ['3.5 - 4.0 (Excellent)', '3.0 - 3.49 (Good)', '2.5 - 2.99 (Average)', '< 2.5 (Low)'],
      datasets: [
        {
          data: [cgpaBuckets.excellent, cgpaBuckets.good, cgpaBuckets.average, cgpaBuckets.low],
          backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#dc3545']
        }
      ]
    }
  })

  // Bar chart for advisees by course
  const courseCounts = {};
  mentors.value.forEach(m => {
    courseCounts[m.course] = (courseCounts[m.course] || 0) + 1;
  });
  const barCtx = document.getElementById('adviseeCourseBarChart');
  if (barCtx) {
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(courseCounts),
        datasets: [{
          label: 'Number of Advisees',
          data: Object.values(courseCounts),
          backgroundColor: '#6c63ff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
})
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
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
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
  box-shadow: 0 1px 3px rgba(183,28,28,0.05);
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
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
