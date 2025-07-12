<template>
  <div class="ranking-page">
    <h2>🏅 Student Rankings & Comparison</h2>

    <div class="filters mb-3 d-flex flex-wrap align-items-center gap-2">
      <label>
        Semester:
        <select v-model="selectedSemester" class="form-select d-inline-block w-auto ms-1">
          <option value="">All</option>
          <option v-for="sem in semesters" :key="sem" :value="sem">{{ sem }}</option>
        </select>
      </label>
      <label>
        Year:
        <select v-model="selectedYear" class="form-select d-inline-block w-auto ms-1">
          <option value="">All</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </label>
      <label>
        <input v-model="courseSearchTerm" class="form-control" style="width:200px;" placeholder="Search course..." />
      </label>
      <label>
        <input v-model="searchTerm" class="form-control" style="width:200px;" placeholder="Search student name..." />
      </label>
      <button class="btn btn-secondary ms-2" @click="resetFilters">Reset</button>
    </div>

    <div v-if="filteredRankings.length === 0">
      <p>No courses found for selected filters.</p>
    </div>

    <div v-for="(course, index) in filteredRankings" :key="index" class="ranking-block">
      <h3>{{ course.course_code }} - {{ course.course_name }} <span v-if="course.semester && course.year">({{ course.semester }}, {{ course.year }})</span></h3>
      <p>
        📊 Class Average: {{ course.class_average.toFixed(2) }}%<br>
        🧑‍🤝‍🧑 Total Students: {{ course.total_students }}
      </p>

      <table class="ranking-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Total Mark (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(student, idx) in filteredStudents(course.students)"
            :key="idx"
          >
            <td>{{ idx + 1 }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.total_mark.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdvisorRankings',
  data() {
    return {
      rankings: [],
      selectedSemester: '',
      selectedYear: '',
      searchTerm: '',
      courseSearchTerm: '',
    };
  },
  computed: {
    semesters() {
      // Collect unique semesters from rankings
      const set = new Set(this.rankings.map(c => c.semester).filter(Boolean));
      return Array.from(set).sort();
    },
    years() {
      // Collect unique years from rankings
      const set = new Set(this.rankings.map(c => c.year).filter(Boolean));
      return Array.from(set).sort((a, b) => b - a);
    },
    filteredRankings() {
      return this.rankings.filter(course => {
        const semMatch = !this.selectedSemester || course.semester == this.selectedSemester;
        const yearMatch = !this.selectedYear || course.year == this.selectedYear;
        const courseMatch = !this.courseSearchTerm ||
          course.course_name.toLowerCase().includes(this.courseSearchTerm.toLowerCase()) ||
          course.course_code.toLowerCase().includes(this.courseSearchTerm.toLowerCase());
        // If searching, only include courses with at least one matching student
        if (this.searchTerm) {
          const term = this.searchTerm.toLowerCase();
          const hasMatch = course.students.some(s => s.name.toLowerCase().includes(term));
          return semMatch && yearMatch && courseMatch && hasMatch;
        }
        return semMatch && yearMatch && courseMatch;
      });
    }
  },
  methods: {
    fetchRankings() {
      fetch('/api/advisor/rankings')
        .then(res => res.json())
        .then(data => {
          this.rankings = data;
        })
        .catch(err => {
          alert('Failed to load rankings.');
          console.error(err);
        });
    },
    filteredStudents(students) {
      if (!this.searchTerm) return students;
      const term = this.searchTerm.toLowerCase();
      return students.filter(s => s.name.toLowerCase().includes(term));
    },
    resetFilters() {
      this.selectedSemester = '';
      this.selectedYear = '';
      this.searchTerm = '';
      this.courseSearchTerm = '';
    }
  },
  mounted() {
    this.fetchRankings();
  }
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