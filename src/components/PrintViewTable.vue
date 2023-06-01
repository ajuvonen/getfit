<script setup lang="ts">
defineProps<{
  tableTitle: string;
}>();
</script>
<template>
  <v-table class="print-view__table">
    <template #top>
      <h2 class="text-h5 pl-4">{{ tableTitle }}</h2>
    </template>
    <thead>
      <slot name="header"></slot>
    </thead>
    <tbody>
      <slot name="body"></slot>
    </tbody>
  </v-table>
</template>
<style lang="scss">
@media print {
  .print-view__table {
    page-break-after: always;
    break-after: page;
    height: 100vh;
  }
}
</style>
