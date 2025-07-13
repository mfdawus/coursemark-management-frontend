<template>
  <div class="px-4 py-4">
    <!-- Page Header -->
    <div class="mb-4">
      <h2 class="text-white fw-bold mb-2"> My Marks</h2>
    </div>

    <!-- No Data -->
    <div v-if="marksByCourse.length === 0" class="alert alert-white text-center">
      No courses found or still loading...
    </div>

    <!-- Course Sections -->
    <div v-else class="row gy-4">
      <div
        v-for="course in marksByCourse"
        :key="course.course_id"
        class="col-12"
      >
        <div class="card shadow-sm border-0 rounded-2xl">
          <div class="card-body">
            <h5 class="card-title text-dark mb-3">
              {{ course.course_code }} – {{ course.course_name }}
            </h5>

            <!-- Table -->
            <div class="table-responsive">
              <table class="table table-bordered table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Assessment</th>
                    <th>Type</th>
                    <th class="text-center">Mark</th>
                    <th class="text-center">Weight (%)</th>
                    <th class="text-center">Weighted Mark</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="a in course.assessments"
                    :key="a.assessment_id"
                  >
                    <td>{{ a.title }}</td>
                    <td>{{ a.type }}</td>
                    <td class="text-center">
                      <span v-if="a.mark_obtained !== null">
                        {{ a.mark_obtained }} / {{ a.max_mark }}
                      </span>
                      <span v-else class="text-muted fst-italic">Not submitted</span>
                    </td>
                    <td class="text-center">
                      {{ a.weight !== null ? Number(a.weight).toFixed(2) : '-' }}
                    </td>
                    <td class="text-center">
                      {{ a.weighted_mark !== null ? Number(a.weighted_mark).toFixed(2) : '-' }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="">
                  <tr>
                    <td colspan="4" class="text-end fw-semibold">Final Exam</td>
                    <td class="text-center fw-bold text-primary">
                      {{
                        course.final_exam.final_mark !== null
                          ? Number(course.final_exam.final_mark).toFixed(2)
                          : '-'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4" class="text-end fw-semibold">Total Weighted</td>
                    <td class="text-center fw-bold text-success">
                      {{ course.total_weighted.toFixed(2) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      marksByCourse: [],
    };
  },
  mounted() {
    this.fetchMyMarks();
  },
  methods: {
    fetchMyMarks() {
      fetch("/api/student/mymarks")
        .then((res) => res.json())
        .then((data) => {
          this.marksByCourse = data;
        })
        .catch((err) => {
          alert("Failed to load marks.");
          console.error(err);
        });
    },
  },
};
</script>

<style scoped>
.my-marks {
  padding: 1.5rem;
}

.course-section {
  margin-top: 2rem;
  background-color: #fdfdfd;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.marks-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}

.marks-table th,
.marks-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

.marks-table th {
  background-color: #f0f0f0;
}

.text-muted {
  color: #999;
  font-style: italic;
}
</style>
