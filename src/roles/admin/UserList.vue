<template>
  <div class="advisee-list-container">
    <h2 class="title">Users</h2>

    <!-- Search + Filters -->
    <div class="filters d-flex flex-wrap gap-3 mb-3">
      <input type="text" v-model="searchQuery" placeholder="Search by name, email, or matric..." class="form-control"
        style="max-width: 300px" />
    </div>

    <!-- Student Table -->
    <table id="userTable" class="table table-hover py-2">
      <thead class="table-dark">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Matric</th>
          <th>Role</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th>Select</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(student, index) in filteredStudents" :key="student.id">
          <td>{{ index + 1 }}</td>
          <td>{{ student.name }}</td>
          <td>{{ student.email }}</td>
          <td>{{ student.matric_number }}</td>
          <td>{{ student.role }}</td>
          <td>{{ formatDate(student.created_at) }}</td>
          <td>{{ formatDate(student.updated_at) }}</td>
          <td>
            <button class="btn btn-sm btn-primary me-2" @click="openEditModal(student)">Details</button>
            <button class="btn btn-sm btn-warning me-2" @click="openPasswordModal(student)">Password</button>
            <button class="btn btn-sm btn-info" @click="openRoleModal(student)">Role</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-backdrop">
      <div class="modal-box">
        <h5>Edit User Details</h5>
        <input v-model="editForm.name" class="form-control mb-2" placeholder="Name" />
        <input v-model="editForm.email" class="form-control mb-2" placeholder="Email" />
        <input v-model="editForm.matric" class="form-control mb-2" placeholder="Matric" />
        <div class="d-flex justify-content-end mt-3">
          <button class="btn btn-secondary me-2" @click="closeModals">Cancel</button>
          <button class="btn btn-success" @click="saveUserDetails">Save</button>
        </div>
      </div>
    </div>

    <!-- Password Modal -->
    <div v-if="showPasswordModal" class="modal-backdrop">
      <div class="modal-box">
        <h5>Change Password</h5>
        <input v-model="passwordForm.password" class="form-control mb-3" type="password" placeholder="New Password" />
        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary me-2" @click="closeModals">Cancel</button>
          <button class="btn btn-warning" @click="updatePassword">Update</button>
        </div>
      </div>
    </div>

    <!-- Role Modal -->
    <div v-if="showRoleModal" class="modal-backdrop">
      <div class="modal-box">
        <h5>Change Role</h5>
        <select v-model="roleForm.role" class="form-select mb-3">
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
          <option value="admin">Admin</option>
          <option value="advisor">Advisor</option>
        </select>
        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary me-2" @click="closeModals">Cancel</button>
          <button class="btn btn-info" @click="updateUserRole">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

/* global $ */

export default {
  data() {
    return {
      students: [],
      searchQuery: '',
      selectedStudents: [],
      showEditModal: false,
      showPasswordModal: false,
      showRoleModal: false,
      editForm: { id: null, name: '', email: '', matric: '' },
      passwordForm: { id: null, password: '' },
      roleForm: { id: null, role: '' },
    };
  },
  computed: {
    filteredStudents() {
      const q = this.searchQuery.toLowerCase();
      return this.students.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.matric_number.toLowerCase().includes(q)
      );
    },
  },
  methods: {
    fetchStudents() {
      fetch('/api/admin/users')
        .then(res => res.json())
        .then(data => {
          this.students = data.students || [];

          this.$nextTick(() => {
            if ($.fn.dataTable.isDataTable('#userTable')) {
              $('#userTable').DataTable().destroy();
            }

            $('#userTable').DataTable({
              paging: true,
              searching: false,
              info: false,
              ordering: true,
              order: [[5, 'desc']]
            });
          });
        });
    },


    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    },

    // Modal openers
    openEditModal(student) {
      this.editForm = {
        id: student.id,
        name: student.name,
        email: student.email,
        matric: student.matric_number,
      };
      this.showEditModal = true;
    },
    openPasswordModal(student) {
      this.passwordForm = { id: student.id, password: '' };
      this.showPasswordModal = true;
    },
    openRoleModal(student) {
      this.roleForm = { id: student.id, role: student.role };
      this.showRoleModal = true;
    },

    // Close all modals
    closeModals() {
      this.showEditModal = false;
      this.showPasswordModal = false;
      this.showRoleModal = false;
    },

    // Save updated user details
    saveUserDetails() {
      fetch(`/api/admin/users/${this.editForm.id}/details`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.editForm),
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || 'User updated.');
          this.fetchStudents();  // reload table
          this.closeModals();
        })
        .catch(err => {
          alert('Failed to update user.');
          console.error(err);
        });
    },

    // Update password
    updatePassword() {
      fetch(`/api/admin/users/${this.passwordForm.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: this.passwordForm.password }),
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || 'Password updated.');
          this.closeModals();
        })
        .catch(err => {
          alert('Failed to update password.');
          console.error(err);
        });
    },

    // Change user role
    updateUserRole() {
      fetch(`/api/admin/users/${this.roleForm.id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: this.roleForm.role }),
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || 'Role updated.');
          this.fetchStudents();  // refresh to reflect role change
          this.closeModals();
        })
        .catch(err => {
          alert('Failed to update role.');
          console.error(err);
        });
    },
  },
  mounted() {
    this.fetchStudents();
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}
</style>
