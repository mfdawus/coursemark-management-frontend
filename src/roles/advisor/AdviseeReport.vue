<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Progress Overview</h2>
      <div>
        <button class="btn btn-primary me-2" @click="scrollToMarkBreakdown">
          View Full Mark Breakdown
        </button>
        <button class="btn btn-secondary" @click="scrollToClassAverage">
          View Class Average per Component
        </button>
      </div>
    </div>

    <!-- Full Mark Breakdown Section -->
    <div ref="markBreakdown" class="mt-5">
      <h4>Full Mark Breakdown</h4>
      <table class="table table-bordered table-striped mt-3">
        <thead class="table-dark">
          <tr>
            <th>Student Name</th>
            <th>Student ID</th>
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
          <tr v-for="student in students" :key="student.student_id">
            <td>{{ student.student_name }}</td>
            <td>{{ student.student_id }}</td>
            <td>{{ student.course_name }}</td>
            <td>{{ formatComponent(student.assignment) }}</td>
            <td>{{ formatComponent(student.quiz) }}</td>
            <td>{{ formatComponent(student.lab) }}</td>
            <td>{{ formatComponent(student.exercise) }}</td>
            <td>{{ formatComponent(student.midterm) }}</td>
            <td>{{ formatComponent(student.final) }}</td>
            <td>{{ formatComponent(student.total) }}</td>
            <td>
              <span class="badge" :class="getStatusBadge(student.total)">
                {{ getStatusLabel(student.total) }}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-outline-dark" @click="printReport(student)">
                🖨️ Print
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Class Average Section -->
    <div ref="classAverage" class="mt-5">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Class Average per Component</h4>
        <div class="d-flex align-items-center gap-3">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="overallAverage" 
                   v-model="averageType" value="overall" @change="calculateAverages">
            <label class="form-check-label" for="overallAverage">
              Overall Average
            </label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="courseAverage" 
                   v-model="averageType" value="course" @change="calculateAverages">
            <label class="form-check-label" for="courseAverage">
              Per Course
            </label>
          </div>
          <select v-if="averageType === 'course'" 
                  class="form-select form-select-sm" 
                  style="width: auto;"
                  v-model="selectedCourse" 
                  @change="calculateAverages">
            <option value="">Select Course</option>
            <option v-for="course in availableCourses" :key="course" :value="course">
              {{ course }}
            </option>
          </select>
        </div>
      </div>
      
      <table class="table table-bordered table-hover mt-3">
        <thead class="table-secondary">
          <tr>
            <th>Component</th>
            <th>Average Score</th>
            <th v-if="averageType === 'course' && selectedCourse">Course</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="avg in averages" :key="avg.component">
            <td>{{ avg.component }}</td>
            <td>{{ avg.average }}</td>
            <td v-if="averageType === 'course' && selectedCourse">{{ selectedCourse }}</td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="averageType === 'course' && !selectedCourse" class="alert alert-info mt-3">
        Please select a course to view its averages.
      </div>
    </div>

    <!-- Hidden printable area -->
    <div id="printArea" ref="printArea" style="display: none;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Refs for scrolling
const markBreakdown = ref(null)
const classAverage = ref(null)

// Data
const students = ref([])
const averages = ref([])
const averageType = ref('overall')
const selectedCourse = ref('')
const availableCourses = ref([])

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

const scrollToMarkBreakdown = () => {
  markBreakdown.value?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToClassAverage = () => {
  classAverage.value?.scrollIntoView({ behavior: 'smooth' })
}

const getStatusLabel = (total) => {
  if (total >= 80) return 'Good Standing'
  if (total >= 60) return 'Warning'
  return 'Probation'
}

const getStatusBadge = (total) => {
  if (total >= 80) return 'bg-success'
  if (total >= 60) return 'bg-warning'
  return 'bg-danger'
}

const printReport = (student) => {
  try {
    // Format numbers safely
    const formatNumber = (num) => {
      if (num === null || num === undefined || isNaN(num)) return '0.00'
      return parseFloat(num).toFixed(2)
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
