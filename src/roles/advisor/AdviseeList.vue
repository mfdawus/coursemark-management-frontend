<template>
  <div class="advisee-list-container">
    <h2 class="title">Your Advisees</h2>

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
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(student, index) in filteredStudents"
          :key="student.id"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ student.name }}</td>
          <td>{{ student.studentId }}</td>
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
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const selectedProgram = ref('');
const selectedStatus = ref('');

const students = ref([
  { id: 1, name: 'Aliya Zainal', studentId: '20221001', program: 'Software Engineering', cgpa: 3.75 },
  { id: 2, name: 'John Lee', studentId: '20221002', program: 'Cybersecurity', cgpa: 2.4 },
  { id: 3, name: 'Maria Tan', studentId: '20221003', program: 'AI & Robotics', cgpa: 1.95 },
  { id: 4, name: 'Harith Ahmad', studentId: '20221004', program: 'Data Science', cgpa: 3.2 },
  { id: 5, name: 'Nur Iman', studentId: '20221005', program: 'Multimedia', cgpa: 2.8 },
  { id: 6, name: 'Jason Ng', studentId: '20221006', program: 'Game Development', cgpa: 3.9 },
  { id: 7, name: 'Fatimah Bakar', studentId: '20221007', program: 'Network Engineering', cgpa: 2.1 },
  { id: 8, name: 'Danish Aiman', studentId: '20221008', program: 'Software Engineering', cgpa: 1.6 },
]);

const uniquePrograms = computed(() => {
  const programs = students.value.map(s => s.program);
  return [...new Set(programs)];
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
      student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.studentId.includes(searchQuery.value) ||
      student.program.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesProgram = selectedProgram.value === '' || student.program === selectedProgram.value;

    const status = getStatusLabel(student.cgpa).toLowerCase().replace(' ', '');
    const matchesStatus =
      selectedStatus.value === '' || status.includes(selectedStatus.value);

    return matchesSearch && matchesProgram && matchesStatus;
  });
});
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
</style>
