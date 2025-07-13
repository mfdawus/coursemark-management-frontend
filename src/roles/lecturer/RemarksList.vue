<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-xl-10 col-lg-11">

        <!-- Title -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="text-white mb-0">Students & Final Marks</h4>
        </div>

        <!-- Data Table -->
        <div class="card shadow-sm">
          <div class="card-body p-2">
            <div class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead class="thead-light bg-light">
                  <tr>
                    <th class="text-uppercase text-secondary text-xs font-weight-bold">Student Name</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bold">Matric Number</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bold">Course Code</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bold">Course Name</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bold">Final Mark</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bold">GPA</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in students" :key="`${row.student_id}-${row.course_id}`">
                    <td>{{ row.student_name }}</td>
                    <td>{{ row.matric_number }}</td>
                    <td>{{ row.course_code }}</td>
                    <td>{{ row.course_name }}</td>
                    <td>
                      <span v-if="row.final_mark !== null">{{ row.final_mark }}</span>
                      <span v-else class="text-muted fst-italic">Not entered</span>
                    </td>
                    <td>
                      <span v-if="row.gpa !== null && row.gpa !== undefined">
                        {{ Number(row.gpa).toFixed(2) }}
                      </span>
                      <span v-else class="text-muted fst-italic">-</span>
                    </td>
                    <td class="text-center">
                      <router-link
                        :to="`/lecturer/remarks/${row.course_id}/${row.student_id}`"
                        class="btn btn-sm btn-primary"
                      >
                        Add/Edit Remark
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- No data -->
        <div v-if="!students.length" class="text-center text-muted mt-4">
          No data found.
        </div>
        
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";

const students = ref([]);

onMounted(async () => {
  const res = await fetch("/api/lecturer/students-remarks");
  const data = await res.json();
  console.log("Loaded data:", data);
  students.value = data;
});
</script>
