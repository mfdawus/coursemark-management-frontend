<template>
  <div class="px-4 py-2">
    <!-- Title and Export Buttons -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-3xl font-bold text-white flex items-center gap-2">
        Progress Overview
      </h2>

    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-3 mb-4 flex flex-wrap gap-3 text-sm items-center">
      <label>
        Course:
        <select v-model="filterCourse" class="form-select form-select-sm">
          <option value="">All</option>
          <option v-for="course in courseOptions" :key="course" :value="course">
            {{ course }}
          </option>
        </select>
      </label>
      <label>
        Student:
        <input
          v-model="filterStudent"
          class="form-control form-control-sm"
          placeholder="Search student..."
        />
      </label>
      <label>
        Status:
        <select v-model="filterStatus" class="form-select form-select-sm">
          <option value="">All</option>
          <option value="Good Standing">Good Standing</option>
          <option value="Warning">Warning</option>
          <option value="Probation">Probation</option>
        </select>
      </label>
      <label>
        Semester:
        <select v-model="filterSemester" class="form-select form-select-sm">
          <option value="">All</option>
          <option v-for="sem in semesterOptions" :key="sem" :value="sem">
            {{ sem }}
          </option>
        </select>
      </label>
      <label>
        Year:
        <select v-model="filterYear" class="form-select form-select-sm">
          <option value="">All</option>
          <option v-for="year in yearOptions" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </label>


      <argon-button color="primary" size="sm" @click="printTableReport"  class= "ms-2 mt-2 float-end">
        <template #icon>
          <i class="ni ni-print text-white float-end"></i>
        </template>
        Print
      </argon-button>

      <argon-button color="success" size="sm" @click="exportCSV" class= "ms-2 mt-2 float-end"> 
        <template #icon>
          <i class="ni ni-archive-2 text-white"></i>
        </template>
        Export CSV
      </argon-button>

      <argon-button color="secondary" size="sm" @click="resetFilters"  class= "ms-2 mt-2 float-end">
        Reset
      </argon-button>

    </div>

    <!-- Mark Breakdown Table -->
    <div ref="markBreakdown" class="bg-white rounded-lg shadow-sm p-3 mb-4 overflow-auto">
      <h4 class="text-base font-semibold text-slate-700 mb-3">Full Mark Breakdown</h4>
      <table class="table w-full text-sm border text-slate-700">
        <thead class="bg-slate-100">
          <tr>
            <th>Student Name</th>
            <th>ID</th>
            <th>Course</th>
            <th>Assignment</th>
            <th>Quiz</th>
            <th>Lab</th>
            <th>Exercise</th>
            <th>Test</th>
            <th>Final</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="student in filteredStudents"
            :key="student.student_id + '-' + student.course_name"
            class="hover:bg-slate-50 border-t"
          >
            <td>{{ student.student_name }}</td>
            <td>{{ student.student_id }}</td>
            <td>{{ student.course_name }}</td>
            <td class="text-center">{{ formatComponent(student.assignment) }}</td>
            <td class="text-center">{{ formatComponent(student.quiz) }}</td>
            <td class="text-center">{{ formatComponent(student.lab) }}</td>
            <td class="text-center">{{ formatComponent(student.exercise) }}</td>
            <td class="text-center">{{ formatComponent(student.midterm) }}</td>
            <td class="text-center">{{ formatComponent(student.final) }}</td>
            <td class="text-center font-bold">{{ formatComponent(student.total) }}</td>
            <td class="text-center">
              <span
                class="text-xs px-2 py-1 rounded text-white"
                :class="gradeBadgeClass(student.status)"
              >
                {{ student.status }}
              </span>
            </td>
            <td class="text-center">
              <argon-button size="sm" color="dark" outline @click="printReport(student)">
                Print
              </argon-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Class Averages Table -->
    <div ref="classAverage" class="bg-white rounded-lg shadow-sm p-3">
      <div class="flex justify-between items-center mb-4">
        <h4 class="text-base font-semibold text-slate-700">Class Averages</h4>
        <div class="flex items-center gap-3 text-sm">
          <label class="flex items-center gap-1">
            <input type="radio" value="overall" v-model="averageType" @change="calculateAverages" />
            Overall
          </label>
          <label class="flex items-center gap-1">
            <input type="radio" value="course" v-model="averageType" @change="calculateAverages" />
            Per Course
          </label>
          <select
            v-if="averageType === 'course'"
            v-model="selectedCourse"
            class="form-select form-select-sm border rounded px-2 py-1"
            @change="calculateAverages"
          >
            <option value="">Select Course</option>
            <option v-for="course in availableCourses" :key="course" :value="course">
              {{ course }}
            </option>
          </select>
        </div>
      </div>
      <div class="overflow-auto">
        <table class="table w-full text-sm border">
          <thead class="bg-slate-100">
            <tr>
              <th>Component</th>
              <th>Average</th>
              <th v-if="averageType === 'course' && selectedCourse">Course</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="avg in averages" :key="avg.component" class="border-t">
              <td>{{ avg.component }}</td>
              <td>{{ avg.average }}</td>
              <td v-if="averageType === 'course' && selectedCourse">{{ selectedCourse }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="averageType === 'course' && !selectedCourse"
        class="alert alert-info mt-4 text-sm text-center"
      >
        Please select a course to view averages.
      </div>
    </div>

    <!-- Hidden Printable Area -->
    <div id="printArea" ref="printArea" style="display: none"></div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import ArgonButton from "@/components/ArgonButton.vue";


// Refs for scrolling
const markBreakdown = ref(null)
const classAverage = ref(null)

// Data
const students = ref([])
const averages = ref([])
const averageType = ref('overall')
const selectedCourse = ref('')
const availableCourses = ref([])

// Filtering data
const filterCourse = ref('')
const filterStudent = ref('')
const filterStatus = ref('')
const filterSemester = ref('')
const filterYear = ref('')

const courseOptions = computed(() => {
  return [...new Set(students.value.map(s => s.course_name).filter(Boolean))]
})
const semesterOptions = computed(() => {
  return [...new Set(students.value.map(s => s.semester).filter(Boolean))]
})
const yearOptions = computed(() => {
  return [...new Set(students.value.map(s => s.year).filter(Boolean))].sort((a, b) => b - a)
})

const filteredStudents = computed(() => {
  return students.value.filter(s => {
    const courseMatch = !filterCourse.value || s.course_name === filterCourse.value
    const studentMatch = !filterStudent.value ||
      (s.student_name && s.student_name.toLowerCase().includes(filterStudent.value.toLowerCase())) ||
      (s.student_id && s.student_id.toLowerCase().includes(filterStudent.value.toLowerCase()))
    const statusLabel = s.status // Use the backend-provided status
    const statusMatch = !filterStatus.value || statusLabel === filterStatus.value
    const semesterMatch = !filterSemester.value || s.semester === filterSemester.value
    const yearMatch = !filterYear.value || s.year == filterYear.value
    return courseMatch && studentMatch && statusMatch && semesterMatch && yearMatch
  })
})

function resetFilters() {
  filterCourse.value = ''
  filterStudent.value = ''
  filterStatus.value = ''
  filterSemester.value = ''
  filterYear.value = ''
}

// Fetch data on mount
onMounted(async () => {
  try {
   const response = await fetch('/api/advisor/adviseereport')
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }
    const data = await response.json()
    students.value = data

    // Extract unique courses for dropdown
    const courses = [...new Set(data.map(student => student.course_name))]
    availableCourses.value = courses.filter(course => course)

    // Calculate class averages
    calculateAverages()
  } catch (error) {
    console.error('Error fetching advisee report:', error)
  }
})

const calculateAverages = () => {
  if (students.value.length === 0) return

  let filteredStudents = students.value

  // Filter by selected course if needed
  if (averageType.value === 'course' && selectedCourse.value) {
    filteredStudents = students.value.filter(s => s.course_name === selectedCourse.value)
  }

  if (filteredStudents.length === 0) {
    averages.value = [{ component: 'No Data Available', average: '0.00' }]
    return
  }

        const sum = {
        assignment: 0,
        quiz: 0,
        lab: 0,
        exercise: 0,
        midterm: 0,
        final: 0,
        total: 0
      }
      
      const validCounts = {
        assignment: 0,
        quiz: 0,
        lab: 0,
        exercise: 0,
        midterm: 0,
        final: 0,
        total: 0
      }

  filteredStudents.forEach(s => {
    // Only add valid numbers and count them
    if (s.assignment !== null && s.assignment !== undefined && !isNaN(s.assignment)) {
      sum.assignment += parseFloat(s.assignment)
      validCounts.assignment++
    }
            if (s.quiz !== null && s.quiz !== undefined && !isNaN(s.quiz)) {
          sum.quiz += parseFloat(s.quiz)
          validCounts.quiz++
        }
        if (s.lab !== null && s.lab !== undefined && !isNaN(s.lab)) {
          sum.lab += parseFloat(s.lab)
          validCounts.lab++
        }
        if (s.exercise !== null && s.exercise !== undefined && !isNaN(s.exercise)) {
          sum.exercise += parseFloat(s.exercise)
          validCounts.exercise++
        }
        if (s.midterm !== null && s.midterm !== undefined && !isNaN(s.midterm)) {
          sum.midterm += parseFloat(s.midterm)
          validCounts.midterm++
        }
    if (s.final !== null && s.final !== undefined && !isNaN(s.final)) {
      sum.final += parseFloat(s.final)
      validCounts.final++
    }
    if (s.total !== null && s.total !== undefined && !isNaN(s.total)) {
      sum.total += parseFloat(s.total)
      validCounts.total++
    }
  })

  // Calculate averages only for components that have valid data
  averages.value = []
  
  if (validCounts.assignment > 0) {
    averages.value.push({ 
      component: 'Assignment', 
      average: (sum.assignment / validCounts.assignment).toFixed(2) 
    })
  }
  
        if (validCounts.quiz > 0) {
        averages.value.push({ 
          component: 'Quiz', 
          average: (sum.quiz / validCounts.quiz).toFixed(2) 
        })
      }
      
      if (validCounts.lab > 0) {
        averages.value.push({ 
          component: 'Lab', 
          average: (sum.lab / validCounts.lab).toFixed(2) 
        })
      }
      
      if (validCounts.exercise > 0) {
        averages.value.push({ 
          component: 'Exercise', 
          average: (sum.exercise / validCounts.exercise).toFixed(2) 
        })
      }
      
      if (validCounts.midterm > 0) {
        averages.value.push({ 
          component: 'Test', 
          average: (sum.midterm / validCounts.midterm).toFixed(2) 
        })
      }
  
  if (validCounts.final > 0) {
    averages.value.push({ 
      component: 'Final', 
      average: (sum.final / validCounts.final).toFixed(2) 
    })
  }
  
  if (validCounts.total > 0) {
    averages.value.push({ 
      component: 'Total', 
      average: (sum.total / validCounts.total).toFixed(2) 
    })
  }
  
  // If no valid averages, show a message
  if (averages.value.length === 0) {
    averages.value = [{ component: 'No Data Available', average: '0.00' }]
  }
}

// const scrollToMarkBreakdown = () => {
//   markBreakdown.value?.scrollIntoView({ behavior: 'smooth' })
// }

// const scrollToClassAverage = () => {
//   classAverage.value?.scrollIntoView({ behavior: 'smooth' })
// }

function gradeBadgeClass(grade) {
  if (["A+", "A", "A-"].includes(grade)) return "bg-success";
  if (["B+", "B", "B-"].includes(grade)) return "bg-primary";
  if (["C+", "C"].includes(grade)) return "bg-warning text-dark";
  if (grade === "D") return "bg-info text-dark";
  if (grade === "F") return "bg-danger";
  return "bg-secondary";
}

const printReport = (student) => {
  try {
    // Format numbers safely
    const formatNumber = (num) => {
      if (num === null || num === undefined || num === '' || isNaN(Number(num))) return '-';
      return Number(num).toFixed(2);
    }
    
    const printableHTML = `
      <html>
        <head>
          <title>Student Report - ${student.student_name || 'Unknown'}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 2rem; 
              margin: 0;
              background: white;
            }
            h2 { 
              margin-bottom: 0.5rem; 
              color: #333;
              border-bottom: 2px solid #007bff;
              padding-bottom: 10px;
            }
            .student-info {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
            }
            .student-info p {
              margin: 5px 0;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 1rem; 
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 12px 8px; 
              text-align: left;
            }
            th { 
              background-color: #007bff; 
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            .total-row {
              background-color: #e9ecef !important;
              font-weight: bold;
            }
            .status {
              padding: 5px 10px;
              border-radius: 15px;
              font-weight: bold;
              display: inline-block;
              margin-top: 10px;
            }
            .status.good { background-color: #d4edda; color: #155724; }
            .status.warning { background-color: #fff3cd; color: #856404; }
            .status.probation { background-color: #f8d7da; color: #721c24; }
          </style>
        </head>
        <body>
          <h2>Student Academic Report</h2>
          
          <div class="student-info">
            <p><strong>Student Name:</strong> ${student.student_name || 'N/A'}</p>
            <p><strong>Student ID:</strong> ${student.student_id || 'N/A'}</p>
            <p><strong>Course:</strong> ${student.course_name || 'N/A'}</p>
            <p><strong>Semester:</strong> ${student.semester || 'N/A'}</p>
            <p><strong>Year:</strong> ${student.year || 'N/A'}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Assessment Component</th>
                <th>Weighted Score</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Assignment</td><td>${formatNumber(student.assignment)}</td></tr>
              <tr><td>Quiz</td><td>${formatNumber(student.quiz)}</td></tr>
              <tr><td>Lab</td><td>${formatNumber(student.lab)}</td></tr>
              <tr><td>Exercise</td><td>${formatNumber(student.exercise)}</td></tr>
              <tr><td>Test</td><td>${formatNumber(student.midterm)}</td></tr>
              <tr><td>Final Exam</td><td>${formatNumber(student.final)}</td></tr>
              <tr class="total-row">
                <td><strong>Total Score</strong></td>
                <td><strong>${formatNumber(student.total)}</strong></td>
              </tr>
            </tbody>
          </table>
          
          <div class="status ${getStatusClass(student.total)}">
            <strong>Academic Status:</strong> ${student.status || 'Unknown'}
          </div>
          
          <div style="margin-top: 30px; font-size: 12px; color: #666;">
            <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p><strong>Note:</strong> Scores are calculated using weighted assessment components.</p>
          </div>
        </body>
      </html>
    `
    
    // Open print window
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    
    if (printWindow) {
      printWindow.document.write(printableHTML)
      printWindow.document.close()
      
      // Simple timeout to ensure content is loaded
      setTimeout(() => {
        printWindow.focus()
        printWindow.print()
      }, 1000)
    } else {
      alert('Popup blocked! Please allow popups for this site and try again.')
    }
  } catch (error) {
    console.error('Print error:', error)
    alert('Error generating print report. Please try again.')
  }
}

const getStatusClass = (total) => {
  if (total >= 80) return 'good'
  if (total >= 60) return 'warning'
  return 'probation'
}

function exportCSV() {
  const rows = students.value.map((student) => [
    student.student_name,
    student.student_id,
    student.course_name,
    (student.assignment !== null && student.assignment !== undefined) ? parseFloat(student.assignment).toFixed(2) : '',
    (student.quiz !== null && student.quiz !== undefined) ? parseFloat(student.quiz).toFixed(2) : '',
    (student.lab !== null && student.lab !== undefined) ? parseFloat(student.lab).toFixed(2) : '',
    (student.exercise !== null && student.exercise !== undefined) ? parseFloat(student.exercise).toFixed(2) : '',
    (student.midterm !== null && student.midterm !== undefined) ? parseFloat(student.midterm).toFixed(2) : '',
    (student.final !== null && student.final !== undefined) ? parseFloat(student.final).toFixed(2) : '',
    (student.total !== null && student.total !== undefined) ? parseFloat(student.total).toFixed(2) : '',
    student.status,
    student.semester,
    student.year
  ]);
  const header = [
    "Student Name",
    "Student ID",
    "Course",
    "Assignment",
    "Quiz",
    "Lab",
    "Exercise",
    "Test",
    "Final",
    "Total",
    "Status",
    "Semester",
    "Year"
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

const printTableReport = () => {
  try {
    // Format numbers safely
    const formatNumber = (num) => {
      if (num === null || num === undefined || num === '' || isNaN(Number(num))) return '-';
      return Number(num).toFixed(2);
    }
    const tableRows = filteredStudents.value.map(student => `
      <tr>
        <td>${student.student_name || 'N/A'}</td>
        <td>${student.student_id || 'N/A'}</td>
        <td>${student.course_name || 'N/A'}</td>
        <td class="text-center">${formatNumber(student.assignment)}</td>
        <td class="text-center">${formatNumber(student.quiz)}</td>
        <td class="text-center">${formatNumber(student.lab)}</td>
        <td class="text-center">${formatNumber(student.exercise)}</td>
        <td class="text-center">${formatNumber(student.midterm)}</td>
        <td class="text-center">${formatNumber(student.final)}</td>
        <td class="text-center font-bold">${formatNumber(student.total)}</td>
        <td class="text-center">${student.status || '-'}</td>
        <td class="text-center">${student.semester || '-'}</td>
        <td class="text-center">${student.year || '-'}</td>
      </tr>
    `).join('');
    const printableHTML = `
      <html>
        <head>
          <title>Advisee Report Table</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 2rem;
              margin: 0;
              background: white;
            }
            h2 {
              margin-bottom: 1rem;
              color: #333;
              border-bottom: 2px solid #007bff;
              padding-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 1rem;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px 6px;
              text-align: left;
              font-size: 14px;
            }
            th {
              background-color: #007bff;
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f8f9fa;
            }
          </style>
        </head>
        <body>
          <h2>Advisee Report</h2>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>ID</th>
                <th>Course</th>
                <th>Assignment</th>
                <th>Quiz</th>
                <th>Lab</th>
                <th>Exercise</th>
                <th>Test</th>
                <th>Final</th>
                <th>Total</th>
                <th>Status</th>
                <th>Semester</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div style="margin-top: 30px; font-size: 12px; color: #666;">
            <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank', 'width=1000,height=700');
    if (printWindow) {
      printWindow.document.write(printableHTML);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 1000);
    } else {
      alert('Popup blocked! Please allow popups for this site and try again.');
    }
  } catch (error) {
    console.error('Print error:', error);
    alert('Error generating print report. Please try again.');
  }
}

// Add formatting function for table display
const formatComponent = (val) => (val && val !== 0 ? parseFloat(val).toFixed(2) : '-')
</script>

<style scoped>
.badge {
  padding: 6px 10px;
  font-size: 0.8rem;
  border-radius: 8px;
}
</style>

