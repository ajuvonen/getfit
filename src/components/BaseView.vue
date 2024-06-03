<script setup lang="ts">
import useScreen from '@/hooks/screen';

defineProps<{
  title: string;
  guide: string;
}>();

const {isLargeScreen, isDark} = useScreen();
</script>
<template>
  <v-card
    :color="isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.75)'"
    :rounded="!isLargeScreen ? 0 : 'rounded'"
  >
    <v-card-title class="d-print-none">
      <h1 class="text-h4">{{ title }}</h1>
    </v-card-title>
    <v-card-subtitle class="d-flex align-center d-print-none">
      <v-icon icon="$informationBoxOutline" />
      {{ guide }}
    </v-card-subtitle>
    <v-card-text>
      <slot name="content" />
    </v-card-text>
    <v-card-actions v-if="$slots.actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>
<style lang="scss" scoped>
.v-card {
  backdrop-filter: blur(5px);
}

.v-card-subtitle {
  text-wrap: wrap;
  gap: 1rem;
}

@media print {
  .v-card-text {
    padding: 0;
  }
}
</style>
