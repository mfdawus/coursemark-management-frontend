<template>
  <div>
    <h2>📊 Student Progress Overview</h2>
    <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'LecturerProgress',
  components: { Bar },
  data() {
    return {
      chartData: null,
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Average Marks per Student'
          }
        }
      }
    }
  },
  mounted() {
    // Fake data for demonstration
    const labels = ['Ali', 'Siti', 'John', 'Aisyah', 'Ravi']
    const scores = [75, 88, 67, 90, 82]

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Total Marks (%)',
          data: scores,
          backgroundColor: '#4e73df'
        }
      ]
    }
  }
}
</script>
