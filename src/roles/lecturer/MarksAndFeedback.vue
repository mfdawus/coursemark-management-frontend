<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Marks and Feedback</h2>
    <Tabs v-model="currentTab" default-value="coursework" class="w-full">
      <TabsList>
        <TabsTrigger value="coursework">Coursework Marks (70%)</TabsTrigger>
        <TabsTrigger value="final">Final Exam Marks (30%)</TabsTrigger>
        <TabsTrigger value="feedback">Feedback</TabsTrigger>
      </TabsList>

      <!-- Coursework Marks -->
      <TabsContent ref="courseworkSection" value="coursework">
        <Card>
          <CardContent>
            <table class="w-full table-auto border">
              <thead>
                <tr class="bg-gray-100">
                  <th class="p-2 border">Student Name</th>
                  <th class="p-2 border">Assignment</th>
                  <th class="p-2 border">Quiz</th>
                  <th class="p-2 border">Project</th>
                  <th class="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in students" :key="student.id">
                  <td class="p-2 border">{{ student.name }}</td>
                  <td class="p-2 border">
                    <input
                      v-model.number="student.assignment"
                      type="number"
                      class="input"
                      max="100"
                    />
                  </td>
                  <td class="p-2 border">
                    <input
                      v-model.number="student.quiz"
                      type="number"
                      class="input"
                      max="100"
                    />
                  </td>
                  <td class="p-2 border">
                    <input
                      v-model.number="student.project"
                      type="number"
                      class="input"
                      max="100"
                    />
                  </td>
                  <td class="p-2 border">
                    <Button @click="saveCoursework(student)">Save</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Final Exam Marks -->
      <TabsContent ref="finalSection" value="final">
        <Card>
          <CardContent>
            <table class="w-full table-auto border">
              <thead>
                <tr class="bg-gray-100">
                  <th class="p-2 border">Student Name</th>
                  <th class="p-2 border">Final Exam</th>
                  <th class="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in students" :key="student.id">
                  <td class="p-2 border">{{ student.name }}</td>
                  <td class="p-2 border">
                    <input
                      v-model.number="student.finalExam"
                      type="number"
                      class="input"
                      max="100"
                    />
                  </td>
                  <td class="p-2 border">
                    <Button @click="saveFinalExam(student)">Save</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Feedback -->
      <TabsContent ref="feedbackSection" value="feedback">
        <Card>
          <CardContent>
            <div v-for="student in students" :key="student.id" class="mb-4">
              <h4 class="font-semibold">{{ student.name }}</h4>
              <textarea
                v-model="student.feedback"
                class="w-full p-2 border rounded"
                rows="3"
              ></textarea>
              <div class="mt-2">
                <Button @click="saveFeedback(student)">Save Feedback</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const currentTab = ref("coursework");

const courseworkSection = ref(null);
const finalSection = ref(null);
const feedbackSection = ref(null);

const students = ref([
  {
    id: 1,
    name: "Ali Bin Ahmad",
    assignment: 0,
    quiz: 0,
    project: 0,
    finalExam: 0,
    feedback: "",
  },
  {
    id: 2,
    name: "Siti Nur Aisyah",
    assignment: 0,
    quiz: 0,
    project: 0,
    finalExam: 0,
    feedback: "",
  },
  {
    id: 3,
    name: "Tan Wei Jie",
    assignment: 0,
    quiz: 0,
    project: 0,
    finalExam: 0,
    feedback: "",
  },
]);

watch(currentTab, (newTab) => {
  setTimeout(() => {
    if (newTab === "coursework" && courseworkSection.value?.$el) {
      courseworkSection.value.$el.scrollIntoView({ behavior: "smooth" });
    } else if (newTab === "final" && finalSection.value?.$el) {
      finalSection.value.$el.scrollIntoView({ behavior: "smooth" });
    } else if (newTab === "feedback" && feedbackSection.value?.$el) {
      feedbackSection.value.$el.scrollIntoView({ behavior: "smooth" });
    }
  }, 100); // slight delay to ensure DOM updates
});

function saveCoursework(student) {
  console.log("Saved coursework marks:", student);
}

function saveFinalExam(student) {
  console.log("Saved final exam marks:", student);
}

function saveFeedback(student) {
  console.log("Saved feedback:", student);
}
</script>

<style scoped>
.input {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 4px 8px;
  width: 100%;
}
</style>
