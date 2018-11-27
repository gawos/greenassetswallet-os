import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Row, Col } from 'antd'

//app modules
import srcGIZlogo from 'static/images/giz-logo.png'
import srcEMDFlogo from 'static/images/emdf-logo.png'
import srcBMZlogo from 'static/images/bmz-logo.png'
import srcCWlogo from 'static/images/chromaway-logo.png'

import cssClasses from './Footer.module.css'

@withRouter
class Footer extends Component {
  render() {
    return (
      <Fragment>
        <h3 style={{ fontSize: 'large', textAlign: 'center' }}>Participants</h3>
        <Row type="flex" justify="center">
          <Col span={4}>
            <img
              src={srcGIZlogo}
              alt="GIZ logo"
              className={cssClasses.footerLogo}
            />
          </Col>
          <Col span={4}>
            <img
              src={srcEMDFlogo}
              alt="EMDF logo"
              className={cssClasses.footerLogo}
            />
          </Col>
          <Col span={4}>
            <img
              src={srcBMZlogo}
              alt="BMZ logo"
              className={cssClasses.footerLogo}
            />
          </Col>
          <Col span={4}>
            <img
              src={srcCWlogo}
              alt="CW logo"
              className={cssClasses.footerLogo}
            />
          </Col>
        </Row>
        <p>
          <i>
            This is a prototype version of the Green Assets Wallet. For internal
            evaluation and testing purposes only.
          </i>
        </p>
      </Fragment>
    )
  }
}

export default Footer
