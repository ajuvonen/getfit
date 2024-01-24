<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useAppStateStore} from '@/stores/appState';
import BaseDialog from '@/components/BaseDialog.vue';

const {confirmDialogOpen, confirmText, confirmAction} = storeToRefs(useAppStateStore());
</script>
<template>
  <BaseDialog
    :open="confirmDialogOpen"
    :use-full-screen="false"
    :title="$t('general.confirmTitle')"
  >
    <template #content>{{ confirmText }}</template>
    <template #actions>
      <v-btn
        color="primary"
        variant="outlined"
        prepend-icon="mdi-check"
        data-test-id="confirm-dialog-confirm-button"
        @click="confirmAction(), (confirmDialogOpen = false)"
        >{{ $t('general.confirm') }}</v-btn
      >
      <v-btn
        prepend-icon="mdi-close"
        data-test-id="confirm-dialog-cancel-button"
        @click="confirmDialogOpen = false"
        >{{ $t('general.cancel') }}</v-btn
      >
    </template>
  </BaseDialog>
</template>
