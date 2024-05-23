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
    <DailyAgenda v-if="agendaAvailable" />
    <template v-else>
      <h1 class="text-h3 text-center">
        {{ $t('home.title') }}
      </h1>
      <p class="mt-10">
        {{ $t('home.p1') }}
      </p>
      <p class="mt-4">
        {{ $t('home.p2') }}
      </p>
    </template>
    <v-btn
      variant="text"
      size="x-small"
      class="home__photo-credit"
      @click="creditDialogOpen = true"
    >
      {{ $t('home.about') }}
    </v-btn>
  </div>
  <InfoDialog
    :show="creditDialogOpen"
    :title="$t('home.about')"
    style="max-width: 600px"
    class="home__info-dialog"
    @close="creditDialogOpen = false"
  >
    <template #content>
      <p>{{ $t('home.licenseText') }}</p>
      <p class="mt-4 text-h6">
        <v-icon icon="$github" />
        <a
          class="ml-2"
          target="_blank"
          noopener
          noreferrer
          href="https://www.github.com/ajuvonen/getfit"
          >GitHub</a
        >
      </p>
      <p class="mt-4">{{ $t('home.photoCredits') }}:</p>
      <ul>
        <li v-for="{name, link} in PHOTO_CREDITS" :key="name">
          <a :href="link" target="_blank" noreferrer noopener>{{ name }}</a>
        </li>
      </ul>
    </template>
  </InfoDialog>
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

.home__info-dialog {
  ul {
    list-style-type: none;
  }

  li {
    display: inline;
    + li {
      &::before {
        content: ', ';
      }
    }
  }

  a {
    color: inherit;
  }
}
</style>
