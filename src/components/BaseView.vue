<script setup lang="ts">
import useScreenSize from '@/hooks/screenSize';

defineProps<{
  title: string;
}>();

const {isSmallScreen, isMediumScreen} = useScreenSize();
</script>
<template>
  <v-card
    color="rgba(255,255,255,0.9)"
    class="mb-4"
    :rounded="isSmallScreen || isMediumScreen ? 0 : 'rounded'"
  >
    <v-card-title class="d-print-none">
      <h1 class="text-h4">{{ title }}</h1>
    </v-card-title>
    <v-card-text>
      <slot name="content" />
    </v-card-text>
    <v-card-actions v-if="$slots.actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>