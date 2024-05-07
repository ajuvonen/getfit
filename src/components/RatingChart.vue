<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import {Pie} from 'vue-chartjs';
import {entries, groupBy, map, pipe, prop} from 'remeda';
import {useScheduleStore} from '@/stores/schedule';
import {getChartTitleOptions} from '@/utils';
import useScreen from '@/hooks/screen';
import {COLORS} from '@/constants';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.register(ArcElement, Legend, Tooltip, Title);

const {t} = useI18n();

const scheduleStore = useScheduleStore();
const {getAllTrainings} = storeToRefs(scheduleStore);

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
        backgroundColor: [...COLORS.chartColors],
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  ...getChartTitleOptions<'pie'>(t('stats.trainingsByRating'), isDark.value),
}));
</script>
<template>
  <Pie :options="chartOptions" :data="chartData" aria-describedby="rating-chart-table" />
  <ChartScreenReaderTable
    id="rating-chart-table"
    :title="$t('stats.trainingsByRating')"
    :labels="chartData.labels"
    :data="chartData.datasets[0].data"
  />
</template>
