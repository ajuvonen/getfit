<script setup lang="ts">
defineProps<{
  tableTitle?: string;
}>();
</script>
<template>
  <v-table class="print-view__table bg-transparent">
    <template #top>
      <slot name="title"></slot>
      <h2 v-if="!$slots.title" class="text-h5 ml-4">{{ tableTitle }}</h2>
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
@media screen {
  .print-view__table + .print-view__table {
    margin-top: 2rem;
  }
}

@media print {
  .print-view__table {
    min-height: 97vh;
    page-break-after: always;
    break-after: page;
  }
}
</style>
