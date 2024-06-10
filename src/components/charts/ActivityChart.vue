<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import {Pie} from 'vue-chartjs';
import {entries, groupBy, map, pipe, prop, sortBy, splitAt, sumBy} from 'remeda';
import {useScheduleStore} from '@/stores/schedule';
import {getChartOptions} from '@/utils';
import useScreen from '@/hooks/screen';
import {COLORS} from '@/constants';
import type {Training} from '@/types';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.register(ArcElement, Legend, Tooltip, Title);

const {t} = useI18n();

const scheduleStore = useScheduleStore();
const {getAllTrainings} = storeToRefs(scheduleStore);

const {isDark} = useScreen();

const chartData = computed(() => {
  // Pick first six activities, sorted by their popularity and name. Then group the rest.
  const trainings = pipe(
    getAllTrainings.value,
    groupBy(prop('activity')),
    entries<Record<string, Training[]>>,
    map(([key, {length}]) => [t(`activities.${key}`), length] as [string, number]),
    sortBy([prop(1), 'desc'], prop(0)),
    splitAt(6),
  );
  const labels = trainings[0].map(prop(0));
  if (trainings[1].length) {
    labels.push(t('stats.other'));
    trainings[0].push(['', sumBy(trainings[1], prop(1))]);
  }
  return {
    labels,
    datasets: [
      {
        data: trainings[0].map(prop(1)),
        backgroundColor: [...COLORS.chartColors],
      },
    ],
  };
});

const chartOptions = computed(() =>
  getChartOptions<'pie'>(t('stats.trainingsByActivity'), isDark.value),
);

defineExpose({chartData});
</script>
<template>
  <Pie :options="chartOptions" :data="chartData" aria-describedby="activity-chart-table" />
  <ChartScreenReaderTable
    id="activity-chart-table"
    :title="t('stats.trainingsByActivity')"
    :columnHeaders="chartData.labels"
    :data="[chartData.datasets[0].data]"
  />
</template>
