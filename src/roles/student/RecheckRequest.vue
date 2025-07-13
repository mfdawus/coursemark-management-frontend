<template>
  <div class="recheck-page px-4 py-3">
    <!-- Header -->
    <h3 class="fw-bold text-white mb-4">Request Rechecking</h3>

    <!-- Request Form -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label fw-semibold">Select Assessment</label>
          <select v-model="newRequest.assessment_id" class="form-select">
            <option disabled value="">-- Please choose --</option>
            <option
              v-for="assess in assessments"
              :key="assess.id"
              :value="assess.id"
            >
              {{ assess.course_code }} - {{ assess.title }} ({{ assess.type }})
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Message</label>
          <textarea
            v-model="newRequest.message"
            class="form-control"
            rows="3"
            placeholder="Explain your reason..."
          ></textarea>
        </div>

        <button class="btn btn-primary float-end" @click="submitRequest">
          Submit Request
        </button>
      </div>
    </div>

    <!-- Previous Requests -->
    <h4 class="fw-semibold text-dark mb-3">Your Requests</h4>

    <div v-if="requests.length > 0" class="table-responsive">
      <table class="table table-bordered align-middle text-center table-hover">
        <thead class="table-light border">
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
            <td class="text-start">
              {{ req.course_code }} - {{ req.course_name }}
            </td>
            <td>{{ req.assessment_title }} ({{ req.assessment_type }})</td>
            <td class="text-start">{{ req.message }}</td>
            <td>
              <span
                class="badge"
                :class="{
                  'bg-warning': req.status === 'Pending',
                  'bg-success': req.status === 'Approved',
                  'bg-danger': req.status === 'Rejected'
                }"
              >
                {{ req.status }}
              </span>
            </td>
            <td>{{ formatDate(req.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="alert alert-white">
      No recheck requests submitted yet.
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
        assessment_id: "",
        message: "",
      },
    };
  },
  mounted() {
    this.fetchAssessments();
    this.fetchRequests();
  },
  methods: {
    fetchAssessments() {
      fetch("/api/student/assessments") // must create this if not available
        .then((res) => res.json())
        .then((data) => {
          this.assessments = data;
        });
    },
    fetchRequests() {
      fetch("/api/student/remark-requests")
        .then((res) => res.json())
        .then((data) => {
          this.requests = data || [];
        });
    },
    submitRequest() {
      if (!this.newRequest.assessment_id || !this.newRequest.message.trim()) {
        alert("Please select an assessment and enter a message.");
        return;
      }

      fetch("/api/student/remark-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.newRequest),
      })
        .then((res) => {
          if (!res.ok) return res.json().then((err) => Promise.reject(err));
          return res.json();
        })
        .then((data) => {
          alert(data.message || "Submitted.");
          this.newRequest.assessment_id = "";
          this.newRequest.message = "";
          this.fetchRequests(); // refresh list
        })
        .catch((err) => {
          alert(err.error || "Request failed.");
          console.error(err);
        });
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
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
table th,
table td {
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
