<script setup lang="ts">
import {watch} from 'vue';
import {storeToRefs} from 'pinia';
import {RouterView} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {useTheme} from 'vuetify';
import {useRegisterSW} from 'virtual:pwa-register/vue';
import useScreen from '@/hooks/screen';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import {COLORS} from '@/constants';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const {weeks, getTrainingsCount} = storeToRefs(useScheduleStore());
const {isSmallScreen, isDark} = useScreen();
const {t, locale} = useI18n();

const theme = useTheme();

const {openConfirmDialog} = useAppStateStore();

const {updateServiceWorker} = useRegisterSW({
  immediate: true,
  onNeedRefresh() {
    openConfirmDialog(t('general.updatePrompt'), () => updateServiceWorker());
  },
});

watch(
  isDark,
  (value) => {
    theme.global.name.value = value ? 'dark' : 'customLight';
  },
  {immediate: true},
);

watch(locale, (value) => {
  document.documentElement.lang = value;
});
</script>

<template>
  <v-app :full-height="true">
    <div class="app__overlay">
      <v-app-bar class="d-print-none app-bar" :style="{color: COLORS.offWhite}">
        <template #prepend>
          <v-btn
            to="/"
            icon="$home"
            :aria-label="$t('routes.home')"
            data-test-id="app-bar-home-link"
          >
          </v-btn>
          <v-btn
            v-if="getTrainingsCount"
            to="/stats"
            icon="$chartBar"
            :aria-label="$t('routes.stats')"
            data-test-id="app-bar-stats-link"
          >
          </v-btn>
        </template>
        <template #append>
          <v-icon icon="$earth" />
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
          <v-icon icon="$cog" />
          {{ $t('routes.settings') }}
        </v-btn>
        <v-btn to="schedule" data-test-id="navbar-schedule-link" class="text-body-1">
          <v-icon icon="$calendar" />
          {{ $t('routes.schedule') }}
        </v-btn>
        <v-btn
          :disabled="!weeks.length"
          to="export"
          data-test-id="navbar-export-link"
          class="text-body-1"
        >
          <v-icon icon="$export" />
          {{ $t('routes.export') }}
        </v-btn>
      </v-bottom-navigation>
    </div>
    <ConfirmDialog />
  </v-app>
</template>
<style lang="scss" scoped>
:global(html) {
  scrollbar-width: none;
  scrollbar-color: #fafafa transparent;
}

:global(ul) {
  list-style-type: none;
}

:global(.has-scroll) {
  scrollbar-width: thin;
}

:deep(.v-main__scroller) {
  scrollbar-width: thin;
}

.app__overlay {
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
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
    position: unset;
  }

  :deep(.v-application__wrap) {
    position: unset;
  }

  :deep(.v-main__scroller) {
    overflow: visible !important;
  }
}
</style>
