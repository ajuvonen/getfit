<script setup lang="ts">
withDefaults(
  defineProps<{
    tableTitle?: string;
    striped?: boolean;
  }>(),
  {
    tableTitle: '',
    striped: true,
  },
);
</script>
<template>
  <v-table
    class="print-view__table bg-transparent"
    :class="{'print-view__table--striped': striped}"
  >
    <template #top>
      <slot name="title"></slot>
      <h2 v-if="!$slots.title" class="text-h5">{{ tableTitle }}</h2>
    </template>
    <thead>
      <slot name="header"></slot>
    </thead>
    <tbody>
      <slot name="body"></slot>
    </tbody>
  </v-table>
</template>
<style scoped>
:deep(td) {
  vertical-align: top;
}

:deep(td:first-child),
:deep(td:last-child),
:deep(th:first-child),
:deep(th:last-child) {
  &:first-child {
    padding-left: 0;
    margin-left: 0;
  }
  &:last-child {
    padding-right: 0;
    margin-right: 0;
  }
}

@media screen {
  .print-view__table + .print-view__table {
    margin-top: 2rem;
  }
}

@media print {
  .print-view__table--striped {
    :deep(td:nth-child(even)),
    :deep(th:nth-child(even)) {
      background-color: #fafafa;
      print-color-adjust: exact !important;
    }
  }
  .print-view__table {
    page-break-after: always;
    break-after: page;
  }
}
</style>
