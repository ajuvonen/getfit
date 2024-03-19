<script lang="ts" setup>
import {nextTick, ref, watch} from 'vue';
import {VBtn} from 'vuetify/components';
import {useAppStateStore} from '@/stores/appState';
import type {Training} from '@/types';
import {getIntensityColor} from '@/utils';
import {COLORS} from '@/constants';

const props = defineProps<{
  training: Training;
  show: boolean;
}>();

const appStateStore = useAppStateStore();
const {toggleShowDescription} = appStateStore;

const closeButton = ref<VBtn | null>(null);

watch(() => props.show, async (value) => {
  if (value) {
    await nextTick();
    closeButton.value?.$el.focus();
  }
});
</script>
<template>
  <v-expand-transition>
    <v-card
      v-if="show"
      class="d-flex flex-column"
      style="height: 100%"
      :color="getIntensityColor(training.intensity)"
      :style="{
        color: COLORS.darkGrey,
      }"
    >
      <v-card-text>
        <div class="training-card__instructions">
          {{ training.description }}
        </div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          ref="closeButton"
          class="training-card__instructions__close-button"
          variant="flat"
          color="transparent"
          prepend-icon="mdi-close"
          @click="toggleShowDescription(training.id)"
          >{{ $t('general.close') }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-expand-transition>
</template>
<style lang="scss" scoped>
.v-card {
  bottom: 0;
  position: absolute;
  width: 100%;
  backdrop-filter: blur(5px);
}

.v-card-text {
  display: block;
  overflow: hidden;
  white-space: pre-wrap;
}

.training-card__instructions {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 7;
}
</style>
