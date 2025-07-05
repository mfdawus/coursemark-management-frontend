<template>
  <div class="what-if-simulator">
    <h2>⚖️ What-If Simulator</h2>

    <div v-if="simAssessments.length === 0">
      <p>Loading assessment data...</p>
    </div>

    <form v-else @submit.prevent="simulate">
      <table class="sim-table">
        <thead>
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
                type="number"
                v-model.number="a.mark_obtained"
                :max="a.max_mark"
                min="0"
                step="0.01"
              />
            </td>
            <td>
              <input
                type="number"
                v-model.number="a.weight"
                min="0"
                max="100"
                step="0.01"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <button type="submit" class="simulate-btn">Simulate</button>
    </form>

    <div v-if="simResult">
      <h3>📊 Simulated Total: {{ simResult.total.toFixed(2) }}%</h3>
      <table class="result-table">
        <thead>
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
            <td>{{ s.weighted_mark }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      simAssessments: [],
      simResult: null
    };
  },
  methods: {
    fetchAssessments() {
      fetch('/api/student/mymarks')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            this.simAssessments = [];

            data.forEach(course => {
              (course.assessments || []).forEach(a => {
                if (a.mark_obtained !== null && a.max_mark > 0 && a.weight !== null) {
                  this.simAssessments.push({
                    title: a.title,
                    max_mark: Number(a.max_mark),
                    mark_obtained: Number(a.mark_obtained),
                    weight: Number(a.weight)
                  });
                }
              });
            });
          }
        })
        .catch(err => {
          alert('Failed to load assessment data.');
          console.error(err);
        });
    },
    simulate() {
      fetch('/api/student/whatif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessments: this.simAssessments })
      })
        .then(res => res.json())
        .then(data => {
          this.simResult = data;
        })
        .catch(err => {
          alert('Simulation failed.');
          console.error(err);
        });
    }
  },
  mounted() {
    this.fetchAssessments();
  }
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
