import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Icon } from 'antd'
import PropTypes from 'prop-types'
import moment from 'moment'

//app modules
import config from 'config/index'
import CustomFieldsView from 'src/containers/FormBuilder/FieldsView'
import ReportData from './ReportData'

import cssClasses from './Report.module.css'

const { api } = config
const indicators = [
  {
    id: 'energy_generation',
    name: 'Energy generation (kWh)'
  },
  {
    id: 'energy_consumption',
    name: 'Energy consumption (kWh)'
  },
  {
    id: 'emission_avoidance',
    name: 'Emission avoidance (tonnes of CO2e)'
  }
]

@withRouter
class ReportCategory extends Component {
  static propTypes = {
    onRemove: PropTypes.func,
    data: PropTypes.object.isRequired,
    onCancel: PropTypes.func
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
class ImpactReportCategory extends Component {
  static propTypes = {
    onRemove: PropTypes.func,
    data: PropTypes.object.isRequired
  }

  get getImpactValues() {
    const { data } = this.props
    const indicator = data.aux.report_metadata_json.indicator

    if (indicator === 'energy_consumption') {
      const electricity = data.certifications[0].find(({ tuid }) => tuid === 'electricity_consumption').value.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ')
      const heating = data.certifications[0].find(({ tuid }) => tuid === 'heating_consumption').value.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ')
      const cooling = data.certifications[0].find(({ tuid }) => tuid === 'cooling_consumption').value.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ')
      return (
        <Fragment>
          <div className={cssClasses.item}>
            <div className={cssClasses.title}>Electricity</div>
            <div className={cssClasses.value}>{electricity}</div>
          </div>
          <div className={cssClasses.item}>
            <div className={cssClasses.title}>Heating</div>
            <div className={cssClasses.value}>{heating}</div>
          </div>
          <div className={cssClasses.item}>
            <div className={cssClasses.title}>Cooling</div>
            <div className={cssClasses.value}>{cooling}</div>
          </div>
        </Fragment>
      )
    } else {
      const valueCertification = data.certifications[0].find(({ tuid }) => tuid === 'value')
      const value = valueCertification.value.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ')

      return (
        <Fragment>
          <div className={cssClasses.item}>
            <div className={cssClasses.title}>Value</div>
            <div className={cssClasses.value}>{value}</div>
          </div>
        </Fragment>
      )

    }
  }

  render() {
    const { data } = this.props

    const indicator = indicators.find(({ id }) => id === data.aux.report_metadata_json.indicator)
    const name = indicator ? indicator.name : data.aux.name || 'IMPACT REPORT'
    const reportYearString = data.certifications[0].find(({ tuid }) => tuid === 'reportYear').value

    const documentsIndex = data.certifications[0].findIndex(({ tuid }) => tuid === 'documents')
    const documents = data.certifications[0][documentsIndex].value

    const methodologyCertification = data.certifications[0].find(({ tuid }) => tuid === 'methodology')
    const methodology = methodologyCertification ? methodologyCertification.value : null

    return (
      <div style={{width: '100%'}}>
        <div className={`${cssClasses.reportName} ${cssClasses.reportImpoctName}`}>
          <div>{name}</div>
          <div className={cssClasses.impactReportDate}>{reportYearString}</div>
        </div>
        <div className={cssClasses.infoContainer}>
          {this.getImpactValues}
        </div>
        <div className={cssClasses.item}>
          <div className={cssClasses.title}>Description</div>
          <div className={cssClasses.value}>{data.aux.description}</div>
        </div>
        {methodology && <div className={cssClasses.item}>
          <div className={cssClasses.title}>Methodology and Assumptions</div>
          <div className={cssClasses.value}>{methodology}</div>
        </div>
        }
        <div className={cssClasses.item}>
          <div className={cssClasses.title}>Documents</div>
          <div className={cssClasses.value}>
            {documents.map(({ name, tuid }) => (
              <div key={tuid}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${api}/upload/${tuid}`}
                >
                  {name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

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
            <Icon type="clock-circle" theme="outlined" style={{fontSize: '18px', color: '#99A1B5', marginRight: '5px'}} />
            Pending
          </div>
        )
      case 'CANCELED':
        return (
          <div>Canceled</div>
        )
      default:
        return (
          <div>Validated</div>
        )
    }
  }

  render() {
    const { data } = this.props
    return (
      <div style={{width: '100%'}}>
        <div className={cssClasses.reportName}>
          {data.aux.name}
        </div>
        <div className={cssClasses.infoContainer}>
          {data.validatedBy && (
            <div className={cssClasses.item}>
              <div className={cssClasses.title}>Validator</div>
              <div className={cssClasses.value}>{data.validatedBy.name}</div>
            </div>
          )}
          <div className={cssClasses.item}>
            <div className={cssClasses.title}>Created</div>
            <div className={cssClasses.value}>{moment(data.date).format('YYYY-MM-DD')}</div>
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
        <div className={'hoverDetector'} style={{ position: 'relative' }}>
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
          {data.certifications.length < 1 && (
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
              <Link
                to={`/reports/${data.tuid}`}
                className="ant-btn ant-btn-lg ant-btn-primary"
              >
                Do report certification
              </Link>
            </div>
          )}
          <div className={`${cssClasses.certification} `}>
            {data.certifications.length ? (
              <ReportData data={data.certifications[0]} />
            ) : (
              <CustomFieldsView
                fieldsNamePrefix={'certificationSpec'}
                spec={ Object.values(data.certificationSpec)}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}
