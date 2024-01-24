<script setup lang="ts">
import {useAppStateStore} from '@/stores/appState';
import {useScheduleStore} from '@/stores/schedule';
import type {Training} from '@/types';
import ActionMenuWeekGroup from '@/components/ActionMenuWeekGroup.vue';

defineProps<{
  training: Training;
}>();

const {deleteTraining} = useScheduleStore();

const {openEditTrainingDialog} = useAppStateStore();
</script>
<template>
  <v-card-actions class="flex-column align-stretch">
    <v-menu location="top center" :close-on-content-click="false">
      <template v-slot:activator="{props}">
        <v-btn
          :aria-label="$t('trainingCard.actionsLabel', training.activity)"
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
          @click="openEditTrainingDialog(training)"
        />
        <ActionMenuWeekGroup action="move" :training="training" />
        <ActionMenuWeekGroup action="copy" :training="training" />
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
