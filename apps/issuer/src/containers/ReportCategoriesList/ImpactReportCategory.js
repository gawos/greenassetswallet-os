import React, { PureComponent, Fragment } from 'react'

import config from 'config/index'
import { indicators } from 'src/constants'

import cssClasses from './Report.module.css'

export default class ImpactReportCategory extends PureComponent {
  get getImpactValues() {
    const { data } = this.props
    if (!data.certifications.length) return null

    const indicator = data.aux.report_metadata_json.indicator

    if (indicator === 'energy_consumption') {
      const electricity = data.certifications[0].data
        .find(({ tuid }) => tuid === 'electricity_consumption')
        .value.toString()
        .replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ')
      const electricityUnit = data.certificationSpec[2].spec.unit
      const heating = data.certifications[0].data
        .find(({ tuid }) => tuid === 'heating_consumption')
        .value.toString()
        .replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ')
      const heatingUnit = data.certificationSpec[4].spec.unit
      const cooling = data.certifications[0].data
        .find(({ tuid }) => tuid === 'cooling_consumption')
        .value.toString()
        .replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ')
      const coolingUnit = data.certificationSpec[3].spec.unit
      return (
        <Fragment>
          <div className={cssClasses.item}>
            <div className={cssClasses.title}>Electricity</div>
            <div className={cssClasses.value}>
              {electricity} {electricityUnit}
            </div>
          </div>
          <div className={cssClasses.item}>
            <div className={cssClasses.title}>Heating</div>
            <div className={cssClasses.value}>
              {heating} {heatingUnit}
            </div>
          </div>
          <div className={cssClasses.item}>
            <div className={cssClasses.title}>Cooling</div>
            <div className={cssClasses.value}>
              {cooling} {coolingUnit}
            </div>
          </div>
        </Fragment>
      )
    } else {
      const valueCertification = data.certifications[0].data['value']
      const value = valueCertification.value
      //   .toString()
      //   .replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ')
      // const unit = data.certifications[0][0].spec.unit
      return (
        <Fragment>
          <div className={cssClasses.item}>
            <div className={cssClasses.title}>Value</div>
            <div className={cssClasses.value}>
              {value}{/*  {unit} */}
            </div>
          </div>
        </Fragment>
      )
    }
  }

  render() {
    const { data } = this.props
    const indicator = indicators[data.aux.report_metadata_json.indicator]
    const name = indicator ? indicator : data.aux.name || 'IMPACT REPORT'
    const reportYearString = data.certifications[0].data['reportYear'].value
    const documents = data.certifications[0].data['documents'].value
    const methodologyCertification = data.certifications[0].data['methodology']

    const methodology = methodologyCertification
      ? methodologyCertification.value
      : null

    return (
      <div style={{ width: '100%' }}>
        <div
          className={`${cssClasses.reportName} ${cssClasses.reportImpoctName}`}
        >
          <div>{name}</div>
          <div className={cssClasses.impactReportDate}>{reportYearString}</div>
        </div>
        <div className={cssClasses.infoContainer}>{this.getImpactValues}</div>
        <div className={cssClasses.item}>
          <div className={cssClasses.title}>Description</div>
          <div className={cssClasses.value}>{data.aux.description}</div>
        </div>
        {methodology && (
          <div className={cssClasses.item}>
            <div className={cssClasses.title}>Methodology and Assumptions</div>
            <div className={cssClasses.value}>{methodology}</div>
          </div>
        )}
        <div className={cssClasses.item}>
          <div className={cssClasses.title}>Documents</div>
          <div className={cssClasses.value}>
            {documents.map(({ name, tuid }) => (
              <div key={tuid}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${config.api}/upload/${tuid}`}
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
