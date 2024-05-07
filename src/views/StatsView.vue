<script lang="ts" setup>
import BaseView from '@/components/BaseView.vue';
import ActivityChart from '@/components/ActivityChart.vue';
import IntensityChart from '@/components/IntensityChart.vue';
import RatingChart from '@/components/RatingChart.vue';
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
    </template>
  </BaseView>
</template>
<style lang="scss" scoped>
.stats__chart {
  max-width: 400px;
  max-height: 400px;
}
</style>
