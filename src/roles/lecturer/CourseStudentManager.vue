<template>
  <div class="container-fluid py-4">
    <!-- Title -->
    <div class="mb-4">
      <h4 class="text-white">Course & Student Manager</h4>
    </div>

    <!-- Tabs -->
    <ul class="nav nav-pills mb-3">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === 'courses' }"
          href="#"
          @click.prevent="activeTab = 'courses'"
        >
          Courses
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === 'enrollments' }"
          href="#"
          @click.prevent="activeTab = 'enrollments'"
        >
          Student Enrollment
        </a>
      </li>
    </ul>

    <!-- Course Tab -->
    <div v-if="activeTab === 'courses'">
      <!-- Course Form -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">
            {{ isEditing ? "Edit Course" : "Add New Course" }}
          </h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <input
                v-model="courseForm.course_code"
                placeholder="Course Code"
                class="form-control"
              />
            </div>
            <div class="col-md-3">
              <input
                v-model="courseForm.course_name"
                placeholder="Course Name"
                class="form-control"
              />
            </div>
            <div class="col-md-3">
              <input
                v-model="courseForm.semester"
                placeholder="Semester"
                class="form-control"
              />
            </div>
            <div class="col-md-3">
              <input
                v-model="courseForm.year"
                type="number"
                placeholder="Year"
                class="form-control"
              />
            </div>
          </div>
          <div class="mt-3">
            <button
              class="btn btn-primary btn-sm"
              @click="isEditing ? updateCourse() : addCourse()"
            >
              {{ isEditing ? "Update" : "Add" }}
            </button>
            <button
              v-if="isEditing"
              class="btn btn-outline-secondary btn-sm ms-2"
              @click="resetForm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Course Table -->
      <div class="card">
        <div class="card-header">
          <h6 class="mb-0">All Courses</h6>
        </div>
        <div class="table-responsive">
          <table class="table align-items-center mb-0">
            <thead class="bg-light">
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Semester</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="course in courses" :key="course.id">
                <td>{{ course.course_code }}</td>
                <td>{{ course.course_name }}</td>
                <td>{{ course.semester }}</td>
                <td>{{ course.year }}</td>
                <td>
                  <button
                    class="btn btn-outline-dark btn-sm me-2"
                    @click="editCourse(course)"
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-danger btn-sm"
                    @click="deleteCourse(course.id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr v-if="courses.length === 0">
                <td colspan="5" class="text-center text-muted">No courses found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Enrollments Tab -->
    <div v-if="activeTab === 'enrollments'">
      <!-- Enroll Form -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Enroll Student to Course</h5>
        </div>
        <div class="card-body">
          <div class="row g-0">
            <div class="col-md-6">
              <select v-model="enrollForm.student_id" class="form-select">
                <option value="">Select Student</option>
                <option
                  v-for="student in students"
                  :key="student.id"
                  :value="student.id"
                >
                  {{ student.name }} ({{ student.matric_number }})
                </option>
              </select>
            </div>
            <div class="col-md-6">
              <select v-model="enrollForm.course_id" class="form-select">
                <option value="">Select Course</option>
                <option
                  v-for="course in courses"
                  :key="course.id"
                  :value="course.id"
                >
                  {{ course.course_code }} - {{ course.course_name }} (Sem:
                  {{ course.semester }}, Year: {{ course.year }})
                </option>
              </select>
            </div>
          </div>
          <div class="mt-3">
            <button
              class="btn btn-primary btn-sm"
              @click="enrollStudent"
            >
              {{ editingEnrollmentId ? "Update" : "Enroll" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Enrollments Table -->
      <div class="card">
        <div class="card-header">
          <h6 class="mb-0">Enrollments</h6>
        </div>
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="bg-light">
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="enroll in enrollments" :key="enroll.id">
                <td>{{ enroll.student_name }}</td>
                <td>{{ enroll.course_name }}</td>
                <td>
                  <button
                    class="btn btn-warning btn-sm me-2"
                    @click="editEnrollment(enroll)"
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-danger btn-sm"
                    @click="deleteEnrollment(enroll.id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr v-if="enrollments.length === 0">
                <td colspan="3" class="text-center text-muted">No enrollments found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "CourseStudentManager",
  data() {
    return {
      activeTab: "courses",
      courses: [],
      students: [],
      enrollments: [],
      courseForm: {
        course_code: "",
        course_name: "",
        semester: "",
        year: "",
      },
      enrollForm: {
        student_id: "",
        course_id: "",
      },
      isEditing: false,
      editingId: null,
      editingEnrollmentId: null,
    };
  },
  mounted() {
    this.fetchCourses();
    this.fetchStudents();
    this.fetchEnrollments();
  },
  methods: {
    tabClass(tab) {
      return [
        "px-4 py-2 rounded-t-md mr-2",
        this.activeTab === tab
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300",
      ].join(" ");
    },
    async fetchCourses() {
      const res = await fetch(`${process.env.VUE_APP_API_URL}/api/lecturer/courses`, {
          credentials: "include",
        })
      this.courses = await res.json();
    },
    async addCourse() {
      await fetch(`${process.env.VUE_APP_API_URL}/api/lecturer/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.courseForm),
        credentials: "include",
      });
      this.fetchCourses();
      this.resetForm();
    },
    editCourse(course) {
      this.isEditing = true;
      this.editingId = course.id;
      this.courseForm = {
        course_code: course.course_code,
        course_name: course.course_name,
        semester: course.semester,
        year: course.year,
      };
    },
    async updateCourse() {
      await fetch(`${process.env.VUE_APP_API_URL}/api/lecturer/courses/${this.editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.courseForm),
        credentials: "include",
      });
      this.fetchCourses();
      this.resetForm();
    },
    async deleteCourse(id) {
      if (!confirm("Are you sure you want to delete this course?")) return;
      await fetch(`${process.env.VUE_APP_API_URL}/api/lecturer/courses/${id}`, { method: "DELETE",credentials: "include", });
      this.fetchCourses();
    },
    resetForm() {
      this.courseForm = {
        course_code: "",
        course_name: "",
        semester: "",
        year: "",
      };
      this.isEditing = false;
      this.editingId = null;
    },
    async fetchStudents() {
      const res = await fetch(`${process.env.VUE_APP_API_URL}/api/lecturer/analytics`, {
          credentials: "include",
        })
      const data = await res.json();
      this.students = data.students;
    },
    async fetchEnrollments() {
      const res = await fetch(`${process.env.VUE_APP_API_URL}/api/lecturer/enrollments`, {
          credentials: "include",
        })
      this.enrollments = await res.json();
    },
    async enrollStudent() {
      const url = this.editingEnrollmentId
        ? `${process.env.VUE_APP_API_URL}/api/lecturer/enroll/${this.editingEnrollmentId}`
        : `${process.env.VUE_APP_API_URL}/api/lecturer/enroll`;
      const method = this.editingEnrollmentId ? "PUT" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.enrollForm),
        credentials: "include",
      });
      this.fetchEnrollments();
      this.resetEnrollForm();
    },
    editEnrollment(enroll) {
      this.editingEnrollmentId = enroll.id;
      this.enrollForm.student_id = enroll.student_id;
      this.enrollForm.course_id = enroll.course_id;
    },
    async deleteEnrollment(id) {
      await fetch(`${process.env.VUE_APP_API_URL}/api/lecturer/enroll/${id}`, { method: "DELETE",credentials: "include", });
      this.fetchEnrollments();
    },
    resetEnrollForm() {
      this.enrollForm = { student_id: "", course_id: "" };
      this.editingEnrollmentId = null;
    },
  },
};
</script>

<style scoped>
.input {
  @apply border rounded px-3 py-2 w-full;
}
.btn {
  @apply px-4 py-2 rounded text-white;
}
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700;
}
.btn-secondary {
  @apply bg-gray-400 hover:bg-gray-500 text-white;
}
.btn-danger {
  @apply bg-red-500 hover:bg-red-600 text-white;
}
.btn-sm {
  @apply text-sm px-2 py-1;
}
.btn-outline {
  @apply border border-gray-400 text-gray-700 hover:bg-gray-100;
}
</style>
