<template>
  <div class="ranking-page px-4 py-3">
    <!-- Title -->
    <h3 class="fw-bold text-white mb-4">Rankings & Comparison</h3>

    <!-- Loading -->
    <div v-if="rankings.length === 0" class="alert alert-white">
      Loading rankings...
    </div>

    <!-- Course Ranking Blocks -->
    <div
      v-for="(course, index) in rankings"
      :key="index"
      class="card shadow-sm border-0 mb-4"
    >
      <div class="card-body">
        <!-- Course Title -->
        <h5 class="card-title fw-semibold mb-2">
          {{ course.course_code }} - {{ course.course_name }}
        </h5>

        <!-- Stats -->
        <p class="text-muted small mb-3">
          <strong>Your Rank:</strong> #{{ course.your_rank }}<br />
          <strong>Total Students:</strong> {{ course.total_students }}<br />
          <strong>Class Average:</strong> {{ course.class_average.toFixed(2) }}%
        </p>

        <!-- Student Rankings Table -->
        <div class="table-responsive">
          <table class="table table-bordered table-sm align-middle text-center">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th class="text-start">Student Name</th>
                <th>Total Mark (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(student, idx) in course.students"
                :key="idx"
                :class="{ 'table-primary': student.name === currentStudentName }"
              >
                <td>{{ idx + 1 }}</td>
                <td class="text-start">{{ student.name }}</td>
                <td>{{ student.total_mark.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StudentRankings",
  data() {
    return {
      rankings: [],
      currentStudentName: "", // to highlight user
    };
  },
  mounted() {
    this.fetchRankings();
    this.fetchStudentInfo(); // for name highlighting
  },
  methods: {
    fetchRankings() {
      fetch("/api/student/rankings")
        .then((res) => res.json())
        .then((data) => {
          this.rankings = data;
        })
        .catch((err) => {
          alert("Failed to load rankings.");
          console.error(err);
        });
    },
    fetchStudentInfo() {
      fetch("/api/session") // optional: create /api/session to return { name: 'Student A' }
        .then((res) => res.json())
        .then((data) => {
          this.currentStudentName = data.name;
        })
        .catch((err) => {
          console.error("Failed to load rankings.", err);
        });
    },
  },
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
