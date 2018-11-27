import React, { PureComponent, Fragment } from 'react'

import config from 'config/index'
import { indicators } from 'src/constants'

import cssClasses from './Report.module.css'

export default class ImpactReportCategory extends PureComponent {
  get getImpactValues() {
    const { data } = this.props
    const indicator = data.aux.report_metadata_json.indicator

    if (indicator === 'energy_consumption') {
      const electricity = data.certifications[0]
        .find(({ tuid }) => tuid === 'electricity_consumption')
        .value.toString()
        .replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ')
      const heating = data.certifications[0]
        .find(({ tuid }) => tuid === 'heating_consumption')
        .value.toString()
        .replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ')
      const cooling = data.certifications[0]
        .find(({ tuid }) => tuid === 'cooling_consumption')
        .value.toString()
        .replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ')
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
      const valueCertification = data.certifications[0].find(
        ({ tuid }) => tuid === 'value'
      )
      const value = valueCertification.value
        .toString()
        .replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ')

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
    if (!data.certifications.length) return null

    const indicator = indicators[data.aux.report_metadata_json.indicator]
    const name = indicator ? indicator : data.aux.name || 'IMPACT REPORT'
    const reportYearString = data.certifications[0].find(
      ({ tuid }) => tuid === 'reportYear'
    ).value

    const documentsIndex = data.certifications[0].findIndex(
      ({ tuid }) => tuid === 'documents'
    )
    const documents = data.certifications[0][documentsIndex].value

    const methodologyCertification = data.certifications[0].find(
      ({ tuid }) => tuid === 'methodology'
    )
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
