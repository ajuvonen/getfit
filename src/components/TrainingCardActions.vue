<script setup lang="ts">
import {nextTick, ref, watch} from 'vue';
import {VBtn} from 'vuetify/components';
import {useAppStateStore} from '@/stores/appState';
import {useScheduleStore} from '@/stores/schedule';
import type {Training} from '@/types';
import TrainingCardActionsMenuGroup from '@/components/TrainingCardActionsMenuGroup.vue';

const props = defineProps<{
  training: Training;
  disabled: boolean;
  simple: boolean;
}>();

const menuOpen = ref(false);

const {deleteTraining, toggleCompletion} = useScheduleStore();

const appStateStore = useAppStateStore();
const {openEditTrainingDialog, toggleShowInstructions} = appStateStore;

const openButton = ref<VBtn | null>(null);

watch(
  () => props.disabled,
  async (value) => {
    if (!value) {
      await nextTick();
      openButton.value?.$el.focus();
    }
  },
);
</script>
<template>
  <v-card-actions class="justify-end">
    <v-btn
      v-if="training.instructions"
      ref="openButton"
      :disabled="disabled"
      class="training-card__more-button"
      variant="flat"
      color="transparent"
      prepend-icon="mdi-information"
      @click="toggleShowInstructions(training.id)"
      >{{ $t('general.more') }}</v-btn
    >
    <v-btn
      v-if="simple"
      :prepend-icon="training.completed ? 'mdi-progress-alert' : 'mdi-progress-check'"
      :disabled="disabled"
      class="training-card__complete-button"
      @click="toggleCompletion(training)"
      >{{
        $t(
          !training.completed ? 'trainingCard.completeTraining' : 'trainingCard.uncompleteTraining',
        )
      }}</v-btn
    >
    <v-menu v-else v-model="menuOpen" location="top center" :close-on-content-click="false">
      <template v-slot:activator="{props}">
        <v-btn
          :aria-label="$t('trainingCard.actionsLabel', training.activity)"
          :disabled="disabled"
          color="transparent"
          prepend-icon="mdi-menu"
          variant="flat"
          v-bind="props"
          class="training-card__action-button"
        >
          {{ $t('trainingCard.actions') }}
        </v-btn>
      </template>
      <v-list open-strategy="single">
        <v-list-item
          :title="$t('trainingCard.editTraining')"
          prepend-icon="mdi-pen"
          class="training-card__edit-button"
          @click="openEditTrainingDialog(training), (menuOpen = false)"
        />
        <TrainingCardActionsMenuGroup action="move" :training="training" />
        <TrainingCardActionsMenuGroup action="copy" :training="training" />
        <v-list-item
          :title="
            !training.completed
              ? $t('trainingCard.completeTraining')
              : $t('trainingCard.uncompleteTraining')
          "
          :prepend-icon="training.completed ? 'mdi-progress-alert' : 'mdi-progress-check'"
          class="training-card__complete-button"
          @click="toggleCompletion(training), (menuOpen = false)"
        />
        <v-list-item
          :title="$t('trainingCard.deleteTraining')"
          prepend-icon="mdi-delete"
          class="text-error training-card__delete-button"
          @click="deleteTraining(training)"
        />
      </v-list>
    </v-menu>
  </v-card-actions>
</template>
