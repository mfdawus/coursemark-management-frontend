<template>
  <div class="profile-page px-4 py-3">
    <!-- Header -->
    <h3 class="fw-bold text-white mb-4">My Profile</h3>

    <!-- Loading -->
    <div v-if="!profile" class="alert alert-white">
      Loading profile...
    </div>

    <!-- Profile Card -->
    <div v-else class="card shadow-sm border-0">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <p class="mb-3">
              <strong class="text-muted">Name:</strong><br />
              {{ profile.name }}
            </p>
            <p class="mb-3">
              <strong class="text-muted">Email:</strong><br />
              {{ profile.email }}
            </p>
            <p class="mb-3">
              <strong class="text-muted">Matric Number:</strong><br />
              {{ profile.matric_number }}
            </p>
            <p class="mb-3">
              <strong class="text-muted">Role:</strong><br />
              {{ formatRole(profile.role) }}
            </p>
            <p class="mb-3">
              <strong class="text-muted">Joined:</strong><br />
              {{ formatDate(profile.created_at) }}
            </p>

            <p
              v-if="!isNaN(parseFloat(profile.average_final_mark))"
              class="mb-3"
            >
              <strong class="text-muted">Average Final Mark:</strong><br />
              {{ parseFloat(profile.average_final_mark).toFixed(2) }}%
            </p>
          </div>

          <div class="col-md-6">
            <h5 class="text-muted mb-2">Enrolled Courses</h5>
            <ul v-if="profile.courses.length" class="list-group list-group-flush small">
              <li
                v-for="course in profile.courses"
                :key="course.course_code"
                class="list-group-item px-0"
              >
                {{ course.course_code }} – {{ course.course_name }}
                <br />
                <small class="text-muted">
                  Semester {{ course.semester }}, {{ course.year }}
                </small>
              </li>
            </ul>
            <p v-else class="text-muted small">No courses enrolled.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StudentProfiles",
  data() {
    return {
      profile: null,
    };
  },
  mounted() {
    this.fetchProfile();
  },
  methods: {
    fetchProfile() {
      fetch("/api/student/profile")
        .then((res) => res.json())
        .then((data) => {
          this.profile = data;
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
        });
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    formatRole(role) {
      return role.charAt(0).toUpperCase() + role.slice(1);
    },
  },
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
