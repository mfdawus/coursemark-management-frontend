<template>
  <div class="recheck-page">
    <h2>📤 Request Rechecking</h2>

    <div class="form-section">
      <label for="assessment">📚 Select Assessment</label>
      <select v-model="newRequest.assessment_id">
        <option disabled value="">-- Please choose --</option>
        <option v-for="assess in assessments" :key="assess.id" :value="assess.id">
          {{ assess.course_code }} - {{ assess.title }} ({{ assess.type }})
        </option>
      </select>

      <label for="message">📝 Message</label>
      <textarea v-model="newRequest.message" rows="3" placeholder="Explain your reason..."></textarea>

      <button @click="submitRequest">Submit Request</button>
    </div>

    <hr>

    <h3>🧾 Your Requests</h3>

    <table class="request-table" v-if="requests.length">
      <thead>
        <tr>
          <th>Course</th>
          <th>Assessment</th>
          <th>Message</th>
          <th>Status</th>
          <th>Requested At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="req in requests" :key="req.id">
          <td>{{ req.course_code }} - {{ req.course_name }}</td>
          <td>{{ req.assessment_title }} ({{ req.assessment_type }})</td>
          <td>{{ req.message }}</td>
          <td><span :class="'badge ' + req.status">{{ req.status }}</span></td>
          <td>{{ formatDate(req.created_at) }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else>
      <p>No recheck requests submitted yet.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      assessments: [],
      requests: [],
      newRequest: {
        assessment_id: '',
        message: ''
      }
    };
  },
  methods: {
    fetchAssessments() {
      fetch('/api/student/assessments') // must create this if not available
        .then(res => res.json())
        .then(data => {
          this.assessments = data;
        });
    },
    fetchRequests() {
      fetch('/api/student/remark-requests')
        .then(res => res.json())
        .then(data => {
          this.requests = data || [];
        });
    },
    submitRequest() {
      if (!this.newRequest.assessment_id || !this.newRequest.message.trim()) {
        alert('Please select an assessment and enter a message.');
        return;
      }

      fetch('/api/student/remark-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.newRequest)
      })
        .then(res => {
          if (!res.ok) return res.json().then(err => Promise.reject(err));
          return res.json();
        })
        .then(data => {
          alert(data.message || 'Submitted.');
          this.newRequest.assessment_id = '';
          this.newRequest.message = '';
          this.fetchRequests(); // refresh list
        })
        .catch(err => {
          alert(err.error || 'Request failed.');
          console.error(err);
        });
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  mounted() {
    this.fetchAssessments();
    this.fetchRequests();
  }
};
</script>

<style scoped>
.recheck-page {
  padding: 1.5rem;
}
.form-section {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
textarea {
  resize: vertical;
}
button {
  align-self: start;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
}
table.request-table {
  width: 100%;
  border-collapse: collapse;
}
table th, table td {
  border: 1px solid #ccc;
  padding: 8px;
}
.badge {
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: capitalize;
}
.badge.pending {
  background-color: #fffae6;
  color: #b58900;
}
.badge.approved {
  background-color: #d4edda;
  color: #155724;
}
.badge.rejected {
  background-color: #f8d7da;
  color: #721c24;
}
.badge.reviewed {
  background-color: #d1ecf1;
  color: #0c5460;
}
</style>
