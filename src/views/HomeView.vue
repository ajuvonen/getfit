<script setup lang="ts">
import {computed, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {PHOTO_CREDITS} from '@/constants';
import {useScheduleStore} from '@/stores/schedule';
import InfoDialog from '@/components/InfoDialog.vue';
import DailyAgenda from '@/components/DailyAgenda.vue';

const scheduleStore = useScheduleStore();
const {weeks, settings} = storeToRefs(scheduleStore);

const creditDialogOpen = ref(false);

const agendaAvailable = computed(() => weeks.value.length && settings.value.startDate);
</script>

<template>
  <div class="home__overlay text-body-1 text-grey-lighten-5">
    <h1 class="text-h3 text-center">{{ $t(agendaAvailable ? 'home.dailyAgenda' : 'home.title') }}</h1>
    <DailyAgenda v-if="agendaAvailable" />
    <template v-else>
      <p class="mt-10">
        {{ $t('home.p1') }}
      </p>
      <p class="mt-4">
        {{ $t('home.p2') }}
      </p>
      <p class="mt-4">
        {{ $t('home.p3') }}
      </p>
    </template>
    <p class="mt-10">
      <v-icon icon="mdi-github" />
      <a class="text-grey-lighten-5 ml-2" href="https://www.github.com/ajuvonen/getfit">GitHub</a>
    </p>
    <v-btn
      variant="text"
      size="x-small"
      class="home__photo-credit"
      @click="creditDialogOpen = true"
    >
      {{ $t('home.credits') }}
    </v-btn>
    <InfoDialog
      :show="creditDialogOpen"
      :title="$t('home.credits')"
      @close="creditDialogOpen = false"
    >
      <template #content>
        <ul>
          <li v-for="{name, link} in PHOTO_CREDITS" :key="name">
            <a :href="link" noreferrer noopener>{{ name }}</a>
          </li>
        </ul>
      </template>
    </InfoDialog>
  </div>
</template>
<style lang="scss" scoped>
.home__overlay {
  position: absolute;
  inset: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
}

.home__photo-credit {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
}

ul {
  list-style-type: none;

  a {
    color: inherit;
  }
}
</style>
