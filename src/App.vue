<script setup lang="ts">
import {RouterView} from 'vue-router';
</script>

<template>
  <v-app :full-height="true">
    <v-container>
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

<style scoped></style>
