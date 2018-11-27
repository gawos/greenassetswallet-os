import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'

//app modules
import cwLogo from 'static/images/chromaway-logo.png'

import gdfLogo from 'static/images/stockholm-green-digital-finance-logo-small.png'

import emsLogo from 'static/images/funded_by/emsd.png'
import gizLogo from 'static/images/funded_by/giz.png'
import fmecdLogo from 'static/images/funded_by/fmecd.png'

import cecepLogo from 'static/images/partners/cecep.jpeg'
import mistraLogo from 'static/images/partners/mistra.png'
import ohmanLogo from 'static/images/partners/ohman.jpg'
import vasakronanLogo from 'static/images/partners/vasakronan.png'
import sebLogo from 'static/images/partners/seb.jpg'
import emdofLogo from 'static/images/partners/emdof.png'
import gibLogo from 'static/images/partners/giz.png'
import ciceroLogo from 'static/images/partners/cicero.png'

@withRouter
class Footer extends Component {
  render() {
    return (
      <Fragment>
        <div className="logo-container">
          <div className="logo-group">
            <div className="logo with-title">
              <h4 className="logo-title">An innovation project by</h4>
              <img src={gdfLogo} />
            </div>
          </div>
          <div className="logo-group">
            <div className="logo with-title">
              <h4 className="logo-title">Technology partner</h4>
              <img className="cw-img" src={cwLogo} />
            </div>
          </div>
          <div className="logo-group">
            <div className="logo with-title">
              <h4 className="logo-title">Funding partners</h4>
              <img className="ems-img" src={emsLogo} />
            </div>
            <div className="logo">
              <img className="giz-img" src={gizLogo}/>
            </div>
            <div className="logo">
              <img className="fmecd-img" src={fmecdLogo}/>
            </div>
          </div>
        </div>
        <div className="partners-title-container">
          <h4 className="logo-title">Project Partners</h4>
        </div>
        <div className="partners-logo-container">
          <div className="logo with-title">
            <img className="cecep-img" src={cecepLogo} />
          </div>
          <div className="logo">
            <img className="mistra-img" src={mistraLogo}/>
          </div>
          <div className="logo">
            <img className="ohman-img" src={ohmanLogo}/>
          </div>
          <div className="logo">
            <img className="vasakronan-img" src={vasakronanLogo}/>
          </div>
          <div className="logo">
            <img className="seb-img" src={sebLogo}/>
          </div>
          <div className="logo">
            <img className="emdof-img" src={emdofLogo}/>
          </div>
          <div className="logo">
            <img className="gib-img" src={gibLogo}/>
          </div>
          <div className="logo">
            <img className="cicero-img" src={ciceroLogo}/>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Footer
