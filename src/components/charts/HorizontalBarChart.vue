<script setup>
/* eslint-disable */
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  chartData: Object,
  options: Object
})
</script>

<template>
  <Bar :data="chartData" :options="{ ...options, indexAxis: 'y' }" />
</template>
