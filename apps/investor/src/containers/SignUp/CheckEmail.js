import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
//app modules
import srcLogoWithText from 'static/images/stockholm-green-digital-finance-logo.png'
class CheckEmail extends PureComponent {
  render() {
    return (
      <div>
        <Link to={'/'}  style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '50px'
        }}>
          <img alt="logo" src={srcLogoWithText} style={{ height: '90px' }} />
        </Link>
        <h1 style={{ textAlign: 'center', color: '#919191' }}>Mail Sent Successfully!</h1>
        <p style={{fontSize: '20px', maxWidth: '380px', margin: '0 auto'}}>An activation link was sent to email you provided<br/>
          Pease check your email
        </p>
      </div>
    )
  }
}

export default CheckEmail
