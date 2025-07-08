<script setup>
/* eslint-disable */
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const props = defineProps({
  chartData: Object,
  options: Object
})
</script>

<template>
  <Line :data="chartData" :options="options" />
</template>
