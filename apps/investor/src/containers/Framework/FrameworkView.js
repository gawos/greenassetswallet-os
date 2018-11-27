import React, { PureComponent, Fragment } from 'react'
import { Table, Card, Row, Col, Divider, Icon } from 'antd'

import config from 'config/index'

import cssClasses from './Framework.module.css'

import sdg1 from './SDGIcons/sdg1.png'
import sdg2 from './SDGIcons/sdg2.png'
import sdg3 from './SDGIcons/sdg3.png'
import sdg4 from './SDGIcons/sdg4.png'
import sdg5 from './SDGIcons/sdg5.png'
import sdg6 from './SDGIcons/sdg6.png'
import sdg7 from './SDGIcons/sdg7.png'
import sdg8 from './SDGIcons/sdg8.png'
import sdg9 from './SDGIcons/sdg9.png'
import sdg10 from './SDGIcons/sdg10.png'
import sdg11 from './SDGIcons/sdg11.png'
import sdg12 from './SDGIcons/sdg12.png'
import sdg13 from './SDGIcons/sdg13.png'
import sdg14 from './SDGIcons/sdg14.png'
import sdg15 from './SDGIcons/sdg15.png'
import sdg16 from './SDGIcons/sdg16.png'
import sdg17 from './SDGIcons/sdg17.png'

const { Column } = Table

export default class FrameworkView extends PureComponent {
  renderSDGicons(sdg) {
    let logo, text
    switch (sdg) {
    case 'SDG 1: No Poverty':
      logo = sdg1
      text = 'SDG 1'
      break
    case 'SDG 2: Zero Hunger':
      logo = sdg2
      text = 'SDG 2'
      break
    case 'SDG 3: Good Health and Well-Being for People':
      logo = sdg3
      text = 'SDG 3'
      break
    case 'SDG 4: Quality Education':
      logo = sdg4
      text = 'SDG 4'
      break
    case 'SDG 5: Gender Equality':
      logo = sdg5
      text = 'SDG 5'
      break
    case 'SDG 6: Clean Water and Sanitation':
      logo = sdg6
      text = 'SDG 6'
      break
    case 'SDG 7: Affordable and Clean Energy':
      logo = sdg7
      text = 'SDG 7'
      break
    case 'SDG 8: Decent Work and Economic Growth':
      logo = sdg8
      text = 'SDG 8'
      break
    case 'SDG 9: Industry, Innovation, and Infrastructure':
      logo = sdg9
      text = 'SDG 9'
      break
    case 'SDG 10: Reducing Inequalities':
      logo = sdg10
      text = 'SDG 10'
      break
    case 'SDG 11: Sustainable Cities and Communities':
      logo = sdg11
      text = 'SDG 11'
      break
    case 'SDG 12: Responsible Consumption and Production':
      logo = sdg12
      text = 'SDG 12'
      break
    case 'SDG 13: Climate Action':
      logo = sdg13
      text = 'SDG 13'
      break
    case 'SDG 14: Life Below Water':
      logo = sdg14
      text = 'SDG 14'
      break
    case 'SDG 15: Life on Land':
      logo = sdg15
      text = 'SDG 15'
      break
    case 'SDG 16: Peace, Justice and Strong Institutions':
      logo = sdg16
      text = 'SDG 16'
      break
    case 'SDG 17: Partnerships for the Goals':
      logo = sdg17
      text = 'SDG 17'
      break
    default:
      return null
    }
    return (
      <div className={cssClasses.goals}>
        <img alt="logo" src={logo} width="60" height="60" />
        <div className={cssClasses.goal}>{text}</div>
      </div>
    )
  }

  render() {
    const { loading, framework, actions } = this.props
    if (loading)
      return (
        <Fragment>
          <div className={cssClasses.frameworkTitleContainer}>
            <div className={cssClasses.frameworkTitle}>Framework</div>
            {actions}
          </div>
          <Card loading={true} />
        </Fragment>
      )

    if (!framework) {
      return (
        <Fragment>
          <div className={cssClasses.frameworkTitleContainer}>
            <div className={cssClasses.frameworkTitle}>Framework</div>
            {actions}
          </div>
          <Card
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px'
            }}
          >
            Framework does not exist
          </Card>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <div className={cssClasses.frameworkTitleContainer}>
          <div className={cssClasses.frameworkTitle}>Framework</div>
          {actions}
        </div>
        <Card className={cssClasses.frameworkContainer}>
          <Row type="flex" justify="space-between" gutter={24}>
            <Col span={14}>
              <Table
                showHeader={false}
                pagination={false}
                title={() => (
                  <div className={cssClasses.commitmentTitle}>
                    Green Commitments
                  </div>
                )}
                dataSource={framework.commitments}
                rowKey="tuid"
                rowClassName={(commitment, idx) =>
                  idx % 2 === 0
                    ? cssClasses.commitmentEven
                    : cssClasses.commitmentOdd
                }
              >
                <Column key={'text'} dataIndex="text" />
              </Table>
              <Divider />
              <Row type="flex" justify="space-between" gutter={24}>
                <Col span={24}>
                  <div className={cssClasses.categoriesTitle}>Supporting Documentation</div>
                </Col>
                {framework.files.map(file => (
                  <Col span={framework.files.length > 1 ? 12 : 24} key={file.tuid} className={cssClasses.file}>
                    <a
                      href={`${config.api}/upload/${file.tuid}.${file.ext}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon type="file-text" theme="outlined" /> {file.filename}
                    </a>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col span={9} offset={1}>
              <div className={cssClasses.categoriesTitle}>
                Use of Proceeds Category
              </div>
              {framework.categories.map(category => (
                <div key={category.tuid} className={cssClasses.category}>
                  {category.text}
                </div>
              ))}
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={cssClasses.goalsTitle}>
                Sustainable Development Goals
              </div>
              {framework.goals.map(goal => (
                <div key={goal.tuid} className={cssClasses.goal}>
                  {this.renderSDGicons(goal.text)}
                </div>
              ))}
            </Col>
          </Row>
        </Card>
      </Fragment>
    )
  }
}
