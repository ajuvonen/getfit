<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import {Pie} from 'vue-chartjs';
import {groupBy, prop} from 'remeda';
import {useScheduleStore} from '@/stores/schedule';
import {useAppStateStore} from '@/stores/appState';
import {COLORS} from '@/constants';
import {Intensity} from '@/types';
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
  const trainings = groupBy(getAllTrainings.value, prop('intensity'));
  const colors: string[] = [];
  if (trainings[Intensity.LIGHT]) colors.push(COLORS.intensityLight);
  if (trainings[Intensity.NORMAL]) colors.push(COLORS.intensityNormal);
  if (trainings[Intensity.DEMANDING]) colors.push(COLORS.intensityDemanding);
  if (trainings[Intensity.HEAVY]) colors.push(COLORS.intensityHeavy);
  return {
    labels: Object.keys(trainings).map((key) => t(`intensities.${key}`)),
    datasets: [
      {
        data: Object.values(trainings).map(({length}) => length),
        backgroundColor: colors,
      },
    ],
  };
});

const chartOptions = computed(() =>
  getChartOptions<'pie'>(t('stats.trainingsByIntensity'), isDark.value),
);

defineExpose({chartData});
</script>
<template>
  <Pie
    v-if="!disableCharts"
    :options="chartOptions"
    :data="chartData"
    aria-describedby="intensity-chart-table"
  />
  <ChartScreenReaderTable
    id="intensity-chart-table"
    :title="t('stats.trainingsByIntensity')"
    :columnHeaders="chartData.labels"
    :data="[chartData.datasets[0].data]"
  />
</template>
