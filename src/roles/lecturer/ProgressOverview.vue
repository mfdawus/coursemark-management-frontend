<template>
  <div class="container-fluid py-4">

    <!-- Summary Cards -->
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card shadow-sm border-0">
          <div class="card-body text-center">
            <h6 class="text-uppercase text-muted mb-2">Total Students</h6>
            <h4 class="text-dark font-weight-bold">{{ totalStudents }}</h4>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm border-0">
          <div class="card-body text-center">
            <h6 class="text-uppercase text-muted mb-2">Avg Weight Completed</h6>
            <h4 class="text-dark font-weight-bold">{{ avgWeight.toFixed(1) }}%</h4>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm border-0">
          <div class="card-body text-center">
            <h6 class="text-uppercase text-muted mb-2">Total Remarks</h6>
            <h4 class="text-dark font-weight-bold">{{ totalRemarks }}</h4>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Table -->
    <div class="card shadow-sm">
      <div class="card-body table-responsive">
        <h5 class="mb-3">Student Progress Overview</h5>
        <table class="table align-items-center table-flush table-hover">
          <thead class="thead-light">
            <tr>
              <th>Student</th>
              <th>Matric</th>
              <th>Course</th>
              <th># Assessments</th>
              <th># Marks</th>
              <th>Total Marks</th>
              <th>Final Exam</th>
              <th>GPA</th>
              <th># Remarks</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in progressData"
              :key="row.student_id + '-' + row.course_id"
            >
              <td>{{ row.student_name }}</td>
              <td>{{ row.matric_number }}</td>
              <td>{{ row.course_name }}</td>
              <td>{{ row.assessment_count }}</td>
              <td>{{ row.marks_count }}</td>
              <td>{{ row.total_marks }}</td>
              <td>{{ row.final_mark ?? '-' }}</td>
              <td>
                <span v-if="row.gpa !== null && row.gpa !== undefined">
                  {{ Number(row.gpa).toFixed(2) }}
                </span>
                <span v-else class="text-muted">-</span>
              </td>
              <td>{{ row.remark_count }}</td>
              <td style="min-width: 120px;">
                <div class="progress" style="height: 8px;">
                  <div
                    class="progress-bar bg-info"
                    :style="{ width: row.total_weight_completed + '%' }"
                    role="progressbar"
                  ></div>
                </div>
                <small class="text-muted">{{ row.total_weight_completed }}%</small>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="!progressData.length" class="text-center text-muted py-4">
          No student progress data available.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const progressData = ref([]);

const totalStudents = computed(() => progressData.value.length);
const avgWeight = computed(() => {
  if (progressData.value.length === 0) return 0;
  const total = progressData.value.reduce(
    (sum, r) => sum + (parseFloat(r.total_weight_completed) || 0),
    0,
  );
  return total / progressData.value.length;
});
const totalRemarks = computed(() => {
  return progressData.value.reduce(
    (sum, r) => sum + (parseInt(r.remark_count) || 0),
    0,
  );
});

onMounted(async () => {
  const res = await axios.get(`${process.env.VUE_APP_API_URL}/api/lecturer/progress`, {
  withCredentials: true,
});
  progressData.value = res.data;
});
</script>
<style>
.progress-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
  border-radius: 12px;
  overflow: hidden;
}

.progress-table th,
.progress-table td {
  border: 1px solid #ddd;
  padding: 10px 12px;
  text-align: left;
}

.progress-table th {
  background-color: #f8f8f8;
  font-weight: 600;
  color: #444;
}

.progress-table tr {
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.progress-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.progress-table tr:hover {
  background-color: #e2e8f0;
  transform: scale(1.02);
}

.progress-bar-container {
  background-color: #e2e8f0;
  border-radius: 8px;
  height: 8px;
  width: 100%;
}

.progress-bar {
  background-color: #4299e1; /* blue bar */
  height: 8px;
  border-radius: 8px;
  transition: width 0.4s ease;
}
</style>
