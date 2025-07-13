<template>
  <div v-if="visible" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content p-3">
        <div class="modal-header">
          <h5 class="modal-title">
            Notes for {{ student?.student_name || "Student" }}
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <div class="modal-body">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <div v-if="message" class="alert alert-success">{{ message }}</div>
          <div
            v-if="notes.length === 0 && !loading"
            class="alert alert-info text-center"
          >
            No notes yet.
          </div>

          <ul class="list-group mb-3">
            <li
              v-for="(note, idx) in notes"
              :key="note.id || idx"
              class="list-group-item d-flex justify-content-between align-items-start"
            >
              <div class="me-2">
                <p class="mb-1 fw-bold">
                  {{ note.meeting_date || note.created_at }}
                </p>
                <p class="mb-0 text-sm">{{ note.note }}</p>
              </div>
              <button
                class="btn btn-sm btn-danger p-1"
                :disabled="loading"
                title="Delete note"
                @click="deleteNote(note.id)"
              >
                <a class="p-1 text-white">X</a>
              </button>
            </li>
          </ul>

          <select v-model="selectedCourseId" class="form-select mb-2">
            <option disabled value="">Select course</option>
            <option
              v-for="course in courses"
              :key="course.id"
              :value="course.id"
            >
              {{ course.course_code }} - {{ course.course_name }}
            </option>
          </select>

          <textarea
            v-model="newNote"
            class="form-control mb-2"
            rows="3"
            placeholder="Add a new note..."
          ></textarea>

          <input
            v-model="meetingDate"
            type="date"
            class="form-control mb-3"
          />

          <button
            class="btn btn-primary w-100"
            :disabled="!newNote.trim() || loading || !selectedCourseId"
            @click="saveNote"
          >
            <span v-if="loading">Adding...</span>
            <span v-else>Add Note</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";

// Props
const props = defineProps({
  visible: { type: Boolean, required: true },
  student: { type: Object, default: null },
  advisor_id: { type: [String, Number], required: true },
});

const notes = ref([]);
const newNote = ref("");
const meetingDate = ref(new Date().toISOString().slice(0, 10));
const loading = ref(false);
const error = ref("");
const message = ref("");

const courses = ref([]);
const selectedCourseId = ref("");

async function loadCourses() {
  if (!props.student?.student_id) {
    courses.value = [];
    selectedCourseId.value = "";
    return;
  }
  const res = await fetch(
    `/api/advisor/student-courses?student_id=${encodeURIComponent(props.student.student_id)}`,
  );
  if (res.ok) {
    courses.value = await res.json();
    if (courses.value.length > 0) {
      selectedCourseId.value = courses.value[0].id;
    } else {
      selectedCourseId.value = "";
    }
  } else {
    courses.value = [];
    selectedCourseId.value = "";
  }
}

async function loadNotes() {
  loading.value = true;
  error.value = "";
  try {
    if (!props.student?.student_id) {
      notes.value = [];
      return;
    }
    const res = await fetch(
      `/api/advisor/notes?student_id=${encodeURIComponent(props.student.student_id)}`,
    );
    if (res.ok) {
      notes.value = await res.json();
    } else {
      error.value = "Failed to load notes.";
    }
  } catch (err) {
    error.value = "Error loading notes.";
    console.error("Failed to load notes", err);
  } finally {
    loading.value = false;
  }
}

async function saveNote() {
  message.value = "";
  error.value = "";
  loading.value = true;
  try {
    const matric_number = props.student.student_id;
    const course_id = selectedCourseId.value;
    if (!course_id) {
      error.value = "Please select a course.";
      loading.value = false;
      return;
    }
    const payload = {
      note: newNote.value,
      meeting_date: meetingDate.value,
    };
    const res = await fetch(
      `/api/advisor/notes-by-matric/${encodeURIComponent(matric_number)}/${encodeURIComponent(course_id)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      },
    );
    const data = await res.json();
    if (res.ok && data.success) {
      message.value = "Note added successfully!";
      newNote.value = "";
      await loadNotes();
    } else {
      error.value = data.error || "Failed to add note.";
    }
  } catch (err) {
    error.value = "Error occurred while adding note.";
    console.error("Error saving note:", err);
  } finally {
    loading.value = false;
  }
}

async function deleteNote(noteId) {
  if (!noteId) return;
  if (!confirm("Are you sure you want to delete this note?")) return;
  loading.value = true;
  error.value = "";
  message.value = "";
  try {
    const res = await fetch(`/api/advisor/notes/${noteId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok && data.success) {
      message.value = "Note deleted.";
      await loadNotes();
    } else {
      error.value = data.error || "Failed to delete note.";
    }
  } catch (err) {
    error.value = "Error deleting note.";
    console.error("Error deleting note:", err);
  } finally {
    loading.value = false;
  }
}

// Auto-load notes and courses when modal is shown or student changes
watch(
  () => [props.visible, props.student?.student_id],
  ([visible, student_id]) => {
    if (visible && student_id) {
      loadNotes();
      loadCourses();
    }
  },
);

const emit = defineEmits(["close"]);
function close() {
  newNote.value = "";
  error.value = "";
  message.value = "";
  loading.value = false;
  notes.value = [];
  meetingDate.value = new Date().toISOString().slice(0, 10);
  courses.value = [];
  selectedCourseId.value = "";
  // Emit close event
  emit("close");
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-dialog {
  background: #fff;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
}
.btn-close {
  background: none;
  border: none; /* should be none, not 'thin' */
  font-size: 1.5rem;
  line-height: 0;
  cursor: pointer;
  color: #000; /* add color so it's visible */
}

.btn-close::before {
  content: "x"; /* this shows the 'X' */
  display: inline-block;
}
</style>
