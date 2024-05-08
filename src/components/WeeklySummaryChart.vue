<script lang="ts" setup>
import {computed} from 'vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Bar} from 'vue-chartjs';
import {prop, sumBy} from 'remeda';
import {useScheduleStore} from '@/stores/schedule';
import {getChartOptions} from '@/utils';
import useScreen from '@/hooks/screen';
import useWeekDays from '@/hooks/weekdays';
import {COLORS} from '@/constants';
import ChartScreenReaderTable from '@/components/ChartScreenReaderTable.vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const {t} = useI18n();

const scheduleStore = useScheduleStore();
const {weeks} = storeToRefs(scheduleStore);

const {isDark} = useScreen();

const {getDisplayWeekNumber} = useWeekDays();

const chartData = computed(() => {
  const labels: string[] = [];
  const datasets = [
    {
      label: t('general.unitsOfDuration.h'),
      data: [] as number[],
      backgroundColor: COLORS.chartColors[0],
    },
    {
      label: t('general.unitsOfDuration.km'),
      data: [] as number[],
      backgroundColor: COLORS.chartColors[3],
    },
    {
      label: t('general.unitsOfDuration.mi'),
      data: [] as number[],
      backgroundColor: COLORS.chartColors[5],
    },
  ];

  weeks.value.forEach(({trainings}, index) => {
    labels.push(t('weekCalendar.weekTitle', [getDisplayWeekNumber.value(index)]));
    const hours = sumBy(trainings, ({unitOfDuration, duration}) =>
      unitOfDuration === 'h' ? duration : 0,
    );
    const minutes = sumBy(trainings, ({unitOfDuration, duration}) =>
      unitOfDuration === 'm' ? duration : 0,
    );
    const kilometers = sumBy(trainings, ({unitOfDuration, duration}) =>
      unitOfDuration === 'km' ? duration : 0,
    );
    const miles = sumBy(trainings, ({unitOfDuration, duration}) =>
      unitOfDuration === 'mi' ? duration : 0,
    );
    datasets[0].data.push(Math.round((hours + minutes / 60) * 4) / 4);
    datasets[1].data.push(kilometers);
    datasets[2].data.push(miles);
  });

  return {
    labels,
    datasets: datasets.filter(({data}) => data.some((value) => value)),
  };
});

const chartOptions = computed(() =>
  getChartOptions<'bar'>(t('stats.weeklySummary'), isDark.value, true),
);
</script>
<template>
  <Bar :options="chartOptions" :data="chartData" aria-describedby="weekly-summary-chart-table" />
  <ChartScreenReaderTable
    id="weekly-summary-chart-table"
    :title="$t('stats.weeklySummary')"
    :columnHeaders="chartData.labels"
    :rowHeaders="chartData.datasets.map(prop('label'))"
    :data="chartData.datasets.map(prop('data'))"
  />
</template>
