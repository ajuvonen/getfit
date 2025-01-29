<script setup lang="ts">
import useScreen from '@/hooks/screen';

withDefaults(
  defineProps<{
    show: boolean;
    title: string;
    useFullScreen?: boolean;
  }>(),
  {
    useFullScreen: true,
  },
);

const {isSmallScreen} = useScreen();
</script>
<template>
  <v-dialog
    :model-value="show"
    :width="!isSmallScreen ? 'auto' : undefined"
    :fullscreen="useFullScreen && isSmallScreen"
    :transition="isSmallScreen ? 'dialog-bottom-transition' : false"
    :min-width="!isSmallScreen ? 500 : undefined"
    persistent
  >
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <slot name="content" />
      </v-card-text>
      <v-card-actions><slot name="actions" /></v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style scoped></style>
