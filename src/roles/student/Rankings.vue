<template>
  <div class="ranking-page">
    <h2>🏅 Rankings & Comparison</h2>

    <div v-if="rankings.length === 0">
      <p>Loading rankings...</p>
    </div>

    <div v-for="(course, index) in rankings" :key="index" class="ranking-block">
      <h3>{{ course.course_code }} - {{ course.course_name }}</h3>
      <p>
        🧍 Your Rank: <strong>#{{ course.your_rank }}</strong><br>
        🧑‍🤝‍🧑 Total Students: {{ course.total_students }}<br>
        📊 Class Average: {{ course.class_average.toFixed(2) }}%
      </p>

      <table class="ranking-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Total Mark (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(student, idx) in course.students"
            :key="idx"
            :class="{ 'highlight-me': student.name === currentStudentName }"
          >
            <td>{{ idx + 1 }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.total_mark.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentRankings',
  data() {
    return {
      rankings: [],
      currentStudentName: '', // to highlight user
    };
  },
  methods: {
    fetchRankings() {
      fetch('/api/student/rankings')
        .then(res => res.json())
        .then(data => {
          this.rankings = data;
        })
        .catch(err => {
          alert('Failed to load rankings.');
          console.error(err);
        });
    },
    fetchStudentInfo() {
      fetch('/api/session') // optional: create /api/session to return { name: 'Student A' }
        .then(res => res.json())
        .then(data => {
          this.currentStudentName = data.name;
        })
        .catch(err => {
          console.error('Failed to load rankings.', err);
        });
    }
  },
  mounted() {
    this.fetchRankings();
    this.fetchStudentInfo(); // for name highlighting
  }
};
</script>

<style scoped>
.ranking-page {
  padding: 1.5rem;
}

.ranking-block {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.ranking-table th,
.ranking-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

.highlight-me {
  background-color: #d2f4d2;
  font-weight: bold;
}
</style>
