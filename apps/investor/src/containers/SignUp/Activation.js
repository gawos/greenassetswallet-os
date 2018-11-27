import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import config from 'config/index'

import { inject } from 'mobx-react'
import { Spin, Modal } from 'antd'

//app modules
import SetUp from './SetUp'
import TokenInvalid from './TokenInvalid'
import srcLogoWithText from 'static/images/stockholm-green-digital-finance-logo.png'

@inject('authStore')
@withRouter
class SignUpConfirmation extends Component {
  state = {
    loading: true,
    isTokenInvalid: true
  }
  componentDidMount() {
    const that = this
    this.setState({
      loading: true
    }, () =>
      fetch(`${config.api}/investor/set-up/${this.props.match.params.token}`)
        .then( async res=>  {
          if(res.status === 403){
            throw res
          } else if(res.ok ) {

            return res.json()
          }
        })
        .then(result => {
          that.setState({
            isTokenInvalid: false,
            userData: result
          })
        })
        .catch(err => {
          if(err.status === 403){
            that.setState({
              isTokenInvalid: true,
              userData: null
            })
          } else {
            Modal.error({
              title: 'Server side error occured',
              content: <pre>{JSON.stringify(err, null, 2)}</pre>
            })
          }
          console.error(err)
        })
        .then( () => {
          that.setState({
            loading: false
          })
        }))
  }

  render() {
    const {loading, isTokenInvalid} = this.state

    if( loading ) {
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
          <Spin size="large" style={{display: 'block', margin: '0 auto', paddingTop: '20px'}}
            description="Sign Up confirmation"
          />
        </div>)
    }

    if( isTokenInvalid ) {
      return (
        <TokenInvalid/>
      )
    }
    return <SetUp userData={this.state.userData} token={this.props.match.params.token}/>
  }
}

export default SignUpConfirmation
