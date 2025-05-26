<template>
  <div class="container py-4">
    <h2 class="mb-4">Course & Student Management</h2>
    <ul class="nav nav-tabs mb-3" id="managementTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="courses-tab" data-bs-toggle="tab" data-bs-target="#courses" type="button" role="tab">Courses</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="students-tab" data-bs-toggle="tab" data-bs-target="#students" type="button" role="tab">Enroll Students</button>
      </li>
    </ul>

    <div class="tab-content">
      <!-- Course Management Tab -->
      <div class="tab-pane fade show active" id="courses" role="tabpanel">
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Add New Course</h5>
            <form @submit.prevent="addCourse">
              <div class="mb-3">
                <label for="courseName" class="form-label">Course Name</label>
                <input type="text" class="form-control" id="courseName" v-model="newCourse" required />
              </div>
              <button type="submit" class="btn btn-primary">Add Course</button>
            </form>
          </div>
        </div>

        <h5>Course List</h5>
        <ul class="list-group">
          <li v-for="(course, index) in courses" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
            {{ course }}
            <div>
              <button class="btn btn-sm btn-outline-secondary me-2" @click="editCourse(index)">Edit</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteCourse(index)">Delete</button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Student Enrollment Tab -->
      <div class="tab-pane fade" id="students" role="tabpanel">
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Enroll Student to Course</h5>
            <form @submit.prevent="enrollStudent">
              <div class="mb-3">
                <label class="form-label">Select Course</label>
                <select class="form-select" v-model="selectedCourse">
                  <option disabled value="">Choose...</option>
                  <option v-for="(course, index) in courses" :key="index" :value="course">{{ course }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Select Student</label>
                <select class="form-select" v-model="selectedStudent">
                  <option disabled value="">Choose...</option>
                  <option v-for="student in dummyStudents" :key="student">{{ student }}</option>
                </select>
              </div>
              <button type="submit" class="btn btn-success">Enroll Student</button>
            </form>
          </div>
        </div>

        <div v-if="Object.keys(enrolled).length">
          <h5>Enrolled Students</h5>
          <ul class="list-group">
            <li v-for="(students, course) in enrolled" :key="course" class="list-group-item">
              <strong>{{ course }}</strong>
              <ul>
                <li v-for="(student, i) in students" :key="i">{{ student }}</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newCourse: '',
      courses: [],
      selectedCourse: '',
      selectedStudent: '',
      dummyStudents: ['Alice Johnson', 'Bob Lee', 'Charlie Tan', 'Diana Wong'],
      enrolled: {},
    };
  },
  methods: {
    addCourse() {
      if (this.newCourse.trim()) {
        this.courses.push(this.newCourse.trim());
        this.newCourse = '';
      }
    },
    editCourse(index) {
      const updatedName = prompt('Edit course name:', this.courses[index]);
      if (updatedName) this.$set(this.courses, index, updatedName);
    },
    deleteCourse(index) {
      this.courses.splice(index, 1);
    },
    enrollStudent() {
      if (!this.selectedCourse || !this.selectedStudent) return;
      if (!this.enrolled[this.selectedCourse]) this.enrolled[this.selectedCourse] = [];
      if (!this.enrolled[this.selectedCourse].includes(this.selectedStudent)) {
        this.enrolled[this.selectedCourse].push(this.selectedStudent);
      }
      this.selectedStudent = '';
    },
  },
};
</script>

<style scoped>
.card-title {
  color: #2c3e50;
}
.nav-tabs .nav-link.active {
  background-color: #0d6efd;
  color: white;
}
</style>
