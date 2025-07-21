<template>
  <div class="ranking-page px-4 py-2">
  <!-- Title -->
  <h3 class="text-white fw-semibold mb-4">Student Rankings & Comparison</h3>

    <!-- Filter Card -->
    <div class="card mb-3 shadow-sm">
      <div class="card-body py-2 px-3">
        <div class="d-flex flex-wrap align-items-center gap-3">
          <label class="mb-0 small d-flex align-items-center gap-2">
            Semester:
            <select
              v-model="selectedSemester"
              class="form-select form-select-sm w-auto"
            >
              <option value="">All</option>
              <option v-for="sem in semesters" :key="sem" :value="sem">
                {{ sem }}
              </option>
            </select>
          </label>

          <label class="mb-0 small d-flex align-items-center gap-2">
            Year:
            <select
              v-model="selectedYear"
              class="form-select form-select-sm w-auto"
            >
              <option value="">All</option>
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </label>

          <label class="mb-0 small d-flex align-items-center gap-2">
            Course:
            <input
              v-model="courseSearchTerm"
              class="form-control form-control-sm"
              style="width: 200px"
              placeholder="Search course..."
            />
          </label>

          <label class="mb-0 small d-flex align-items-center gap-2">
            Student:
            <input
              v-model="searchTerm"
              class="form-control form-control-sm"
              style="width: 200px"
              placeholder="Search student name..."
            />
          </label>

          <button
            class="btn btn-sm btn-secondary ms-auto mt-2"
            @click="resetFilters"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
    <!-- No Result -->
    <div v-if="filteredRankings.length === 0" class="alert alert-warning">
      No courses found for selected filters.
    </div>

    <!-- Ranking Cards -->
    <div
      v-for="(course, index) in filteredRankings"
      :key="index"
      class="card shadow-sm border mb-4"
    >
      <div class="card-body">
        <h5 class="card-title mb-1">
          {{ course.course_code }} - {{ course.course_name }}
          <small v-if="course.semester && course.year" class="text-muted">
            ({{ course.semester }}, {{ course.year }})
          </small>
        </h5>
        <p class="text-muted mb-3">
          📊 <strong>Class Average:</strong> {{ course.class_average.toFixed(2) }}%<br />
          🧑‍🤝‍🧑 <strong>Total Students:</strong> {{ course.total_students }}
        </p>

        <div class="table-responsive">
          <table class="table table-bordered table-sm text-center align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Student Name</th>
                <th scope="col">Total Mark (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, idx) in filteredStudents(course.students)" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td class="text-start">{{ student.name }}</td>
                <td>{{ student.total_mark.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdvisorRankings",
  data() {
    return {
      rankings: [],
      selectedSemester: "",
      selectedYear: "",
      searchTerm: "",
      courseSearchTerm: "",
    };
  },
  computed: {
    semesters() {
      // Collect unique semesters from rankings
      const set = new Set(this.rankings.map((c) => c.semester).filter(Boolean));
      return Array.from(set).sort();
    },
    years() {
      // Collect unique years from rankings
      const set = new Set(this.rankings.map((c) => c.year).filter(Boolean));
      return Array.from(set).sort((a, b) => b - a);
    },
    filteredRankings() {
      return this.rankings.filter((course) => {
        const semMatch =
          !this.selectedSemester || course.semester == this.selectedSemester;
        const yearMatch =
          !this.selectedYear || course.year == this.selectedYear;
        const courseMatch =
          !this.courseSearchTerm ||
          course.course_name
            .toLowerCase()
            .includes(this.courseSearchTerm.toLowerCase()) ||
          course.course_code
            .toLowerCase()
            .includes(this.courseSearchTerm.toLowerCase());
        // If searching, only include courses with at least one matching student
        if (this.searchTerm) {
          const term = this.searchTerm.toLowerCase();
          const hasMatch = course.students.some((s) =>
            s.name.toLowerCase().includes(term),
          );
          return semMatch && yearMatch && courseMatch && hasMatch;
        }
        return semMatch && yearMatch && courseMatch;
      });
    },
  },
  mounted() {
    this.fetchRankings();
  },
  methods: {
    fetchRankings() {
      fetch(`${process.env.VUE_APP_API_URL}/api/advisor/rankings`, {
          credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
          this.rankings = data;
        })
        .catch((err) => {
          alert("Failed to load rankings.");
          console.error(err);
        });
    },
    filteredStudents(students) {
      if (!this.searchTerm) return students;
      const term = this.searchTerm.toLowerCase();
      return students.filter((s) => s.name.toLowerCase().includes(term));
    },
    resetFilters() {
      this.selectedSemester = "";
      this.selectedYear = "";
      this.searchTerm = "";
      this.courseSearchTerm = "";
    },
  },
};
</script>

<style scoped>
.ranking-page {
  padding: 1.5rem;
}

.filters {
  margin-bottom: 1rem;
}

.ranking-block {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.ranking-table th,
.ranking-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}
</style>
