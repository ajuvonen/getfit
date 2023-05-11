<script setup lang="ts">
import {RouterView} from 'vue-router';
import useScreenSize from './hooks/screenSize';
const {isSmallScreen} = useScreenSize();
</script>

<template>
  <v-app :full-height="true">
    <v-container :class="{'px-0': isSmallScreen, 'py-0': isSmallScreen}">
      <v-main>
        <RouterView />
      </v-main>
    </v-container>
    <v-bottom-navigation grow>
      <v-btn to="/" value="home" data-test-id="navbar-home-link">
        <v-icon icon="mdi-home" />
        Home
      </v-btn>
      <v-btn to="schedule" value="schedule" data-test-id="navbar-schedule-link">
        <v-icon icon="mdi-calendar" />
        Schedule
      </v-btn>
      <v-btn to="print" value="print" data-test-id="navbar-print-link">
        <v-icon icon="mdi-printer" />
        Print
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<style scoped>
/** Fix Vuetify 3.2.3 issue */
:deep(.v-chip) {
  flex-basis: initial;
  flex-grow: 0;
}
</style>
