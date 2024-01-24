<script setup lang="ts">
import useScreenSize from '@/hooks/screenSize';

defineProps<{
  title: string;
  guide: string;
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
      <p class="d-flex align-center d-print-none mb-4">
        <v-icon icon="mdi-information-box-outline" />
        <span class="ml-4">{{ guide }}</span>
      </p>
      <slot name="content" />
    </v-card-text>
    <v-card-actions v-if="$slots.actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>