<template>
  <div class="container-fluid py-4">
    <!-- Title -->
    <div class="d-flex justify-between align-items-center mb-3">
      <h5 class="text-white mb-0">Final Exam Marks (30%)</h5>
    </div>

    <!-- Table Card -->
    <div class="card shadow-sm">
      <div class="card-header pb-0">
      <div class="mb-3 clearfix">
        <h5 class="float-start mb-0">Student Final Marks</h5>
        <button class="btn btn-sm btn-success float-end" @click="exportExcel">
          Export Excel
        </button>
      </div>
      </div>
      <div class="card-body px-0 pt-0 pb-2">
        <div class="table-responsive p-0">
          <table class="table align-items-center mb-0">
            <thead class="bg-light">
              <tr>
                <th class="text-uppercase text-xs font-weight-bolder">Student</th>
                <th class="text-uppercase text-xs font-weight-bolder">Matric</th>
                <th class="text-uppercase text-xs font-weight-bolder">Course</th>
                <th class="text-uppercase text-xs font-weight-bolder">Final Mark</th>
                <th class="text-uppercase text-xs font-weight-bolder">GPA</th>
                <th class="text-uppercase text-xs font-weight-bolder text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in students" :key="entry.student_id + '-' + entry.course_id">
                <td class="px-3 py-2">{{ entry.name }}</td>
                <td class="px-3 py-2">{{ entry.matric_number }}</td>
                <td class="px-3 py-2">
                  {{ entry.course_code }} - {{ entry.course_name }}
                </td>
                <td class="px-3 py-2">
                  {{ entry.final_mark ?? '-' }}
                </td>
                <td class="px-3 py-2">
                  {{
                    entry.gpa !== null && entry.gpa !== undefined
                      ? Number(entry.gpa).toFixed(2)
                      : '-'
                  }}
                </td>
                <td class="px-3 py-2 text-center">
                  <button
                    class="btn btn-sm btn-primary"
                    @click="goToEntry(entry.course_id, entry.student_id)"
                  >
                    ➡ Enter Mark
                  </button>
                </td>
              </tr>
              <tr v-if="students.length === 0">
                <td colspan="6" class="text-center text-muted py-3">
                  No records available.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const students = ref([]);
const router = useRouter();

async function fetchStudents() {
  const res = await fetch("/api/lecturer/final-exams");
  students.value = await res.json();
}

function goToEntry(courseId, studentId) {
  router.push({
    path: `/lecturer/final-exams/${courseId}/${studentId}`,
  });
}

function exportExcel() {
  const ws_data = [
    ["#", "Student Name", "Matric Number", "Course", "Final Mark", "GPA"],
    ...students.value.map((item, index) => [
      index + 1,
      item.name,
      item.matric_number,
      item.course_name,
      item.final_mark ?? "-",
      item.gpa !== null && item.gpa !== undefined
        ? Number(item.gpa).toFixed(2)
        : "-",
    ]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Final Exams");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([wbout], { type: "application/octet-stream" }),
    "final_exam_list.xlsx",
  );
}

onMounted(() => {
  fetchStudents();
});
</script>
