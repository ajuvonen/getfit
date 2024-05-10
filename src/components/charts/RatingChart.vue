<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import {Pie} from 'vue-chartjs';
import {entries, groupBy, map, pipe, prop} from 'remeda';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import {getChartOptions} from '@/utils';
import useScreen from '@/hooks/screen';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.register(ArcElement, Legend, Tooltip, Title);

const {t} = useI18n();

const scheduleStore = useScheduleStore();
const {getAllTrainings} = storeToRefs(scheduleStore);

const {disableCharts} = storeToRefs(useAppStateStore());

const {isDark} = useScreen();

const chartData = computed(() => {
  const trainings = pipe(
    getAllTrainings.value,
    groupBy(({rating}) => (!rating ? 0 : rating)),
    entries,
    map(
      ([key, {length}]) =>
        [key === '0' ? t('stats.noRating') : `${key} ★`, length] as [string, number],
    ),
  );
  return {
    labels: trainings.map(prop(0)),
    datasets: [
      {
        data: trainings.map(prop(1)),
        backgroundColor: ['#EFF3FF', '#C6DBEF', '#9ECAE1', '#6BAED6', '#3182BD', '#08519C'],
      },
    ],
  };
});

const chartOptions = computed(() =>
  getChartOptions<'pie'>(t('stats.trainingsByRating'), isDark.value),
);

defineExpose({chartData});
</script>
<template>
  <Pie
    v-if="!disableCharts"
    :options="chartOptions"
    :data="chartData"
    aria-describedby="rating-chart-table"
  />
  <ChartScreenReaderTable
    id="rating-chart-table"
    :title="$t('stats.trainingsByRating')"
    :columnHeaders="chartData.labels"
    :data="[chartData.datasets[0].data]"
  />
</template>
