<template>
  <div class="student-dashboard">
    <div class="sidebar">
      <h2>COURSE</h2>
      <nav>
        <router-link to="/student" exact-active-class="active">Dashboard</router-link>
        <router-link to="/student/compare">Class Ranking</router-link>
        <router-link to="/student/simulator">What‑If Simulator</router-link>
        <router-link to="/student/settings">Settings</router-link>
        <a href="#" @click.prevent="logout">Logout</a>
      </nav>
    </div>

    <div class="main-content">
      <header class="dashboard-header">
        <h1>Welcome Back!</h1>
        <input type="text" placeholder="Search your course here..." />
      </header>

      <section class="course-banner">
        <h2>Sharpen Your Skills With Professional Online Courses</h2>
        <button>Join Now</button>
      </section>

      <section class="continue-watching">
        <h3>Continue Watching</h3>
        <div class="courses">
          <div class="course-card" v-for="course in courses" :key="course.id">
            <img :src="course.thumbnail" alt="Course thumbnail" />
            <h4>{{ course.title }}</h4>
            <p>{{ course.instructor }}</p>
          </div>
        </div>
      </section>

      <section class="mentor-section">
        <h3>Your Mentor</h3>
        <ul>
          <li v-for="mentor in mentors" :key="mentor.id">
            {{ mentor.name }} - {{ mentor.course }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

async function logout() {
  localStorage.clear();
  await fetch('/api/logout', { method: 'POST' }); // optional: clears PHP session
  router.push('/login');
}

const courses = [
  {
    id: 1,
    title: 'Beginner’s Guide To Frontend Dev',
    instructor: 'Prashant Kumar Singh',
    thumbnail: 'https://via.placeholder.com/150'
  },
  {
    id: 2,
    title: 'How To Create Your Online Course',
    instructor: 'Ravi Kumar',
    thumbnail: 'https://via.placeholder.com/150'
  },
  {
    id: 3,
    title: 'Learn Software Dev With Us',
    instructor: 'Neha Sharma',
    thumbnail: 'https://via.placeholder.com/150'
  }
]

const mentors = [
  { id: 1, name: 'Prashant Kumar Singh', course: 'React Basics' },
  { id: 2, name: 'Ravi Kumar', course: 'VueJS Fundamentals' },
  { id: 3, name: 'Neha Sharma', course: 'UI/UX Design' }
]
</script>

<style scoped>
.student-dashboard {
  display: flex;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.sidebar {
  width: 240px;
  background-color: #fff;
  border-right: 1px solid #eee;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.sidebar h2 {
  margin-bottom: 2rem;
  color: #6c63ff;
}
.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.sidebar nav a {
  text-decoration: none;
  color: #333;
}
.sidebar nav .active {
  font-weight: bold;
  color: #6c63ff;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f9f9f9;
  overflow-y: auto;
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
