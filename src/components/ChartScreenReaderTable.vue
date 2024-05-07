<script lang="ts" setup>
defineProps<{
  id: string,
  title: string,
  labels: string[],
  data: number[],
}>();
</script>
<template>
  <table class="d-sr-only" :id="id">
    <caption>{{ title }}</caption>
    <thead>
      <tr>
        <th v-for="label in labels" :key="label">{{ label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td v-for="count in data" :key="count">{{ count }}</td>
      </tr>
    </tbody>
  </table>
</template>
