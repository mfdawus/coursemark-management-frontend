<template>
  <div class="container-fluid py-4">

    <!-- SUMMARY CARDS -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h6 class="text-muted text-uppercase">Total Students</h6>
            <h3>{{ summary.total_students }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h6 class="text-muted text-uppercase">Avg Completion</h6>
            <h3>{{ summary.avg_completion }}%</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h6 class="text-muted text-uppercase">Avg Final Mark</h6>
            <h3>{{ summary.avg_final_mark }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h6 class="text-muted text-uppercase">Avg GPA</h6>
            <h3>{{ summary.avg_gpa }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- STACKED CHARTS -->
    <div class="row mb-4">
      <div class="col-12 mb-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="mb-3">Avg Completion by Course</h5>
            <div style="height: 250px;">
              <BarChart :chart-data="barChartData" :options="chartOptions" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 mb-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="mb-3">Avg Final Marks by Course</h5>
              <div style="height: 250px;">
                <LineChart :chart-data="lineChartData" :options="chartOptions" />
              </div>
          </div>
        </div>
      </div>

      <div class="col-12 mb-2">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="mb-3">Avg GPA by Course</h5>
              <div style="height: 250px;">
                <BarChart :chart-data="gpaChartData" :options="chartOptions" />
              </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TOP STUDENTS TABLE -->
    <div class="card shadow-sm mb-5">
      <div class="card-body table-responsive">
        <h4 class="mb-4">🏆 Top Students by Completion</h4>
        <table class="table align-items-center table-hover">
          <thead class="thead-light">
            <tr>
              <th>Student</th>
              <th>Matric</th>
              <th>Assessment</th>
              <th>Final</th>
              <th>Total</th>
              <th>GPA</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in topStudents"
              :key="student.matric_number"
            >
              <td>{{ student.student_name }}</td>
              <td>{{ student.matric_number }}</td>
              <td>{{ student.assessment_weight.toFixed(1) }}%</td>
              <td>{{ student.final_weight.toFixed(1) }}%</td>
              <td><strong>{{ student.total_completion.toFixed(1) }}%</strong></td>
              <td>{{ student.gpa?.toFixed(2) ?? '-' }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="!topStudents.length" class="text-center text-muted py-3">
          No student data available.
        </div>
      </div>
    </div>

    <!-- PIE CHARTS CENTERED AT BOTTOM -->
    <div class="row justify-content-center">
      <div class="col-md-5 mb-4">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <h5 class="mb-3">Students by Course</h5>
            <PieChart :chart-data="pieChartData" />
          </div>
        </div>
      </div>
      <div class="col-md-5 mb-4">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <h5 class="mb-3">Completion Brackets</h5>
            <DoughnutChart :chart-data="doughnutChartData" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import PieChart from "@/components/charts/PieChart.vue";
import BarChart from "@/components/charts/BarChart.vue";
import LineChart from "@/components/charts/LineChart.vue";
import DoughnutChart from "@/components/charts/DoughnutChart.vue";

const summary = ref({
  total_students: 0,
  total_assessments: 0,
  total_remarks: 0,
  avg_completion: 0,
  avg_final_mark: 0,
  avg_gpa: 0,
});

const pieChartData = ref({
  labels: [],
  datasets: [
    {
      label: "Students",
      data: [],
      backgroundColor: [],
    },
  ],
});

const barChartData = ref({
  labels: [],
  datasets: [
    {
      label: "Avg Completion %",
      data: [],
      backgroundColor: "",
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // allows custom sizing
};

const lineChartData = ref({
  labels: [],
  datasets: [
    {
      label: "Avg Final Marks",
      data: [],
      borderColor: "",
      backgroundColor: "",
      fill: true,
    },
  ],
});

const doughnutChartData = ref({
  labels: [],
  datasets: [
    {
      label: "Completion",
      data: [],
      backgroundColor: [],
    },
  ],
});

const gpaChartData = ref({
  labels: [],
  datasets: [
    {
      label: "Avg GPA",
      data: [],
      backgroundColor: "",
    },
  ],
});

const topStudents = ref([]);

onMounted(async () => {
  const res = await fetch("/api/lecturer/analyticss");
  const data = await res.json();

  summary.value = data.summary;
  topStudents.value = data.topStudents ?? [];

  pieChartData.value = {
    labels: (data.pieData ?? []).map((d) => d.course_name),
    datasets: [
      {
        label: "Students",
        data: (data.pieData ?? []).map((d) => d.student_count),
        backgroundColor: [
          "#3b82f6",
          "#60a5fa",
          "#93c5fd",
          "#bfdbfe",
          "#dbeafe",
        ],
      },
    ],
  };

  barChartData.value = {
    labels: (data.barData ?? []).map((d) => d.course_name),
    datasets: [
      {
        label: "Avg Completion %",
        data: (data.barData ?? []).map((d) =>
          parseFloat(d.avg_completion).toFixed(1),
        ),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  lineChartData.value = {
    labels: (data.lineData ?? []).map((d) => d.course_name),
    datasets: [
      {
        label: "Avg Final Marks",
        data: (data.lineData ?? []).map((d) =>
          parseFloat(d.avg_final_mark).toFixed(1),
        ),
        borderColor: "#3b82f6",
        backgroundColor: "#93c5fd",
        fill: true,
      },
    ],
  };

  doughnutChartData.value = {
    labels: Object.keys(data.doughnutData ?? {}),
    datasets: [
      {
        label: "Completion",
        data: Object.values(data.doughnutData ?? {}),
        backgroundColor: ["#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa"],
      },
    ],
  };

  gpaChartData.value = {
    labels: (data.gpaData ?? []).map((d) => d.course_name),
    datasets: [
      {
        label: "Avg GPA",
        data: (data.gpaData ?? []).map((d) => parseFloat(d.avg_gpa).toFixed(2)),
        backgroundColor: "#f97316",
      },
    ],
  };
});
</script>
