<template>
  <div class="student-dashboard">
    <h2>Welcome, {{ dashboard.studentName }}</h2>

    <!-- Summary Cards -->
    <div class="dashboard-cards">
      <div class="card">Courses Enrolled: <strong>{{ dashboard.totalCourses }}</strong></div>
      <div class="card">Average Mark: <strong>{{ dashboard.averageMark }}</strong></div>
      <div class="card">Highest Mark: <strong>{{ dashboard.highestMark }}</strong></div>
      <div class="card">Lowest Mark: <strong>{{ dashboard.lowestMark }}</strong></div>
      <div class="card">Pending Recheck Requests: <strong>{{ dashboard.pendingRemarks }}</strong></div>
    </div>

    <!-- Enrolled Courses -->
    <div class="section mt-4">
      <h3>📘 Enrolled Courses</h3>
      <ul>
        <li v-for="course in dashboard.enrolledCourses" :key="course.id">
          {{ course.course_code }} – {{ course.course_name }} ({{ course.year }} – {{ course.semester }})
        </li>
      </ul>
    </div>

    <!-- Top Performing Courses -->
    <div class="section mt-4">
      <h3>🏅 Top Performing Courses</h3>
      <ul>
        <li v-for="course in dashboard.topCourses" :key="course.course_id">
          {{ course.course_code }} – {{ course.course_name }}: <strong>{{ course.final_mark }}%</strong>
        </li>
      </ul>
    </div>

    <!-- Assessment Completion -->
    <div class="section mt-4">
      <h3>📝 Assessment Progress</h3>
      <ul>
        <li v-for="status in dashboard.assessmentStatus" :key="status.course_id">
          {{ status.course_code }} – {{ status.course_name }}: {{ status.completed }}/{{ status.total }} completed
        </li>
      </ul>
    </div>

    <!-- Advisor Notes -->
    <div class="section mt-4">
      <h3>📌 Advisor Notes</h3>
      <ul>
        <li v-for="note in dashboard.advisorNotes" :key="note.id">
          {{ note.note }} <br />
          <small>{{ formatDate(note.meeting_date) }}</small>
        </li>
      </ul>
    </div>

    <!-- Remark Requests -->
    <div class="section mt-4">
      <h3>📤 Latest Remark Requests</h3>
      <ul>
        <li v-for="remark in dashboard.recentRemarkRequests" :key="remark.id">
          {{ remark.course_code }} – {{ remark.assessment_title }}: 
          <strong>{{ remark.status }}</strong>
        </li>
      </ul>
    </div>

    <!-- Notifications -->
    <div class="section mt-4">
      <h3>🔔 Recent Notifications</h3>
      <ul v-if="dashboard.recentNotifications.length > 0">
        <li v-for="note in dashboard.recentNotifications" :key="note.id">
          <strong>{{ note.title }}</strong> – {{ note.message }}<br />
          <small>{{ formatDate(note.created_at) }}</small>
        </li>
      </ul>
      <p v-else>No notifications yet.</p>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      dashboard: {
        studentName: '',
        totalCourses: 0,
        averageMark: 0,
        highestMark: 0,
        lowestMark: 0,
        pendingRemarks: 0,
        recentNotifications: [],
        enrolledCourses: [],
        topCourses: [],
        advisorNotes: [],
        assessmentStatus: [],
        recentRemarkRequests: []
      }
    };
  },
  methods: {
    fetchDashboard() {
      fetch('/api/student/dashboard')
        .then(res => res.json())
        .then(data => {
          this.dashboard = data;
        })
        .catch(err => {
          alert('Failed to load dashboard data.');
          console.error(err);
        });
    },

    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    }
  },
  mounted() {
    this.fetchDashboard();
  }
};
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
</style>
