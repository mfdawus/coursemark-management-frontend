<template>
  <div class="advisee-list-container">
    <h2 class="title"><span>👥</span> Your Advisees</h2>
    <!-- Export Button -->
    <div class="mb-3 d-flex justify-content-end">
      <button class="btn btn-outline-success" @click="exportCSV">Export CSV</button>
    </div>
    <!-- Search + Filters -->
    <div class="filters d-flex flex-wrap gap-3 mb-3">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by name, ID, or program..."
        class="form-control"
        style="max-width: 300px"
      />

      <select class="form-select" v-model="selectedProgram" style="max-width: 200px">
        <option value="">All Programs</option>
        <option v-for="program in uniquePrograms" :key="program" :value="program">
          {{ program }}
        </option>
      </select>

      <select class="form-select" v-model="selectedStatus" style="max-width: 200px">
        <option value="">All Status</option>
        <option value="good">Good Standing</option>
        <option value="warning">Warning</option>
        <option value="probation">Probation</option>
      </select>
    </div>

    <!-- Student Table -->
    <table class="table table-hover">
      <thead class="table-dark">
        <tr>
          <th>#</th>
          <th>Student Name</th>
          <th>Student ID</th>
          <th>Program</th>
          <th>CGPA</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(student, index) in filteredStudents"
          :key="student.student_id"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ student.student_name }}</td>
          <td>{{ student.student_id }}</td>
          <td>{{ student.program }}</td>
          <td>{{ student.cgpa }}</td>
          <td>
            <span
              class="badge"
              :class="getBadgeClass(student.cgpa)"
            >
              {{ getStatusLabel(student.cgpa) }}
            </span>
          </td>
          <td>
            <button class="btn btn-sm btn-info me-2" @click="openNotes(student)">Notes</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Notes Modal -->
    <AdviseeNotesModal
      :visible="showNotesModal"
      :student="selectedStudent"
      :initialNotes="studentNotes[selectedStudent?.student_id] || []"
      @close="showNotesModal = false"
      @update:notes="updateNotes"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AdviseeNotesModal from './AdviseeNotesModal.vue';

const searchQuery = ref('');
const selectedProgram = ref('');
const selectedStatus = ref('');

const students = ref([]);
const showNotesModal = ref(false);
const selectedStudent = ref(null);
const studentNotes = ref({}); // { [student_id]: [notes] }

onMounted(async () => {
  try {
    const response = await fetch('/api/advisor/adviseelist');
    if (!response.ok) throw new Error('Failed to fetch advisees');
    students.value = await response.json();
  } catch (err) {
    console.error(err);
    // Optionally show an error message
  }
});

const uniquePrograms = computed(() => {
  const programs = students.value.map(s => s.program || '');
  return [...new Set(programs)].filter(Boolean);
});

const getStatusLabel = (cgpa) => {
  if (cgpa >= 3.0) return 'Good Standing';
  if (cgpa >= 2.0) return 'Warning';
  return 'Probation';
};

const getBadgeClass = (cgpa) => {
  if (cgpa >= 3.0) return 'bg-success';
  if (cgpa >= 2.0) return 'bg-warning';
  return 'bg-danger';
};

const filteredStudents = computed(() => {
  return students.value.filter(student => {
    const matchesSearch =
      (student.student_name || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (student.student_id || '').includes(searchQuery.value) ||
      (student.program || '').toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesProgram = selectedProgram.value === '' || student.program === selectedProgram.value;

    const status = getStatusLabel(student.cgpa).toLowerCase().replace(' ', '');
    const matchesStatus =
      selectedStatus.value === '' || status.includes(selectedStatus.value);

    return matchesSearch && matchesProgram && matchesStatus;
  });
});

function openNotes(student) {
  selectedStudent.value = student;
  showNotesModal.value = true;
}
function updateNotes(notes) {
  if (selectedStudent.value) {
    studentNotes.value[selectedStudent.value.student_id] = notes;
  }
}

function exportCSV() {
  const rows = filteredStudents.value.map(student => {
    const notes = (studentNotes.value[student.student_id] || []).map(n => n.text).join(' | ');
    return [
      student.student_name,
      student.student_id,
      student.program,
      student.cgpa,
      getStatusLabel(student.cgpa),
      notes
    ];
  });
  const header = ['Student Name', 'Student ID', 'Program', 'CGPA', 'Status', 'Notes'];
  const csvContent = [header, ...rows]
    .map(e => e.map(x => '"' + (x ?? '') + '"').join(','))
    .join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'advisee_report.csv';
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.advisee-list-container {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.title span {
  margin-right: 0.5em;
  font-size: 1.2em;
  vertical-align: middle;
}
</style>
