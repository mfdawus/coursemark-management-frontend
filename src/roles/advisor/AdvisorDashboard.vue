<template>
  <div class="main-content">
    <header class="dashboard-header">
      <h1>Welcome Back, Advisor!</h1>
      <input type="text" placeholder="Search student or course..." />
    </header>

    <section class="course-banner">
      <h2>Guide Your Students to Academic Success</h2>
      <button>View Student List</button>
    </section>

    <section class="continue-watching">
      <h3>Monitored Courses</h3>
      <div class="courses">
        <div class="course-card" v-for="course in courses" :key="course.id">
          <img :src="course.thumbnail" alt="Course thumbnail" />
          <h4>{{ course.title }}</h4>
          <p>{{ course.instructor }}</p>
        </div>
      </div>
    </section>

    <section class="mentor-section">
      <h3>Students You Advise</h3>
      <ul>
        <li v-for="mentor in mentors" :key="mentor.id">
          {{ mentor.name }} - {{ mentor.course }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";

const courses = ref([
  {
    id: 1,
    title: "Data Structures",
    instructor: "Prof. Amir",
    thumbnail: "https://via.placeholder.com/200x100"
  },
  {
    id: 2,
    title: "Database Systems",
    instructor: "Dr. Nurul",
    thumbnail: "https://via.placeholder.com/200x100"
  }
]);

const mentors = ref([
  { id: 1, name: "Aliya Binti Zainal", course: "Software Engineering" },
  { id: 2, name: "John Lee", course: "Cybersecurity" }
]);
</script>

<style scoped>
.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f9f9f9;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.dashboard-header input {
  padding: 0.5rem;
  width: 300px;
}
.course-banner {
  background-color: #6c63ff;
  color: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.course-banner button {
  background: white;
  color: #6c63ff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.continue-watching .courses {
  display: flex;
  gap: 1rem;
}
.course-card {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  width: 200px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.course-card img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}
.mentor-section ul {
  list-style-type: none;
  padding-left: 0;
}
.mentor-section li {
  background: #fff;
  margin-bottom: 0.5rem;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
</style>
