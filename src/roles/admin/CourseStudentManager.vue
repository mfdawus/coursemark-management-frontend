<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Course & Student Manager</h1>

    <!-- Tabs -->
    <div class="mb-6">
      <button :class="tabClass('courses')" @click="activeTab = 'courses'">Courses</button>
      <button :class="tabClass('enrollments')" @click="activeTab = 'enrollments'">Student Enrollment</button>
    </div>

    <!-- Course Tab -->
    <div v-if="activeTab === 'courses'">
      <div class="bg-white rounded shadow p-4 mb-6">
        <h2 class="text-lg font-semibold mb-2">{{ isEditing ? 'Edit Course' : 'Add New Course' }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input v-model="courseForm.course_code" placeholder="Course Code" class="input" />
          <input v-model="courseForm.course_name" placeholder="Course Name" class="input" />
          <input v-model="courseForm.semester" placeholder="Semester (eg. 1, 2, Short)" class="input" />
          <input v-model="courseForm.year" type="number" placeholder="Year (eg. 2025)" class="input" />
        </div>
        <div class="mt-4">
          <button class="btn btn-primary" @click="isEditing ? updateCourse() : addCourse()">
            {{ isEditing ? 'Update' : 'Add' }}
          </button>
          <button v-if="isEditing" class="btn btn-secondary ml-2" @click="resetForm">Cancel</button>
        </div>
      </div>

      <div class="bg-white rounded shadow p-4">
        <h2 class="text-lg font-semibold mb-4">Courses</h2>
        <table class="w-full table-auto border">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2">Code</th>
              <th class="p-2">Name</th>
              <th class="p-2">Semester</th>
              <th class="p-2">Year</th>
              <th class="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in courses" :key="course.id" class="border-t">
              <td class="p-2">{{ course.course_code }}</td>
              <td class="p-2">{{ course.course_name }}</td>
              <td class="p-2">{{ course.semester }}</td>
              <td class="p-2">{{ course.year }}</td>
              <td class="p-2 space-x-2">
                <button class="btn btn-sm btn-outline" @click="editCourse(course)">Edit</button>
                <button class="btn btn-sm btn-danger" @click="deleteCourse(course.id)">Delete</button>
              </td>
            </tr>
            <tr v-if="courses.length === 0">
              <td colspan="5" class="p-2 text-center text-gray-500">No courses added yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Enrollment Tab -->
    <div v-if="activeTab === 'enrollments'" class="bg-white rounded shadow p-4">
      <h2 class="text-lg font-semibold mb-4">Enroll Student to a Course</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select v-model="enrollForm.student_id" class="input">
          <option value="">Select Student</option>
          <option v-for="student in students" :key="student.id" :value="student.id">
            {{ student.name }} ({{ student.matric_number }})
          </option>
        </select>

        <select v-model="enrollForm.course_id" class="input">
          <option value="">Select Course</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
  {{ course.course_code }} - {{ course.course_name }} (Sem: {{ course.semester }} Year: {{ course.year }})
</option>

        </select>
      </div>
      <div class="mt-4">
        <button class="btn btn-primary" @click="enrollStudent">
          {{ editingEnrollmentId ? 'Update' : 'Enroll' }}
        </button>
      </div>

      <table class="min-w-full table-auto border mt-4">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2">Student</th>
            <th class="border px-4 py-2">Course</th>
            <th class="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="enroll in enrollments" :key="enroll.id">
            <td class="border px-4 py-2">{{ enroll.student_name }}</td>
            <td class="border px-4 py-2">{{ enroll.course_name }}</td>
            <td class="border px-4 py-2">
              <button @click="editEnrollment(enroll)" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              <button @click="deleteEnrollment(enroll.id)" class="bg-red-600 text-white px-2 py-1 ml-2 rounded">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseStudentManager',
  data() {
    return {
      activeTab: 'courses',
      courses: [],
      students: [],
      enrollments: [],
      courseForm: {
        course_code: '',
        course_name: '',
        semester: '',
        year: ''
      },
      enrollForm: {
        student_id: '',
        course_id: ''
      },
      isEditing: false,
      editingId: null,
      editingEnrollmentId: null
    }
  },
  mounted() {
    this.fetchCourses()
    this.fetchStudents()
    this.fetchEnrollments()
  },
  methods: {
  tabClass(tab) {
    return [
      'px-4 py-2 rounded-t-md mr-2',
      this.activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    ].join(' ')
  },
  async fetchCourses() {
    const res = await fetch('/api/lecturer/courses')
    this.courses = await res.json()
  },
  async addCourse() {
    await fetch('/api/lecturer/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.courseForm)
    })
    this.fetchCourses()
    this.resetForm()
  },
  editCourse(course) {
    this.isEditing = true
    this.editingId = course.id
    this.courseForm = {
      course_code: course.course_code,
      course_name: course.course_name,
      semester: course.semester,
      year: course.year
    }
  },
  async updateCourse() {
    await fetch(`/api/lecturer/courses/${this.editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.courseForm)
    })
    this.fetchCourses()
    this.resetForm()
  },
  async deleteCourse(id) {
    if (!confirm('Are you sure you want to delete this course?')) return;
    await fetch(`/api/lecturer/courses/${id}`, { method: 'DELETE' })
    this.fetchCourses()
  },
  resetForm() {
    this.courseForm = { course_code: '', course_name: '', semester: '', year: '' }
    this.isEditing = false
    this.editingId = null
  },
  async fetchStudents() {
    const res = await fetch('/api/lecturer/analytics')
    const data = await res.json()
    this.students = data.students
  },
  async fetchEnrollments() {
    const res = await fetch('/api/lecturer/enrollments')
    this.enrollments = await res.json()
  },
  async enrollStudent() {
    const url = this.editingEnrollmentId
      ? `/api/lecturer/enroll/${this.editingEnrollmentId}`
      : '/api/lecturer/enroll'
    const method = this.editingEnrollmentId ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.enrollForm)
    })
    this.fetchEnrollments()
    this.resetEnrollForm()
  },
  editEnrollment(enroll) {
    this.editingEnrollmentId = enroll.id
    this.enrollForm.student_id = enroll.student_id
    this.enrollForm.course_id = enroll.course_id
  },
  async deleteEnrollment(id) {
    await fetch(`/api/lecturer/enroll/${id}`, { method: 'DELETE' })
    this.fetchEnrollments()
  },
  resetEnrollForm() {
    this.enrollForm = { student_id: '', course_id: '' }
    this.editingEnrollmentId = null
  }
}
}
</script>

<style scoped>
.input { @apply border rounded px-3 py-2 w-full; }
.btn { @apply px-4 py-2 rounded text-white; }
.btn-primary { @apply bg-blue-600 hover:bg-blue-700; }
.btn-secondary { @apply bg-gray-400 hover:bg-gray-500 text-white; }
.btn-danger { @apply bg-red-500 hover:bg-red-600 text-white; }
.btn-sm { @apply text-sm px-2 py-1; }
.btn-outline { @apply border border-gray-400 text-gray-700 hover:bg-gray-100; }
</style>
