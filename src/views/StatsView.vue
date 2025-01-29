<script lang="ts" setup>
import BaseView from '@/components/BaseView.vue';
import ActivityChart from '@/components/charts/ActivityChart.vue';
import IntensityChart from '@/components/charts/IntensityChart.vue';
import RatingChart from '@/components/charts/RatingChart.vue';
import WeeklyTrainingsChart from '@/components/charts/WeeklyTrainingsChart.vue';
import WeeklySummaryChart from '@/components/charts/WeeklySummaryChart.vue';
</script>
<template>
  <BaseView :title="$t('routes.stats')" :guide="$t('stats.guide')">
    <template #content>
      <v-row justify="center" wrap>
        <v-col class="stats__chart">
          <ActivityChart />
        </v-col>
        <v-col class="stats__chart">
          <IntensityChart />
        </v-col>
        <v-col class="stats__chart">
          <RatingChart />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="stats__wide-chart">
          <WeeklyTrainingsChart />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="stats__wide-chart">
          <WeeklySummaryChart />
        </v-col>
      </v-row>
    </template>
  </BaseView>
</template>
<style scoped>
.stats__chart {
  max-width: 400px;
  max-height: 400px;
}

.stats__wide-chart {
  min-height: 300px;
}
</style>
