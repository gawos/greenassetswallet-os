import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
//app modules

import styleClasses from './Footer.module.css'
@withRouter
class Footer extends Component {
  render() {
    return (
      <div className={styleClasses.index} style={{ marginTop: '50px' }}>
        {/* <p>Project Participants</p>
        <Row type="flex" justify="center">
          <Col span={4}>
            <img src={GIZlogo} alt="GIZ logo" className={styleClasses.logo} />
          </Col>
          <Col span={4}>
            <img src={EMDFlogo} alt="EMDF logo" className={styleClasses.logo} />
          </Col>
          <Col span={4}>
            <img src={BMZlogo} alt="BMZ logo" className={styleClasses.logo} />
          </Col>
          <Col span={4}>
            <img src={CWlogo} alt="CW logo" className={styleClasses.logo} />
          </Col>
        </Row>
        <p>
          <i>
            This is a prototype version of the Green Assets Wallet. For internal
            evaluation and testing purposes only.
          </i>
        </p> */}
      </div>
    )
  }
}

export default Footer
