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
    value: 'meditation',
    icon: 'mdi-meditation',
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
];

export const DATE_FORMATS: {[key: string]: string} = {
  en: 'MM/dd/y',
  fi: 'd.M.y',
};

export const SHORT_DATE_FORMATS: {[key: string]: string} = {
  en: 'MM/dd',
  fi: 'd.M',
};