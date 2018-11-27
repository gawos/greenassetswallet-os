import React from 'react'
import {
  Form, Row, Col
} from 'antd'
import PropTypes from 'prop-types'
import {toJS} from 'mobx'

import cssClasses from './FieldsView.module.css'
import { FormFieldToUse } from './FormField'
/* REFACTOR THIS */


class FieldsView extends React.Component {
  render() {
    const { spec ,
      disabled,
      fieldsNamePrefix,
      ...formFieldProps
    } = this.props
    const leftSector = Object.values(spec).filter(field => field.aux.pos.toString() === [0,0].toString() )
    const rightSector = Object.values(spec).filter(field => field.aux.pos.toString() === [0,1].toString() )

    return (
      <div className={cssClasses.reportData}>
        <Row>
          <Col span={12}>
            <div style={{ flex: 1 }}>
              {leftSector.map(el => (
                <FormFieldToUse
                  disabled={disabled}
                  key={el.key}
                  fieldsNamePrefix={fieldsNamePrefix}
                  {...formFieldProps}
                  spec={el}
                />
              ))}
            </div>
          </Col>
          <div style={{ width: '10px' }} />
          <Col span={12} style={{ paddingLeft: '50px' }}>
            <div style={{ flex: 1 }}>
              {rightSector.map(el => (
                <FormFieldToUse
                  key={el.key}
                  disabled={disabled}
                  fieldsNamePrefix={fieldsNamePrefix}
                  {...formFieldProps}
                  spec={el}
                />
              ))}
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default FieldsView
