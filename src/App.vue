<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {RouterView} from 'vue-router';
import {useI18n} from 'vue-i18n';
import useScreenSize from '@/hooks/screenSize';
import {useScheduleStore} from '@/stores/schedule';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const {weeks} = storeToRefs(useScheduleStore());
const {isSmallScreen} = useScreenSize();
const {t} = useI18n();
</script>

<template>
  <v-app :full-height="true">
    <div class="app__overlay">
      <v-app-bar class="d-print-none text-white app-bar">
        <template #prepend>
          <RouterLink to="/" :aria-label="$t('routes.home')" data-test-id="app-bar-home-link">
            <v-icon icon="mdi-home" color="white" />
          </RouterLink>
        </template>
        <template #append>
          <v-icon icon="mdi-earth" />
          <v-btn
            v-for="locale in $i18n.availableLocales"
            :key="locale"
            :data-test-id="`app-bar-locale-${locale}-button`"
            variant="tonal"
            class="ml-2"
            @click="$i18n.locale = locale"
            >{{ locale.toUpperCase() }}</v-btn
          >
        </template>
      </v-app-bar>
      <v-container :class="{'px-0': isSmallScreen}">
        <v-main :scrollable="true">
          <RouterView />
        </v-main>
      </v-container>
      <v-bottom-navigation grow class="d-print-none">
        <v-btn to="settings" data-test-id="navbar-settings-link" class="text-body-1">
          <v-icon icon="mdi-cog" />
          {{ t('routes.settings') }}
        </v-btn>
        <v-btn to="schedule" data-test-id="navbar-schedule-link" class="text-body-1">
          <v-icon icon="mdi-calendar" />
          {{ t('routes.schedule') }}
        </v-btn>
        <v-btn
          :disabled="!weeks.length"
          to="export"
          data-test-id="navbar-export-link"
          class="text-body-1"
        >
          <v-icon icon="mdi-export" />
          {{ t('routes.export') }}
        </v-btn>
      </v-bottom-navigation>
    </div>
    <ConfirmDialog />
  </v-app>
</template>
<style lang="scss" scoped>
.app__overlay {
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  inset: 0;
}

.app-bar {
  background: transparent !important;
  box-shadow: none !important;
}

.v-container {
  position: relative;
  height: 100%;
}

.v-application {
  background-image: url('/frontpage.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

@media print {
  .v-main {
    padding: 0;
  }

  .v-container {
    margin: 0;
    padding: 0;
  }

  :deep(.v-main__scroller) {
    overflow: visible !important;
  }
}
</style>
