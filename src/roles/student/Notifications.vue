<template>
  <div class="notifications-page">
    <h2>🔔 Notifications</h2>

    <div v-if="notifications.length === 0">
      <p>No notifications yet.</p>
    </div>

    <ul class="notification-list">
      <li
        v-for="note in notifications"
        :key="note.id"
        :class="{ unread: note.is_read === 0 }"
      >
        <h4>{{ note.title }}</h4>
        <p>{{ note.message }}</p>
        <small>{{ formatDate(note.created_at) }}</small>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'StudentNotifications',
  data() {
    return {
      notifications: []
    };
  },
  methods: {
    fetchNotifications() {
      fetch('/api/student/notifications')
        .then(res => res.json())
        .then(data => {
          this.notifications = data || [];
        })
        .catch(err => {
          console.error('Failed to load notifications', err);
        });
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  mounted() {
    this.fetchNotifications();
  }
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