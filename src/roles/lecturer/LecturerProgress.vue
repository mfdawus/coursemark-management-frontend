<template>
  <div>
    <h2>Total Registered Students</h2>
    <div style="max-width: 800px; height: 400px">
      <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

export default {
  name: "LecturerProgress",
  components: { Bar },
  data() {
    return {
      chartData: null,
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "List of Registered Students",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0, // Force integer scale
            },
          },
        },
      },
    };
  },
  async mounted() {
    try {
      const response = await fetch("/api/lecturer/analytics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (!result.success) {
        console.error(result.message);
        return;
      }

      const labels = result.students.map((student) => student.name);
      const values = result.students.map(() => 1); // 1 bar per student

      this.chartData = {
        labels,
        datasets: [
          {
            label: "Registered Students",
            data: values,
            backgroundColor: "#4e73df",
          },
        ],
      };
    } catch (error) {
      console.error("Fetch error:", error);
    }
  },
};
</script>
