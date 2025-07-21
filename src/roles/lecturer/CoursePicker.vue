<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Select Course for Remarks</h2>

    <div v-if="loaded">
      <ul>
        <li v-for="course in courses" :key="course.id" class="mb-2">
          <router-link
            class="text-blue-600 underline"
            :to="`/lecturer/remarks/${course.id}`"
          >
            {{ course.name }}
          </router-link>
        </li>
      </ul>
    </div>

    <div v-else class="text-center text-gray-500 mt-10">Loading courses...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const courses = ref([]);
const loaded = ref(false);

onMounted(async () => {
  const res = await fetch(`${process.env.VUE_APP_API_URL}/api/courses`, {
          credentials: "include",
        }) // adjust API if needed
  courses.value = await res.json();
  loaded.value = true;
});
</script>
