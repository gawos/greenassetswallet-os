import uuidv4 from 'uuid/v4'
import moment from 'moment'


import {ITEM_TYPES} from './constants'

export const GenerateFieldSpec = {
  [ITEM_TYPES.inputText] ({pos}={}){
    const tuid = uuidv4()
    return {
      tuid,
      type: ITEM_TYPES.inputText,
      key: tuid,
      isRequired: true,
      title: 'Text input',
      aux: {
        pos
      }
    }
  },
  [ITEM_TYPES.inputNumber]({pos}={}) {
    const tuid = uuidv4()
    return {
      tuid,
      type: ITEM_TYPES.inputNumber,
      key: tuid,
      isRequired: true,
      title: 'Number input',
      aux: {
        pos
      }
    }
  },
  [ITEM_TYPES.select]({pos}={}) {
    const tuid = uuidv4()
    return {
      tuid,
      type: ITEM_TYPES.select,
      key: tuid,
      isRequired: true,
      title: 'Select',
      options: [
        {key: 'sample', title: 'Sample'}
      ],
      aux: {
        pos
      }
    }
  },
  [ITEM_TYPES.date]({pos}={}) {
    const tuid = uuidv4()
    return {
      tuid,
      type: ITEM_TYPES.date,
      key: tuid,
      isRequired: true,
      title: 'Date',
      aux: {
        pos
      }
    }
  },
  [ITEM_TYPES.dateRange]({pos}={}) {
    const tuid = uuidv4()
    return {
      tuid,
      type: ITEM_TYPES.dateRange,
      key: tuid,
      isRequired: true,
      title: 'Date range',
      aux: { pos }
    }
  },
  [ITEM_TYPES.year]({pos}={}) {
    const tuid = uuidv4()
    return {
      tuid,
      type: ITEM_TYPES.year,
      key: tuid,
      isRequired: true,
      title: 'Year',
      startYear: moment().year()-5,
      endYear: moment().year(),
      options: [
        {key: 'sample', title: 'Sample'}
      ],
      aux: {pos}
    }
  },
  [ITEM_TYPES.upload]({pos}={}) {
    const tuid = uuidv4()
    return {
      tuid,
      type: ITEM_TYPES.upload,
      key: tuid,
      isRequired: true,
      title: 'Upload',
      aux: {pos}
    }
  },
  [ITEM_TYPES.radio]({pos}={}) {
    const tuid = uuidv4()
    return {
      tuid,
      type: ITEM_TYPES.radio,
      key: tuid,
      isRequired: true,
      title: 'Radio',
      options: [{
        key: 'sample_radio_1',
        title: 'Sample Radio 1'
      }, {
        key: 'sample_radio_2',
        title: 'Sample Radio 2'
      }],
      aux: {pos}
    }
  }
}
