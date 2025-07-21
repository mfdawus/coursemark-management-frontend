<script setup>
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
 </script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.modal-box {
  background: white;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
}
</style>


<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card mb-4">
          <div class="card-header pb-0">
            <div class="card-header pb-0 d-flex justify-content-between align-items-center">
              <h4 class="mb-0">Users</h4>
              <button class="btn btn-sm btn-primary mt-4" @click="openAddModal">Add User</button>
            </div>
            <div class="mt-3">
              <input
                v-model="searchQuery"
                class="form-control"
                type="text"
                placeholder="Search by name, email, or matric number..."
                style="max-width: 300px"
              />
            </div>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 ps-4">#</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Name</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Email</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Matric</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Role</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Program</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Created At</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Updated At</th>
                    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(student, index) in filteredStudents" :key="student.id">
                    <td class="ps-4">{{ index + 1 }}</td>
                    <td>{{ student.name }}</td>
                    <td>{{ student.email }}</td>
                    <td>{{ student.matric_number }}</td>
                    <td>
                      <span class="badge bg-gradient-info text-white fs-7">{{ student.role }}</span>
                    </td>
                    <td>{{ student.program }}</td>
                    <td>{{ formatDate(student.created_at) }}</td>
                    <td>{{ formatDate(student.updated_at) }}</td>
                    <td>
                      <button class="btn btn-sm btn-success me-1" @click="openEditModal(student)">Details</button>
                      <button class="btn btn-sm btn-warning me-1" @click="openPasswordModal(student)">Password</button>
                    </td>
                  </tr>
                  <tr v-if="filteredStudents.length === 0">
                    <td colspan="8" class="text-center text-secondary py-3">No matching users found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-backdrop">
      <div class="modal-box card p-4">
        <h5 class="mb-3">Edit User Details</h5>

        <argon-input v-model="editForm.name" placeholder="Name" class="mb-3" />
        <argon-input v-model="editForm.email" placeholder="Email" class="mb-3" />

        <!-- Only show matric & program if role is student -->
        <template v-if="editForm.role === 'student'">
          <argon-input v-model="editForm.matric" placeholder="Matric Number" class="mb-3" />
          <argon-input v-model="editForm.program" placeholder="Program" class="mb-3" />
          <argon-input v-model="editForm.pin" placeholder="PIN" class="mb-3" />
        </template>

        <!-- Role selector -->
        <select v-model="editForm.role" class="form-select mb-3">
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
          <option value="admin">Admin</option>
          <option value="advisor">Advisor</option>
        </select>

        <div class="text-end">
          <argon-button color="secondary" class="me-2" @click="closeModals">Cancel</argon-button>
          <argon-button color="success" @click="saveUserDetails">Save</argon-button>
        </div>
      </div>
    </div>

    <!-- Password Modal -->
    <div v-if="showPasswordModal" class="modal-backdrop">
      <div class="modal-box card p-4">
        <h5 class="mb-3">Change Password</h5>
        <argon-input v-model="passwordForm.password" type="password" placeholder="New Password" class="mb-3" />
        <div class="text-end">
          <argon-button color="secondary" class="me-2" @click="closeModals">Cancel</argon-button>
          <argon-button color="warning" @click="updatePassword">Update</argon-button>
        </div>
      </div>
    </div>


    <!-- Add User Modal -->
    <div v-if="showAddModal" class="modal-backdrop">
      <div class="modal-box card p-4">
        <h5 class="mb-3">Add New User</h5>

        <argon-input v-model="addForm.name" placeholder="Name" class="mb-3" />
        <argon-input v-model="addForm.email" placeholder="Email" class="mb-3" />

        <!-- Only show if role is 'student' -->
        <template v-if="addForm.role === 'student'">
          <argon-input v-model="addForm.matric" placeholder="Matric Number" class="mb-3" />
          <argon-input v-model="addForm.program" placeholder="Program" class="mb-3" />
          <argon-input v-model="addForm.pin" type="text" placeholder="PIN" class="mb-3" />
        </template>

        <argon-input v-model="addForm.password" type="password" placeholder="Password" class="mb-3" />

        <select v-model="addForm.role" class="form-select mb-3">
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
          <option value="admin">Admin</option>
          <option value="advisor">Advisor</option>
        </select>

        <div class="text-end">
          <argon-button color="secondary" class="me-2" @click="closeModals">Cancel</argon-button>
          <argon-button color="primary" @click="submitNewUser">Add</argon-button>
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
      searchQuery: "",
      selectedStudents: [],
      showEditModal: false,
      showPasswordModal: false,
      editForm: {id: null,name: "", email: "", matric: "", program: "",pin:"", role: "student"},
      passwordForm: { id: null, password: "" },
      roleForm: { id: null, role: "" },
      showAddModal: false,
      addForm: {name: "", email: "", matric: "", program: "", password: "", role: "student"},

    };
  },
  computed: {
    filteredStudents() {
      const q = this.searchQuery.toLowerCase();

      return this.students.filter((s) =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.email || '').toLowerCase().includes(q) ||
        (s.matric_number || '').toLowerCase().includes(q) ||
        (s.program || '').toLowerCase().includes(q)
      );
    },
  },

  mounted() {
    this.fetchStudents();
  },
  methods: {
    fetchStudents() {
      fetch(`${process.env.VUE_APP_API_URL}/api/admin/users`, {
          credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
          this.students = data.students || [];

          this.$nextTick(() => {
            if ($.fn.dataTable.isDataTable("#userTable")) {
              $("#userTable").DataTable().destroy();
            }

            $("#userTable").DataTable({
              paging: true,
              searching: false,
              info: false,
              ordering: true,
              order: [[5, "desc"]],
            });
          });
        });
    },

    formatDate(dateStr) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    },

    // Modal openers
    openEditModal(student) {
      this.editForm = {
        id: student.id,
        name: student.name,
        email: student.email,
        matric: student.matric_number,
        program: student.program,
        pin: student.pin,
        role: student.role,
      };
      this.showEditModal = true;
    },
    openPasswordModal(student) {
      this.passwordForm = { id: student.id, password: "" };
      this.showPasswordModal = true;
    },

    // Close all modals
    closeModals() {
      this.showEditModal = false;
      this.showPasswordModal = false;
      this.showAddModal = false;
    },

    // Save updated user details
    saveUserDetails() {
      const form = { ...this.editForm };

      if (form.role !== 'student') {
        form.matric = null;
        form.program = null;
        form.pin = null;
      }

      fetch(`${process.env.VUE_APP_API_URL}/api/admin/users/${form.id}/details`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || "User updated.");
          this.fetchStudents(); // reload table
          this.closeModals();
        })
        .catch((err) => {
          alert("Failed to update user.");
          console.error(err);
        });
    },

    // Update password
    updatePassword() {
      fetch(`${process.env.VUE_APP_API_URL}/api/admin/users/${this.passwordForm.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: this.passwordForm.password }),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || "Password updated.");
          this.closeModals();
        })
        .catch((err) => {
          alert("Failed to update password.");
          console.error(err);
        });
    },

    // Change user role
    updateUserRole() {
      fetch(`${process.env.VUE_APP_API_URL}/api/admin/users/${this.roleForm.id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: this.roleForm.role }),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || "Role updated.");
          this.fetchStudents(); // refresh to reflect role change
          this.closeModals();
        })
        .catch((err) => {
          alert("Failed to update role.");
          console.error(err);
        });
    },

    openAddModal() {
      this.addForm = {
        name: "",
        email: "",
        matric: "",
        program: "",
        password: "",
        role: "student",
        pin: "",
      };
      this.showAddModal = true;
    },

    submitNewUser() {
      const form = { ...this.addForm };

      if (form.role !== "student") {
        form.matric = null;
        form.program = null;
        form.pin = null;
      }

      fetch(`${process.env.VUE_APP_API_URL}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || "User added.");
          this.fetchStudents(); // Refresh
          this.closeModals();
        })
        .catch((err) => {
          alert("Failed to add user.");
          console.error(err);
        });
    },

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
