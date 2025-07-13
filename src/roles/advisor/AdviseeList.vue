<template>
  <div class="container-fluid py-4">
    <div class="card mb-4">
      <div class="card-header pb-0">
        <div class="d-flex justify-content-between align-items-center">
          <h6>Your Advisees</h6>
          <button class="btn btn-outline-success btn-sm" @click="exportCSV">
            Export CSV
          </button>
        </div>
      </div>
      <div class="card-body px-0 pt-0 pb-2">
        <div class="px-3 py-3">
          <div class="row g-2 mb-3">
            <div class="col-md-4">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, ID, or program..."
                class="form-control"
              />
            </div>
            <div class="col-md-4">
              <select v-model="selectedProgram" class="form-select">
                <option value="">All Programs</option>
                <option
                  v-for="program in uniquePrograms"
                  :key="program"
                  :value="program"
                >
                  {{ program }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <select v-model="selectedStatus" class="form-select">
                <option value="">All Status</option>
                <option value="good">Good Standing</option>
                <option value="warning">Warning</option>
                <option value="probation">Probation</option>
              </select>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table align-items-center mb-0">
              <thead class="bg-light">
                <tr>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">
                    #
                  </th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">
                    Name
                  </th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">
                    ID
                  </th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">
                    Program
                  </th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">
                    CGPA
                  </th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">
                    Status
                  </th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(student, index) in filteredStudents"
                  :key="student.student_id"
                >
                  <td class="text-xs">{{ index + 1 }}</td>
                  <td class="text-xs">{{ student.student_name }}</td>
                  <td class="text-xs">{{ student.student_id }}</td>
                  <td class="text-xs">{{ student.program }}</td>
                  <td class="text-xs">{{ student.cgpa }}</td>
                  <td>
                    <span class="badge bg-gradient-success text-white" v-if="student.cgpa >= 3.0">
                      Good
                    </span>
                    <span class="badge bg-gradient-warning text-dark" v-else-if="student.cgpa >= 2.0">
                      Warning
                    </span>
                    <span class="badge bg-gradient-danger text-white" v-else>
                      Probation
                    </span>
                  </td>
                  <td class="text-center">
                    <button
                      class="btn btn-sm btn-info"
                      @click="openNotes(student)"
                    >
                      Notes
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <advisee-notes-modal
      :visible="showNotesModal"
      :student="selectedStudent"
      :initial-notes="studentNotes[selectedStudent?.student_id] || []"
      @close="showNotesModal = false"
      @update:notes="updateNotes"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import AdviseeNotesModal from "./AdviseeNotesModal.vue";

const searchQuery = ref("");
const selectedProgram = ref("");
const selectedStatus = ref("");

const students = ref([]);
const showNotesModal = ref(false);
const selectedStudent = ref(null);
const studentNotes = ref({}); // { [student_id]: [notes] }

onMounted(async () => {
  try {
    const response = await fetch("/api/advisor/adviseelist");
    if (!response.ok) throw new Error("Failed to fetch advisees");
    students.value = await response.json();
  } catch (err) {
    console.error(err);
    // Optionally show an error message
  }
});

const uniquePrograms = computed(() => {
  const programs = students.value.map((s) => s.program || "");
  return [...new Set(programs)].filter(Boolean);
});

const getStatusLabel = (cgpa) => {
  if (cgpa >= 3.0) return "Good Standing";
  if (cgpa >= 2.0) return "Warning";
  return "Probation";
};

/* const getBadgeClass = (cgpa) => {
  if (cgpa >= 3.0) return "bg-success";
  if (cgpa >= 2.0) return "bg-warning";
  return "bg-danger";
}; */

const filteredStudents = computed(() => {
  return students.value.filter((student) => {
    const matchesSearch =
      (student.student_name || "")
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      (student.student_id || "").includes(searchQuery.value) ||
      (student.program || "")
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());

    const matchesProgram =
      selectedProgram.value === "" || student.program === selectedProgram.value;

    const status = getStatusLabel(student.cgpa).toLowerCase().replace(" ", "");
    const matchesStatus =
      selectedStatus.value === "" || status.includes(selectedStatus.value);

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
  const rows = filteredStudents.value.map((student) => {
    const notes = (studentNotes.value[student.student_id] || [])
      .map((n) => n.text)
      .join(" | ");
    return [
      student.student_name,
      student.student_id,
      student.program,
      student.cgpa,
      getStatusLabel(student.cgpa),
      notes,
    ];
  });
  const header = [
    "Student Name",
    "Student ID",
    "Program",
    "CGPA",
    "Status",
    "Notes",
  ];
  const csvContent = [header, ...rows]
    .map((e) => e.map((x) => '"' + (x ?? "") + '"').join(","))
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "advisee_report.csv";
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
