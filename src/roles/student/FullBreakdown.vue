<template>
  <div class="full-breakdown">
    <h2>📂 Full Mark Breakdown</h2>

    <div v-if="marks.length === 0">
      <p>No assessments found or still loading...</p>
    </div>

    <table v-else class="breakdown-table">
      <thead>
        <tr>
          <th>Course Code</th>
          <th>Course Name</th>
          <th>Title</th>
          <th>Type</th>
          <th>Mark</th>
          <th>Weight (%)</th>
          <th>Weighted Mark</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(m, index) in marks" :key="index">
          <td>{{ m.course_code }}</td>
          <td>{{ m.course_name }}</td>
          <td>{{ m.title }}</td>
          <td>{{ formatType(m.type) }}</td>
          <td>
            <span v-if="m.mark_obtained !== null">
              {{ m.mark_obtained }} / {{ m.max_mark }}
            </span>
            <span v-else class="text-muted">Not submitted</span>
          </td>
          <td>
            {{ m.weight !== null ? Number(m.weight).toFixed(2) : '-' }}
          </td>
          <td>
            {{ m.weighted_mark !== null ? Number(m.weighted_mark).toFixed(2) : '-' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  data() {
    return {
      marks: []
    };
  },
  methods: {
    fetchBreakdown() {
      fetch('/api/student/fullbreakdown')
        .then(res => res.json())
        .then(data => {
          this.marks = data || [];
        })
        .catch(err => {
          alert('Failed to load full breakdown.');
          console.error(err);
        });
    },
    formatType(type) {
      if (type === 'final_exam') return 'Final Exam';
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  },
  mounted() {
    this.fetchBreakdown();
  }
};
</script>

<style scoped>
.full-breakdown {
  padding: 1.5rem;
}

.breakdown-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.breakdown-table th,
.breakdown-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.breakdown-table th {
  background-color: #f7f7f7;
}

.text-muted {
  color: #888;
  font-style: italic;
}
</style>
