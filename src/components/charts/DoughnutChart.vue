<script setup>
/* eslint-disable */
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  chartData: Object,
  options: Object
})
</script>

<template>
  <Doughnut :data="chartData" :options="options" />
</template>
