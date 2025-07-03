<template>
  <div class="student-dashboard">
    <div class="main-content">
      <header class="dashboard-header">
        <div>
          <h1>Welcome Back!</h1>
          <p class="text-muted">{{ quote }}</p>
        </div>
        <div class="d-flex align-items-center gap-3">
          <input type="text" placeholder="Search your course..." />
          <span class="notification-bell">🔔</span>
        </div>
      </header>

      <section class="student-summary">
        <h4>Your Academic Snapshot</h4>
        <p>Current CGPA: <strong>3.45</strong></p>
        <p>Completed Credits: <strong>78</strong></p>
      </section>

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
            <div class="progress">
              <div class="progress-bar" :style="{ width: course.progress + '%' }">
                {{ course.progress }}%
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="tasks-section">
        <h3>Upcoming Deadlines</h3>
        <ul>
          <li v-for="task in tasks" :key="task.id">
            📌 {{ task.title }} - Due {{ task.due }}
          </li>
        </ul>
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
const quote = "Success is the sum of small efforts repeated every day.";

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

const tasks = [
  { id: 1, title: "Assignment 2 (Web Dev)", due: "25 June 2025" },
  { id: 2, title: "Quiz 4 (Database)", due: "28 June 2025" },
  { id: 3, title: "Final Project Proposal", due: "1 July 2025" }
]

// Add progress values for each course
courses.forEach(course => {
  course.progress = Math.floor(Math.random() * 100); // Random for demo
})
</script>

<style scoped>
.student-dashboard {
  display: flex;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
.notification-bell {
  font-size: 24px;
  cursor: pointer;
}

.student-summary {
  background: #fff;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
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
.progress {
  background: #eee;
  border-radius: 20px;
  height: 8px;
  margin-top: 5px;
}
.progress-bar {
  background-color: #6c63ff;
  height: 100%;
  border-radius: 20px;
  font-size: 10px;
  text-align: center;
  color: white;
}

.tasks-section ul {
  list-style: none;
  padding: 0;
}
.tasks-section li {
  background: #fff;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
