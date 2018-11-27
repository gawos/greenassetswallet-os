import React, { PureComponent, Fragment } from 'react'
import { Card, Row, Col, Icon, Divider } from 'antd'

import config from 'config/index'
import { indicators, indicatorsMeasuring, energyConsumptionTitle } from 'src/constants'

import styles from './ProjectItem.module.css'

class ProjectImpact extends PureComponent {
  renderReport = (report, idx, arr) => {
    const data = (report.certifications[0] && report.certifications[0]).data
    if (!data) {
      return null
    }
    
    const value = data.value && data.value.value
    const cooling = data.cooling_consumption && data.cooling_consumption.value
    const electricity = data.electricity_consumption && data.electricity_consumption.value
    const heating = data.heating_consumption && data.heating_consumption.value
    const emissionFactor = data.emissionFactor && data.emissionFactor.value
    const emissionFactorHeating = data.emission_factor_heating && data.emission_factor_heating.value
    const emissionFactorElectricity = data.emission_factor_electricity && data.emission_factor_electricity.value
    const emissionFactorCooling = data.emission_factor_cooling && data.emission_factor_cooling.value
    const factorCooling = data.emission_factor_cooling && data.emission_factor_cooling.value
    const reportYear = data.reportYear && data.reportYear.value
    const name = data.name && data.name.value

    return (
      <Fragment key={idx}>
        <Row type="flex" justify="space-between" gutter={24}>
          <Col span={13}>
            <div className={styles.reportName}>{indicators[report.indicator]}</div>
            <div className={styles.titleValue}>Description</div>
            <div className={styles.value}>{report.aux.description}</div>
          </Col>
          <Col span={10}>
            <Card bordered={false} className={styles.card}>
              <Row type="flex" justify="space-between" gutter={24}>
                {value && <Col span={12}>
                  <div className={styles.titleValue}>Value</div>
                  <div className={styles.value}>{value} {indicatorsMeasuring[report.indicator]}</div>
                </Col>}
                {cooling && <Col span={12}>
                  <div className={styles.titleValue}>{energyConsumptionTitle.cooling_consumption}</div>
                  <div className={styles.value}>{cooling} {indicatorsMeasuring[report.indicator]}</div>
                </Col>}
                {factorCooling && <Col span={12}>
                  <div className={styles.titleValue}>{energyConsumptionTitle.emission_factor_cooling}</div>
                  <div className={styles.value}>{factorCooling} {indicatorsMeasuring[report.indicator]}</div>
                </Col>}
                {emissionFactorCooling && <Col span={12}>
                  <div className={styles.titleValue}>{energyConsumptionTitle.emission_factor_cooling}</div>
                  <div className={styles.value}>{emissionFactorCooling} {indicatorsMeasuring[report.indicator]}</div>
                </Col>}
                {heating && <Col span={12}>
                  <div className={styles.titleValue}>{energyConsumptionTitle.heating_consumption}</div>
                  <div className={styles.value}>{heating} {indicatorsMeasuring[report.indicator]}</div>
                </Col>}
                {emissionFactorHeating && <Col span={12}>
                  <div className={styles.titleValue}>{energyConsumptionTitle.emission_factor_heating}</div>
                  <div className={styles.value}>{emissionFactorHeating} {indicatorsMeasuring[report.indicator]}</div>
                </Col>}
                {electricity && <Col span={12}>
                  <div className={styles.titleValue}>{energyConsumptionTitle.electricity_consumption}</div>
                  <div className={styles.value}>{electricity} {indicatorsMeasuring[report.indicator]}</div>
                </Col>}
                {emissionFactorElectricity && <Col span={12}>
                  <div className={styles.titleValue}>{energyConsumptionTitle.emission_factor_electricity}</div>
                  <div className={styles.value}>{emissionFactorElectricity} {indicatorsMeasuring[report.indicator]}</div>
                </Col>}
                {emissionFactor && <Col span={12}>
                  <div className={styles.titleValue}>{energyConsumptionTitle.emissionFactor}</div>
                  <div className={styles.value}>{emissionFactor} {indicatorsMeasuring[report.indicator]}</div>
                </Col>}
                {name && <Col span={12}>
                  <div className={styles.titleValue}>Name</div>
                  <div className={styles.value}>{name}</div>
                </Col>}
                {reportYear && <Col span={12}>
                  <div className={styles.titleValue}>Report Year</div>
                  <div className={styles.value}>{reportYear}</div>
                </Col>}
                <Col span={24}>
                  <div className={styles.titleValue}>Documents</div>
                  <div className={styles.value}>
                    {!data.documents || !data.documents.value
                      ? 'Not Delivered'
                      : data.documents.value.map(file => (
                        <a
                          key={file.tuid}
                          className={styles.documentLink}
                          href={`${config.api}/upload/${file.tuid}.${file.ext}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icon type="file-text" theme="outlined" /> {file.name}
                        </a>
                      ))}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        {idx < arr.length - 1 && <Divider />}
      </Fragment>
    )
  }

  render() {
    const { reports = [] } = this.props

    if (!reports.length) {
      return (
        <Card className="empty-card">
          Impact does not exists
        </Card>
      )
    }

    return (
      <Card>
        {reports.map((report, idx) =>
          this.renderReport(report, idx, reports)
        )}
      </Card>
    )
  }
}

export default ProjectImpact
