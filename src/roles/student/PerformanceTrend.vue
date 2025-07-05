<template>
  <div class="performance-trends">
    <h2>📈 Performance Trend</h2>

    <div v-if="chartData.labels.length === 0">
      <p>No data yet or loading...</p>
    </div>

    <canvas v-else ref="trendChart" width="100%" height="45"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  data() {
    return {
      trendChartInstance: null,
      chartData: {
        labels: [],
        datasets: []
      }
    };
  },
  methods: {
    fetchTrendData() {
      fetch('/api/student/performance-trend')
        .then(res => res.json())
        .then(data => {
          if (!data || data.length === 0) return;

          // Sort by date (just in case)
          data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

          this.chartData.labels = data.map(d =>
            `${d.course_code}: ${d.assessment_title}`
          );

          this.chartData.datasets = [
            {
              label: 'Score %',
              data: data.map(d => d.score_percent),
              fill: false,
              borderColor: '#42a5f5',
              backgroundColor: '#42a5f5',
              tension: 0.2,
              pointRadius: 4
            }
          ];

          this.$nextTick(() => this.renderChart());
        })
        .catch(err => {
          alert('Failed to load trend data.');
          console.error(err);
        });
    },
    renderChart() {
      if (this.trendChartInstance) {
        this.trendChartInstance.destroy();
      }

      const ctx = this.$refs.trendChart.getContext('2d');
      this.trendChartInstance = new Chart(ctx, {
        type: 'line',
        data: this.chartData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Score (%)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Assessment'
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => ` ${context.parsed.y.toFixed(2)}%`
              }
            }
          }
        }
      });
    }
  },
  mounted() {
    this.fetchTrendData();
  }
};
</script>

<style scoped>
.performance-trends {
  padding: 1.5rem;
  background: #fff;
}

canvas {
  margin-top: 1rem;
  max-width: 100%;
}
</style>