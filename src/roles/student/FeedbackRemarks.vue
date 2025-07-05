<template>
  <div class="feedback-page">
    <h2>💬 Feedback & Remarks</h2>

    <div v-if="remarks.length === 0">
      <p>No feedback available yet.</p>
    </div>

    <div v-else class="remarks-list">
      <div v-for="remark in remarks" :key="remark.id" class="remark-card">
        <div class="remark-header">
          <strong>{{ remark.course_code || 'General Feedback' }} – {{ remark.course_name || 'No Course' }}</strong>
        </div>
        <div class="remark-body">
          <p>{{ remark.note }}</p>
          <small>
            🧑 Advisor: {{ remark.advisor_name }} |
            📅 Meeting: {{ formatDate(remark.meeting_date) }} |
            🕒 Added: {{ formatDate(remark.created_at) }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      remarks: []
    };
  },
  methods: {
    fetchRemarks() {
      fetch('/api/student/remarks')
        .then(res => res.json())
        .then(data => {
          this.remarks = data || [];
        })
        .catch(err => {
          console.error('Failed to fetch remarks', err);
        });
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  },
  mounted() {
    this.fetchRemarks();
  }
};
</script>

<style scoped>
.feedback-page {
  padding: 1.5rem;
}

.remarks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.remark-card {
  padding: 1rem;
  border: 1px solid #ccc;
  border-left: 6px solid #4caf50;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.remark-header {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.remark-body {
  font-size: 0.95rem;
  color: #333;
}

.remark-body small {
  display: block;
  color: #777;
  margin-top: 0.5rem;
}
</style>
