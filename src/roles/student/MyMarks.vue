<template>
  <div class="my-marks">
    <h2>📊 My Marks</h2>

    <div v-if="marksByCourse.length === 0">
      <p>Loading or no courses found...</p>
    </div>

    <div v-for="course in marksByCourse" :key="course.course_id" class="course-section">
      <h3>{{ course.course_code }} – {{ course.course_name }}</h3>

      <table class="marks-table">
        <thead>
          <tr>
            <th>Assessment</th>
            <th>Type</th>
            <th>Mark</th>
            <th>Weight (%)</th>
            <th>Weighted Mark</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in course.assessments" :key="a.assessment_id">
            <td>{{ a.title }}</td>
            <td>{{ a.type }}</td>
            <td>
              <span v-if="a.mark_obtained !== null">
                {{ a.mark_obtained }} / {{ a.max_mark }}
              </span>
              <span v-else class="text-muted">Not submitted</span>
            </td>
            <td>{{ a.weight !== null ? Number(a.weight).toFixed(2) : '-' }}</td>
            <td>{{ a.weighted_mark !== null ? Number(a.weighted_mark).toFixed(2) : '-' }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4"><strong>Final Exam</strong></td>
            <td>
              <strong>
                {{ course.final_exam.final_mark !== null ? Number(course.final_exam.final_mark).toFixed(2) : '-' }}
              </strong>
            </td>
          </tr>
          <tr>
            <td colspan="4"><strong>Total Weighted</strong></td>
            <td><strong>{{ course.total_weighted.toFixed(2) }}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      marksByCourse: []
    };
  },
  methods: {
    fetchMyMarks() {
      fetch('/api/student/mymarks')
        .then(res => res.json())
        .then(data => {
          this.marksByCourse = data;
        })
        .catch(err => {
          alert('Failed to load marks.');
          console.error(err);
        });
    }
  },
  mounted() {
    this.fetchMyMarks();
  }
};
</script>

<style scoped>
.my-marks {
  padding: 1.5rem;
}

.course-section {
  margin-top: 2rem;
  background-color: #fdfdfd;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.marks-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}

.marks-table th,
.marks-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

.marks-table th {
  background-color: #f0f0f0;
}

.text-muted {
  color: #999;
  font-style: italic;
}
</style>
