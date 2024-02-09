import type {BaseActivity} from '@/types';

export const ACTIVITIES: BaseActivity[] = [
  {
    value: 'running',
    icon: 'mdi-run',
  },
  {
    value: 'skiing',
    icon: 'mdi-ski-cross-country',
  },
  {
    value: 'tennis',
    icon: 'mdi-tennis',
  },
  {
    value: 'badminton',
    icon: 'mdi-badminton',
  },
  {
    value: 'soccer',
    icon: 'mdi-soccer',
  },
  {
    value: 'maintenance',
    icon: 'mdi-yoga',
  },
  {
    value: 'downhill',
    icon: 'mdi-ski',
  },
  {
    value: 'gym',
    icon: 'mdi-dumbbell',
  },
  {
    value: 'basketball',
    icon: 'mdi-basketball',
  },
  {
    value: 'boxing',
    icon: 'mdi-boxing-glove',
  },
  {
    value: 'swimming',
    icon: 'mdi-swim',
  },
  {
    value: 'sprint',
    icon: 'mdi-run-fast',
  },
  {
    value: 'hockey',
    icon: 'mdi-hockey-sticks',
  },
  {
    value: 'martialarts',
    icon: 'mdi-karate',
  },
  {
    value: 'walking',
    icon: 'mdi-walk',
  },
  {
    value: 'cycling',
    icon: 'mdi-bike-fast',
  },
  {
    value: 'shooting',
    icon: 'mdi-bullseye-arrow',
  },
  {
    value: 'gymnastics',
    icon: 'mdi-gymnastics',
  },
  {
    value: 'skating',
    icon: 'mdi-skate',
  },
];

export const DATE_FORMATS: {[key: string]: string} = {
  en: 'MM/dd/y',
  fi: 'd.M.y',
};

export const SHORT_DATE_FORMATS: {[key: string]: string} = {
  en: 'MM/dd',
  fi: 'd.M',
};

export const WEEKDAYS = {
  sundayFirst: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
  mondayFirst: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
};

export const COLORS = {
  darkGrey: '#212121',
  intensityLight: '#6DBF79',
  intensityNormal: '#FFC300',
  intensityDemanding: '#FF8C00',
  intensityHeavy: '#FF6347',
  lightGrey: '#3C3C3C',
  offWhite: '#FAFAFA',
};
