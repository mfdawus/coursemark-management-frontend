<template>
  <div class="px-4 py-4">
    <!-- Title -->
    <div class="mb-4">
      <h2 class="fw-bold text-white">What-If Simulator</h2>
      <p class="text-white">Adjust your marks to simulate final outcomes</p>
    </div>

    <!-- Loading State -->
    <div v-if="simAssessments.length === 0" class="alert alert-white text-center">
      Loading assessment data...
    </div>

    <!-- Simulation Form -->
    <form v-else @submit.prevent="simulate">
      <div class="card shadow-sm border-0 rounded-3 mb-4">
        <div class="card-body table-responsive">
          <h5 class="text-muted text-uppercase mb-3">Editable Assessments</h5>
          <table class="table table-bordered align-middle text-sm">
            <thead class="table-light">
              <tr>
                <th>Assessment</th>
                <th>Max Mark</th>
                <th>Your Mark</th>
                <th>Weight (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(a, index) in simAssessments" :key="index">
                <td>{{ a.title }}</td>
                <td>{{ a.max_mark }}</td>
                <td>
                  <input
                    v-model.number="a.mark_obtained"
                    type="number"
                    :max="a.max_mark"
                    min="0"
                    step="0.01"
                    class="form-control form-control-sm"
                    placeholder="Your Mark"
                  />
                </td>
                <td>
                  <input
                    v-model.number="a.weight"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    class="form-control form-control-sm"
                    placeholder="Weight %"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div class="text-end">
            <button type="submit" class="btn btn-primary btn-sm mt-2">
              🎯 Simulate
            </button>
          </div>
        </div>
      </div>
    </form>

    <!-- Simulation Result -->
    <div v-if="simResult" class="card shadow-sm border-0 rounded-3">
      <div class="card-body">
        <h5 class="text-success mb-3">
          📊 Simulated Total: {{ simResult.total.toFixed(2) }}%
        </h5>
        <table class="table table-hover align-middle text-sm">
          <thead class="table-light">
            <tr>
              <th>Title</th>
              <th>Mark</th>
              <th>Weight (%)</th>
              <th>Weighted</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s, i) in simResult.simulated" :key="i">
              <td>{{ s.title }}</td>
              <td>{{ s.mark_obtained }} / {{ s.max_mark }}</td>
              <td>{{ s.weight }}</td>
              <td>{{ Number(s.weighted_mark).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      simAssessments: [],
      simResult: null,
    };
  },
  mounted() {
    this.fetchAssessments();
  },
  methods: {
    fetchAssessments() {
      fetch("/api/student/mymarks")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            this.simAssessments = [];

            data.forEach((course) => {
              (course.assessments || []).forEach((a) => {
                if (
                  a.mark_obtained !== null &&
                  a.max_mark > 0 &&
                  a.weight !== null
                ) {
                  this.simAssessments.push({
                    title: a.title,
                    max_mark: Number(a.max_mark),
                    mark_obtained: Number(a.mark_obtained),
                    weight: Number(a.weight),
                  });
                }
              });
            });
          }
        })
        .catch((err) => {
          alert("Failed to load assessment data.");
          console.error(err);
        });
    },
    simulate() {
      fetch("/api/student/whatif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessments: this.simAssessments }),
      })
        .then((res) => res.json())
        .then((data) => {
          this.simResult = data;
        })
        .catch((err) => {
          alert("Simulation failed.");
          console.error(err);
        });
    },
  },
};
</script>

<style scoped>
.what-if-simulator {
  padding: 1.5rem;
}

.sim-table,
.result-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.sim-table th,
.sim-table td,
.result-table th,
.result-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

.simulate-btn {
  margin-top: 1rem;
  padding: 8px 16px;
  font-weight: bold;
  background-color: #4caf50;
  color: #fff;
  border: none;
  cursor: pointer;
}

.simulate-btn:hover {
  background-color: #45a049;
}
</style>
