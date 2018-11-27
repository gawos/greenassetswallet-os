import React from 'react'
import { Icon } from 'antd'

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

export const regions = {
  europe: 'Europe',
  asia: 'Asia',
  africa: 'Africa',
  north_america: 'North America',
  south_america: 'South America',
  oceania: 'Oceania'
}

export const indicators = {
  energy_generation: 'Energy Generation',
  emission_avoidance: 'Emission Avoidance',
  energy_performance: 'Energy Performance',
  miscellaneous: 'Miscellaneous'
}

export const indicatorsMeasuring = {
  energy_generation: 'kWh',
  emission_avoidance: 'tCO2e',
  energy_performance: 'kWh/㎡',
  floor_area: '㎡'
}

export const energy_consumption_names = {
  electricity: 'Electricity',
  cooling: 'Cooling',
  heating: 'Heating'
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

export const COLORS = ['#123898', '#4C70CB', '#7897E7', '#96ADE9', '#B8C9F5', '#ACBDEA']
export const REPORT_COLORS = ['#123898', '#EBEFF5']

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
