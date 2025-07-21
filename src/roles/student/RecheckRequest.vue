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
      <table class="table table-bordered table-striped align-middle text-center table-hover">
        <thead class="table-light border">
          <tr>
            <th class="text-start">Course</th>
            <th>Assessment</th>
            <th class="text-start">Message</th>
            <th>Status</th>
            <th>Requested At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="req in requests" :key="req.id">
            <td class="text-start">
              <strong>{{ req.course_code }}</strong><br>
              <span class="text-muted">{{ req.course_name }}</span>
            </td>
            <td>
              {{ req.assessment_title }}<br>
              <small class="text-muted">({{ req.assessment_type }})</small>
            </td>
            <td class="text-start">{{ req.message }}</td>
            <td>
              <span
                class="badge text-dark rounded-pill px-3 py-2"
                :class="{
                  'bg-warning text-dark': req.status === 'Pending',
                  'bg-success text-dark': req.status === 'Approved',
                  'bg-danger text-dark': req.status === 'Rejected'
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
      fetch(`${process.env.VUE_APP_API_URL}/api/student/assessments`, {
          credentials: "include",
        }) // must create this if not available
        .then((res) => res.json())
        .then((data) => {
          this.assessments = data;
        });
    },
    fetchRequests() {
      fetch(`${process.env.VUE_APP_API_URL}/api/student/remark-requests`, {
          credentials: "include",
        })
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

      fetch(`${process.env.VUE_APP_API_URL}/api/student/remark-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.newRequest),
        credentials: "include",
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

