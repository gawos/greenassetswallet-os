import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Icon } from 'antd'
import PropTypes from 'prop-types'
import moment from 'moment'

//app modules
import CustomFieldsView from 'src/containers/FormBuilder/FieldsView'
import ReportData from './ReportData'
import ImpactReportCategory from './ImpactReportCategory'

import cssClasses from './Report.module.css'

@withRouter
class ReportCategory extends Component {
  static propTypes = {
    onRemove: PropTypes.func,
    data: PropTypes.object.isRequired
  }

  onCancel = async () => {
    const { data } = this.props
    this.props.onCancel(data.tuid)
  }

  render() {
    const { data } = this.props

    if (data.type === 'impactReport') {
      if (!data.certifications.length) {
        return null
      }
      return <ImpactReportCategory data={data} />
    } else {
      return <ValidationReportCategory data={data} />
    }
  }
}

export default ReportCategory

@withRouter
class ValidationReportCategory extends Component {
  static propTypes = {
    onRemove: PropTypes.func,
    data: PropTypes.object.isRequired
  }

  get getStatus() {
    const { data } = this.props
    switch (data.state) {
    case 'TO_REPORT':
      return (
        <div className={cssClasses.status}>
          <Icon
            type="clock-circle"
            theme="outlined"
            style={{ fontSize: '18px', color: '#99A1B5', marginRight: '5px' }}
          />
            Pending
        </div>
      )
    case 'CANCELED':
      return <div>Canceled</div>
    default:
      return <div>Validated</div>
    }
  }

  render() {
    const { data } = this.props
    const certification = data.certifications.length
      ? data.certifications[0]
      : null
    return (
      <div style={{ width: '100%' }}>
        <div className={cssClasses.reportName}>{data.aux.name}</div>
        <div className={cssClasses.infoContainer}>
          {data.validatedBy && (
            <div className={cssClasses.item}>
              <div className={cssClasses.title}>Validator</div>
              <div className={cssClasses.value}>
                {data.validatedBy.name}
              </div>
            </div>
          )}
          <div className={cssClasses.item}>
            <div className={cssClasses.title}>Created</div>
            <div className={cssClasses.value}>
              {moment(data.date).format('YYYY-MM-DD')}
            </div>
          </div>
          <div className={cssClasses.item}>
            <div className={cssClasses.title}>Status</div>
            <div className={cssClasses.value}>{this.getStatus}</div>
          </div>
        </div>
        <div className={cssClasses.item}>
          <div className={cssClasses.title}>Description</div>
          <div className={cssClasses.value}>{data.aux.description}</div>
        </div>
        <div className={cssClasses.item}>
          <div className={cssClasses.title}>Validation Commitment</div>
          <div className={cssClasses.value}>{data.commitment.commitment}</div>
        </div>
        <div className={`${cssClasses.certification} `}>
          {certification ? (
            <ReportData data={certification} />
          ) : (
            <div className="hoverDetector" style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  zIndex: '100',
                  cursor: 'not-allowed'
                }}
              />
              <div
                className="showOnHower"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  fontWeight: '700',
                  color: 'red',
                  textAlign: 'center',
                  paddingTop: '10px',
                  fontSize: '18px',
                  zIndex: '150',
                  cursor: 'not-allowed'
                }}
              >
                This form will be filled by a chosen validator
              </div>
              <div className={`${cssClasses.certification} `}>
                <CustomFieldsView
                  fieldsNamePrefix={'certificationSpec'}
                  disabled={true}
                  spec={Object.values(data)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}
