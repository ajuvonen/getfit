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
  intensityLight: '#9ED99D',
  intensityNormal: '#FFD98C',
  intensityDemanding: '#FFB366',
  intensityHeavy: '#FF7F7A',
  lightGrey: '#3C3C3C',
  offWhite: '#FAFAFA',
};

export const PHOTO_CREDITS = [
  {name: 'Alexa Kozik', link: 'https://www.pexels.com/@alesiakozik/'},
  {name: 'Leo Zhao', link: 'https://www.pexels.com/@leozhao/'},
  {name: 'Andrea Piacquadio', link: 'https://www.pexels.com/@olly/'},
  {name: 'Chris Peeters', link: 'https://www.pexels.com/@krizz59/'},
  {name: 'cottonbro studio', link: 'https://www.pexels.com/@cottonbro/'},
  {name: 'Fede Roveda', link: 'https://www.pexels.com/@fede-roveda-1461538/'},
  {name: 'Flo Maderebner', link: 'https://www.pexels.com/@fmaderebner/'},
  {name: 'JD Manning', link: 'https://www.pexels.com/@jddaniel/'},
  {name: 'Mali Maeder', link: 'https://www.pexels.com/@mali/'},
  {name: 'Mikhail Nilov', link: 'https://www.pexels.com/@mikhail-nilov/'},
  {name: 'Oleksandr P', link: 'https://www.pexels.com/@freestockpro/'},
  {name: 'Pavel Danilyuk', link: 'https://www.pexels.com/@pavel-danilyuk/'},
  {name: 'Pixabay', link: 'https://www.pexels.com/@pixabay/'},
  {name: 'RDNE Stock Project', link: 'https://www.pexels.com/@rdne/'},
  {name: 'Victor Freitas', link: 'https://www.pexels.com/@victorfreitas/'},
];
