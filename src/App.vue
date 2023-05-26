<script setup lang="ts">
import {RouterView} from 'vue-router';
import {useI18n} from 'vue-i18n';
import useScreenSize from '@/hooks/screenSize';

const {isSmallScreen} = useScreenSize();
const {t} = useI18n();
</script>

<template>
  <v-app :full-height="true">
    <v-app-bar>
      <template #append>
        <v-icon icon="mdi-earth" />
        <v-btn
          v-for="locale in $i18n.availableLocales"
          :key="locale"
          :data-test-id="`app-bar-locale-${locale}-button`"
          variant="text"
          @click="$i18n.locale = locale"
          >{{ locale.toUpperCase() }}</v-btn
        >
      </template>
    </v-app-bar>
    <v-container :class="{'px-0': isSmallScreen, 'py-0': isSmallScreen}">
      <v-main>
        <RouterView />
      </v-main>
    </v-container>
    <v-bottom-navigation grow>
      <v-btn to="/" value="home" data-test-id="navbar-home-link">
        <v-icon icon="mdi-home" />
        {{ t('routes.home') }}
      </v-btn>
      <v-btn to="schedule" value="schedule" data-test-id="navbar-schedule-link">
        <v-icon icon="mdi-calendar" />
        {{ t('routes.schedule') }}
      </v-btn>
      <v-btn to="print" value="print" data-test-id="navbar-print-link">
        <v-icon icon="mdi-printer" />
        {{ t('routes.print') }}
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>
<style lang="scss" scoped>
@media print {
  header {
    display: none;
  }
}
</style>