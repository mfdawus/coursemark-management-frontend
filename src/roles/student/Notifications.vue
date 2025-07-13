<template>
  <div class="notifications-page px-4 py-3">
    <!-- Header -->
    <h3 class="fw-bold text-white mb-4">Notifications</h3>

    <!-- No Notifications -->
    <div v-if="notifications.length === 0" class="alert alert-white">
      No notifications yet.
    </div>

    <!-- Notification List -->
    <div v-else class="list-group shadow-sm">
      <div
        v-for="note in notifications"
        :key="note.id"
        class="list-group-item list-group-item-action"
        :class="note.is_read === 0 ? 'bg-light border-start border-4 border-primary' : ''"
      >
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h6 class="mb-1 fw-semibold text-dark">{{ note.title }}</h6>
            <p class="mb-1 text-muted small">{{ note.message }}</p>
            <small class="text-secondary">{{ formatDate(note.created_at) }}</small>
          </div>
          <span v-if="note.is_read === 0" class="badge bg-primary">New</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StudentNotifications",
  data() {
    return {
      notifications: [],
    };
  },
  mounted() {
    this.fetchNotifications();
  },
  methods: {
    fetchNotifications() {
      fetch("/api/student/notifications")
        .then((res) => res.json())
        .then((data) => {
          this.notifications = data || [];
        })
        .catch((err) => {
          console.error("Failed to load notifications", err);
        });
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>

<style scoped>
.notifications-page {
  padding: 1.5rem;
}

.notification-list {
  list-style: none;
  padding: 0;
}

.notification-list li {
  border: 1px solid #ddd;
  border-left: 5px solid #999;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 5px;
}

.notification-list li.unread {
  border-left-color: #007bff;
  background-color: #eef6ff;
  font-weight: 500;
}

.notification-list h4 {
  margin: 0 0 0.3rem 0;
}

.notification-list p {
  margin: 0.2rem 0 0.5rem 0;
}

.notification-list small {
  color: #777;
}
</style>
