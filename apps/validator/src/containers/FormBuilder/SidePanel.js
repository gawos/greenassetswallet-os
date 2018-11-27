import React, { PureComponent } from 'react'

import { FormItemPrototype } from './FormField'
import PropTypes from 'prop-types'
import { ITEM_TYPES } from './constants'

class SidePanel extends PureComponent {
  render() {
    return (
      <div>
        <div style={{padding: '8px 0' }}>
          <FormItemPrototype
            spec={{ type: ITEM_TYPES.inputText  }}
          />
        </div>
        <div style={{padding: '8px 0' }}>
          <FormItemPrototype
            spec={{ type: ITEM_TYPES.inputNumber }}
          />
        </div>
        <div style={{padding: '8px 0' }}>
          <FormItemPrototype
            spec={{ type: ITEM_TYPES.select }}
          />
        </div>
        <div style={{padding: '8px 0' }}>
          <FormItemPrototype
            spec={{ type: ITEM_TYPES.radio }}
          />
        </div>
        <div style={{padding: '8px 0' }}>
          <FormItemPrototype
            spec={{ type: ITEM_TYPES.date }}
          />
        </div>
        <div style={{padding: '8px 0' }}>
          <FormItemPrototype
            spec={{ type: ITEM_TYPES.year }}
          />
        </div>
        <div style={{padding: '8px 0' }}>
          <FormItemPrototype
            spec={{ type: ITEM_TYPES.dateRange }}
          />
        </div>
        <div style={{padding: '8px 0' }}>
          <FormItemPrototype
            spec={{ type: ITEM_TYPES.upload}}
          />
        </div>
      </div>
    )
  }
}

export default SidePanel
