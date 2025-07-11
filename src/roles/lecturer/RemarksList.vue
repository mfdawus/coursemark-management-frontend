<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Students & Final Marks</h2>

    <table class="min-w-full border-collapse border">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">Student Name</th>
          <th class="p-2 border">Matric Number</th>
          <th class="p-2 border">Course Code</th>
          <th class="p-2 border">Course Name</th>
          <th class="p-2 border">Final Mark</th>
          <th class="p-2 border">GPA</th>
          <th class="p-2 border">Action</th>
        </tr>
      </thead>
      <tbody>
  <tr v-for="row in students" :key="`${row.student_id}-${row.course_id}`">
    <td class="p-2 border">{{ row.student_name }}</td>
    <td class="p-2 border">{{ row.matric_number }}</td>
    <td class="p-2 border">{{ row.course_code }}</td>
    <td class="p-2 border">{{ row.course_name }}</td>
    <td class="p-2 border">
      <span v-if="row.final_mark !== null">{{ row.final_mark }}</span>
      <span v-else class="text-gray-400 italic">Not entered</span>
    </td>
    <td class="p-2 border">
      <span v-if="row.gpa !== null && row.gpa !== undefined">{{ Number(row.gpa).toFixed(2) }}</span>
      <span v-else class="text-gray-400 italic">-</span>
    </td>
    <td class="p-2 border">
      <router-link 
        :to="`/lecturer/remarks/${row.course_id}/${row.student_id}`"
        class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        ✍️ Add/Edit Remark
      </router-link>
    </td>
  </tr>
</tbody>

    </table>

    <div v-if="!students.length" class="mt-6 text-center text-gray-500">
      No data found.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const students = ref([])

onMounted(async () => {
  const res = await fetch('/api/lecturer/students-remarks')
  const data = await res.json()
  console.log('Loaded data:', data)
  students.value = data
})

</script>
