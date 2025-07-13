<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">

        <!-- Title -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="text-white mb-0">Enter Final Mark</h5>
        </div>

        <div v-if="loaded" class="card shadow-sm">
          <div class="card-body">

            <!-- Info Section -->
            <div class="mb-4">
              <p class="mb-1"><strong>Course:</strong> {{ courseName || 'N/A' }}</p>
              <p><strong>Student:</strong> {{ studentName || 'N/A' }} ({{ matricNumber || '-' }})</p>
            </div>

            <!-- Final Mark Input -->
            <div class="mb-3">
              <label class="form-label">Final Mark</label>
              <input
                v-model.number="finalMark"
                type="number"
                max="100"
                min="0"
                class="form-control"
              />
            </div>

            <!-- GPA Display -->
            <div class="mb-3">
              <label class="form-label">GPA</label>
              <input
                type="text"
                :value="gpaDisplay"
                disabled
                class="form-control bg-light"
              />
            </div>

            <!-- Final Exam Weight -->
            <div class="mb-3">
              <label class="form-label">Final Exam Weight (%, optional)</label>
              <input
                v-model.number="finalWeight"
                type="number"
                min="0"
                max="100"
                class="form-control"
              />
            </div>

            <!-- Summary -->
            <div class="mb-4">
              <p class="mb-1"><strong>Total assessment weight:</strong> {{ totalAssessmentWeight }}%</p>
              <p><strong>Remaining for final exam:</strong> {{ 100 - totalAssessmentWeight }}%</p>
            </div>

            <!-- Assessment Table -->
            <div class="mb-4">
              <h6 class="text-dark mb-2">Assessment Marks</h6>
              <div class="table-responsive">
                <table class="table align-items-center">
                  <thead class="bg-light">
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Max Mark</th>
                      <th>Weight (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="assessments.length === 0">
                      <td colspan="4" class="text-center text-muted py-3">
                        No assessments found.
                      </td>
                    </tr>
                    <tr v-for="assess in assessments" :key="assess.assessment_id">
                      <td>{{ assess.title }}</td>
                      <td>{{ assess.type }}</td>
                      <td>{{ assess.max_mark }}</td>
                      <td>{{ assess.weight }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="d-flex flex-wrap gap-2 mt-3 float-end">
              <button
                class="btn btn-success"
                :disabled="totalCombinedWeight > 100"
                @click="saveFinalMark"
              >
                Save
              </button>
              <button
                v-if="finalMark"
                class="btn btn-danger"
                @click="deleteFinalMark"
              >
                Delete
              </button>
              <button
                class="btn btn-primary"
                @click="downloadExcel"
              >
                Download Excel
              </button>
            </div>

            <!-- Weight Warning -->
            <div v-if="totalCombinedWeight > 100" class="mt-4 text-danger fw-semibold">
              ⚠ Total weight exceeds 100%! Adjust assessments or final weight.
            </div>
          </div>
        </div>

        <div v-else class="text-center text-muted mt-5">
          Loading...
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as XLSX from "xlsx";

const route = useRoute();
const router = useRouter();

const finalMark = ref(0);
const finalWeight = ref(0);
const gpa = ref(0);
const studentName = ref("");
const matricNumber = ref("");
const courseName = ref("");
const assessments = ref([]);
const loaded = ref(false);

const totalAssessmentWeight = computed(() =>
  assessments.value.reduce((sum, a) => sum + (Number(a.weight) || 0), 0),
);

const totalCombinedWeight = computed(
  () => totalAssessmentWeight.value + (finalWeight.value || 0),
);

const gpaDisplay = computed(() =>
  gpa.value !== null && gpa.value !== undefined
    ? Number(gpa.value).toFixed(2)
    : "-",
);

onMounted(async () => {
  try {
    const { course_id, student_id } = route.params;
    const res = await fetch(
      `/api/lecturer/final-exams/${course_id}/${student_id}`,
    );
    const data = await res.json();

    finalMark.value = data.final_mark ?? 0;
    gpa.value = data.gpa ?? 0;
    studentName.value = data.name || "";
    matricNumber.value = data.matric_number || "";
    courseName.value = data.course_name || "";
    assessments.value = data.assessments ?? [];
  } catch (err) {
    alert("Failed to load data. Check console.");
    console.error(err);
  } finally {
    loaded.value = true;
  }
});

async function saveFinalMark() {
  if (totalCombinedWeight.value > 100) {
    alert("Total weight exceeds 100%. Cannot save.");
    return;
  }

  const { course_id, student_id } = route.params;
  await fetch("/api/lecturer/final-exams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      course_id,
      student_id,
      final_mark: finalMark.value,
    }),
  });
  alert("Saved!");
  router.push("/lecturer/final-exams");
}

async function deleteFinalMark() {
  const { course_id, student_id } = route.params;
  await fetch(`/api/lecturer/final-exams/${course_id}/${student_id}`, {
    method: "DELETE",
  });
  alert("Deleted!");
  router.push("/lecturer/final-exams");
}

function downloadExcel() {
  const data = [
    { Label: "Course", Value: courseName.value },
    { Label: "Student", Value: `${studentName.value} (${matricNumber.value})` },
    { Label: "Final Mark", Value: finalMark.value },
    { Label: "GPA", Value: gpaDisplay.value },
    { Label: "Final Weight", Value: `${finalWeight.value}%` },
    {
      Label: "Total Assessments Weight",
      Value: `${totalAssessmentWeight.value}%`,
    },
    { Label: "Total Combined Weight", Value: `${totalCombinedWeight.value}%` },
  ];

  const assessmentData = assessments.value.map((a) => ({
    Title: a.title,
    Type: a.type,
    MaxMark: a.max_mark,
    Weight: `${a.weight}%`,
  }));

  const ws1 = XLSX.utils.json_to_sheet(data);
  const ws2 = XLSX.utils.json_to_sheet(assessmentData);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws1, "Summary");
  XLSX.utils.book_append_sheet(wb, ws2, "Assessments");

  XLSX.writeFile(wb, `Final_Exam_${studentName.value || "Student"}.xlsx`);
}
</script>
