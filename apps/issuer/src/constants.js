import React from 'react'
import { Icon } from 'antd'
import moment from 'moment'

import sdg1 from 'static/images/SDGIcons/sdg1.png'
import sdg2 from 'static/images/SDGIcons/sdg2.png'
import sdg3 from 'static/images/SDGIcons/sdg3.png'
import sdg4 from 'static/images/SDGIcons/sdg4.png'
import sdg5 from 'static/images/SDGIcons/sdg5.png'
import sdg6 from 'static/images/SDGIcons/sdg6.png'
import sdg7 from 'static/images/SDGIcons/sdg7.png'
import sdg8 from 'static/images/SDGIcons/sdg8.png'
import sdg9 from 'static/images/SDGIcons/sdg9.png'
import sdg10 from 'static/images/SDGIcons/sdg10.png'
import sdg11 from 'static/images/SDGIcons/sdg11.png'
import sdg12 from 'static/images/SDGIcons/sdg12.png'
import sdg13 from 'static/images/SDGIcons/sdg13.png'
import sdg14 from 'static/images/SDGIcons/sdg14.png'
import sdg15 from 'static/images/SDGIcons/sdg15.png'
import sdg16 from 'static/images/SDGIcons/sdg16.png'
import sdg17 from 'static/images/SDGIcons/sdg17.png'

export const indicatorsMeasuring = {
  energy_generation: 'kWh',
  emission_avoidance: 'tCO2e',
  energy_performance: 'kWh/㎡',
  floor_area: '㎡'
}

export const indicators = {
  energy_generation: 'Energy Generation',
  emission_avoidance: 'Emission Avoidance',
  energy_performance: 'Energy Performance',
  miscellaneous: 'Miscellaneous'
}

export const energyConsumptionTitle = {
  electricity_consumption: 'Electricity',
  heating_consumption: 'Heating',
  cooling_consumption: 'Cooling',
  emissionFactor: 'Emission Factor',
  emission_factor_electricity: 'Emission Factor Electricity',
  emission_factor_heating: 'Emission Factor Heating',
  emission_factor_cooling: 'Emission Factor Cooling'
}

export const defaultSpecs = {
  impactReport: [
    {
      tuid: 'energy_generation',
      type: 'impactReport',
      name: 'Impact Spec',
      spec: {
        reportYear: {
          tuid: 'reportYear',
          index: 1,
          type: 'year',
          title: 'Report Year',
          isRequired: true,
          key: 'reportYear',
          startYear: moment().year()-5,
          endYear: moment().year(),
          aux: {
            pos: [0,0]
          }
        },
        documents: {
          tuid: 'documents',
          index: 2,
          type: 'upload',
          isRequired: false,
          title: 'Upload Report',
          key: 'documents',
          aux: {
            pos: [0,0]
          }
        },
        value: {
          tuid: 'value',
          index: 3,
          type: 'inputNumber',
          title: 'Value',
          key: 'value',
          unit: indicatorsMeasuring.energy_generation,
          isRequired: true,
          aux: {
            pos: [0,0]
          }
        }
      }
    },
    {
      tuid: 'energy_performance',
      type: 'impactReport',
      name: 'Impact Spec',
      spec: {
        reportYear: {
          tuid: 'reportYear',
          index: 1,
          type: 'year',
          startYear: moment().year()-5,
          endYear: moment().year(),
          title: 'Report Year',
          isRequired: true,
          key: 'reportYear',
          aux: {
            pos: [0,0]
          }
        },
        documents: {
          tuid: 'documents',
          index: 2,
          type: 'upload',
          isRequired: false,
          title: 'Upload Report',
          key: 'documents',
          aux: {
            pos: [0,0]
          }
        },
        total_consumption: {
          tuid: 'total_consumption',
          index: 3,
          type: 'inputNumber',
          title: 'Total Consumption',
          key: 'total_consumption',
          unit: indicatorsMeasuring.energy_consumption,
          isRequired: true,
          aux: {
            pos: [0,0]
          }
        },
        floor_area: {
          tuid: 'floor_area',
          index: 4,
          type: 'inputNumber',
          title: 'Floor Area',
          key: 'floor_area',
          unit: indicatorsMeasuring.floor_area,
          isRequired: true,
          aux: {
            pos: [0,0]
          }
        }
      }
    },
    {
      tuid: 'emission_avoidance',
      type: 'impactReport',
      name: 'Impact Spec',
      spec: {
        reportYear: {
          tuid: 'reportYear',
          index: 1,
          type: 'year',
          startYear: moment().year()-5,
          endYear: moment().year(),
          title: 'Report Year',
          isRequired: true,
          key: 'reportYear',
          aux: {
            pos: [0,0]
          }
        },
        documents: {
          tuid: 'documents',
          index: 2,
          type: 'upload',
          isRequired: false,
          title: 'Upload Report',
          key: 'documents',
          aux: {
            pos: [0,0]
          }
        },
        value:
        {
          tuid: 'value',
          index: 3,
          type: 'inputNumber',
          title: 'Value',
          key: 'value',
          unit: indicatorsMeasuring.emission_avoidance,
          isRequired: true,
          aux: {
            pos: [0,0]
          }
        }
      }
    },
    {
      tuid: 'miscellaneous',
      type: 'impactReport',
      name: 'Impact Spec',
      spec: {
        name: {
          tuid: 'name',
          index: 1,
          type: 'inputText',
          title: 'Name',
          key: 'name',
          isRequired: true,
          aux: {
            pos: [0,0]
          }
        },
        reportYear: {
          tuid: 'reportYear',
          index: 2,
          type: 'year',
          title: 'Report Year',
          isRequired: true,
          key: 'reportYear',
          startYear: moment().year()-5,
          endYear: moment().year(),
          aux: {
            pos: [0,0]
          }
        },
        documents: {
          tuid: 'documents',
          index: 3,
          type: 'upload',
          isRequired: false,
          title: 'Upload Report',
          key: 'documents',
          aux: {
            pos: [0,0]
          }
        }
      }
    }
  ],
  validationReport: [
    {
      tuid: 'FAFDF7257',
      type: 'validationReport',
      name: 'Certification',
      spec: {
        description: {
          tuid: 'description',
          index: 1,
          type: 'inputText',
          title: 'Certification description',
          isRequired: true,
          key: 'description',
          aux: {
            pos: [0,0]
          }
        },
        file: {
          tuid: 'file',
          index: 2,
          type: 'upload',
          title: 'File upload',
          isRequired: true,
          key: 'file',
          aux: {
            pos: [0,0]
          }
        }
      }
    }
  ]
}

export const statuses = [
  {
    name: 'pending',
    iconType: <Icon type="clock-circle" theme="outlined" style={{color: '#959EB3'}} />,
    color: '#39435B'
  },
  {
    name: 'delivered',
    iconType: <Icon type="check-circle" theme="filled" style={{color: '#123898'}} />,
    color: '#123898'
  }
]

export const categories = [
  'Renewable energy',
  'Energy efficiency',
  'Pollution prevention and control',
  'Sustainable management of living natural resources',
  'Terrestrial and aquatic biodiversity conservation',
  'Clean transportation',
  'Sustainable water management',
  'Climate change adaptation',
  'Eco-efficient products, production technologies and processes'
]

export const goals = [
  { text: 'SDG 1: No Poverty', logo: sdg1 },
  { text: 'SDG 2: Zero Hunger', logo: sdg2 },
  { text: 'SDG 3: Good Health and Well-Being for People', logo: sdg3 },
  { text: 'SDG 4: Quality Education', logo: sdg4 },
  { text: 'SDG 5: Gender Equality', logo: sdg5 },
  { text: 'SDG 6: Clean Water and Sanitation', logo: sdg6 },
  { text: 'SDG 7: Affordable and Clean Energy', logo: sdg7 },
  { text: 'SDG 8: Decent Work and Economic Growth', logo: sdg8 },
  { text: 'SDG 9: Industry, Innovation, and Infrastructure', logo: sdg9 },
  { text: 'SDG 10: Reducing Inequalities', logo: sdg10 },
  { text: 'SDG 11: Sustainable Cities and Communities', logo: sdg11 },
  { text: 'SDG 12: Responsible Consumption and Production', logo: sdg12 },
  { text: 'SDG 13: Climate Action', logo: sdg13 },
  { text: 'SDG 14: Life Below Water', logo: sdg14 },
  { text: 'SDG 15: Life on Land', logo: sdg15 },
  { text: 'SDG 16: Peace, Justice and Strong Institutions', logo: sdg16 },
  { text: 'SDG 17: Partnerships for the Goals', logo: sdg17 }
]

export const COLORS = ['#163B96', '#4E72C8', '#4E72C8', '#93AAFA', '#ADBEE8', '#ADBEE8']
export const REPORT_COLORS = ['#123898', '#EBEFF5']

export const regions = {
  europe: 'Europe',
  asia: 'Asia',
  africa: 'Africa',
  north_america: 'North America',
  south_america: 'South America',
  oceania: 'Oceania'
}
