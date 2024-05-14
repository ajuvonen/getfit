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
<style lang="scss" scoped>
:deep(td) {
  vertical-align: top;
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
