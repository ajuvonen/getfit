<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Line} from 'vue-chartjs';
import {prop} from 'remeda';
import {useScheduleStore} from '@/stores/schedule';
import {getChartOptions} from '@/utils';
import useScreen from '@/hooks/screen';
import useWeekDays from '@/hooks/weekdays';
import {COLORS} from '@/constants';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const {t} = useI18n();

const {weeks} = storeToRefs(useScheduleStore());

const {isDark} = useScreen();

const {getDisplayWeekNumber} = useWeekDays();

const chartData = computed(() => {
  const trainings: [string, number, number][] = weeks.value.map(({trainings}, index) => {
    const completedTrainings = trainings.filter(({completed}) => completed).length;
    return [
      t('weekCalendar.weekTitle', [getDisplayWeekNumber.value(index)]),
      trainings.length,
      completedTrainings,
    ];
  });

  return {
    labels: trainings.map(prop(0)),
    datasets: [
      {
        label: t('stats.totalTrainings'),
        data: trainings.map(prop(1)),
        borderColor: COLORS.chartColors[0],
        backgroundColor: COLORS.chartColors[0],
      },
      {
        label: t('stats.completedTrainings'),
        data: trainings.map(prop(2)),
        borderColor: COLORS.chartColors[5],
        backgroundColor: COLORS.chartColors[5],
      },
    ],
  };
});

const chartOptions = computed(() =>
  getChartOptions<'line'>(t('stats.weeklyTrainings'), isDark.value, true),
);

defineExpose({chartData});
</script>
<template>
  <Line
    :options="chartOptions"
    :data="chartData"
    data-test-id="weekly-trainings-chart"
    aria-describedby="weekly-trainings-chart-table"
  />
  <ChartScreenReaderTable
    id="weekly-trainings-chart-table"
    :title="$t('stats.weeklyTrainings')"
    :columnHeaders="chartData.labels"
    :rowHeaders="chartData.datasets.map(prop('label'))"
    :data="chartData.datasets.map(prop('data'))"
  />
</template>
