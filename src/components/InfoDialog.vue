<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog.vue';

defineProps<{
  open: boolean;
  title: string;
}>();

defineEmits(['close']);
</script>
<template>
  <BaseDialog :open="open" :use-full-screen="false" :title="title">
    <template #content>
      <slot name="content" />
    </template>
    <template #actions>
      <v-btn
        color="primary"
        prepend-icon="mdi-close"
        data-test-id="info-dialog-close-button"
        @click="$emit('close')"
        >{{ $t('general.close') }}</v-btn
      >
    </template>
  </BaseDialog>
</template>
