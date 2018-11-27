import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
//app modules
import srcLogoWithText from 'static/images/stockholm-green-digital-finance-logo.png'
class TokenInvalid extends PureComponent {
  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Link to={'/'}  style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '50px'
        }}>
          <img alt="logo" src={srcLogoWithText} style={{ height: '90px' }} />
        </Link>
        <div style={{fontSize: '22px'}}>Your token expired or invalid</div>
        <Link to="/auth/sign-up" className="ant-btn ant-btn-primary ant-btn-background-ghost">
          RESEND AUTHENTETIFICATION EMAIL
        </Link>
      </div>
    )
  }
}

export default TokenInvalid
