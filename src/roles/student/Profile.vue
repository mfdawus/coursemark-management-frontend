<template>
  <div class="profile-page">
    <h2>👤 My Profile</h2>

    <div v-if="!profile">
      <p>Loading profile...</p>
    </div>

    <div v-else class="profile-card">
      <p><strong>Name:</strong> {{ profile.name }}</p>
      <p><strong>Email:</strong> {{ profile.email }}</p>
      <p><strong>Matric Number:</strong> {{ profile.matric_number }}</p>
      <p><strong>Role:</strong> {{ formatRole(profile.role) }}</p>
      <p><strong>Joined:</strong> {{ formatDate(profile.created_at) }}</p>

    <p v-if="!isNaN(parseFloat(profile.average_final_mark))">
    <strong>Average Final Mark:</strong> {{ parseFloat(profile.average_final_mark).toFixed(2) }}
    </p>

      <h4 style="margin-top: 1rem;">📚 Enrolled Courses:</h4>
      <ul v-if="profile.courses.length">
        <li v-for="course in profile.courses" :key="course.course_code">
          {{ course.course_code }} - {{ course.course_name }} ({{ course.semester }} {{ course.year }})
        </li>
      </ul>
      <p v-else>No courses enrolled.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentProfiles',
  data() {
    return {
      profile: null
    };
  },
  methods: {
    fetchProfile() {
      fetch('/api/student/profile')
        .then(res => res.json())
        .then(data => {
          this.profile = data;
        })
        .catch(err => {
          console.error('Failed to fetch profile:', err);
        });
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    formatRole(role) {
      return role.charAt(0).toUpperCase() + role.slice(1);
    }
  },
  mounted() {
    this.fetchProfile();
  }
};
</script>

<style scoped>
.profile-page {
  padding: 1.5rem;
  max-width: 600px;
  margin: auto;
}

.profile-card {
  padding: 1.5rem;
  background: #f8f9fa;
  border: 1px solid #ccc;
  border-left: 6px solid #007bff;
  border-radius: 8px;
}

.profile-card p {
  margin: 0.5rem 0;
  font-size: 1rem;
}
</style>
