import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Form, Icon, Input, Button, Modal } from 'antd'
import Loader from 'react-loader-advanced'

//app modules
import config from 'config/index'
import srcLogoWithText from 'static/images/stockholm-green-digital-finance-logo.png'


const { Item: FormItem } = Form

@withRouter
@Form.create()
class SignUpForgetPassword extends Component {
  state = {
    loading: false,
    errorServer: ''
  };

  handleSubmit = ev => {
    const that = this
    ev.preventDefault()
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        console.error('Received values of form: ', values)
        return
      }
      this.setState({
        loading: true
      }, () =>
        fetch(`${config.api}/investor/email`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({ ...values }),
          redirect: 'follow'
        })
          .then(res => {
            //check status
            if (res.ok) {
              that.props.history.push('/auth/set-up/check-email')
              return res
            } else{
              throw res
            }
          })
          .catch(err => {
            Modal.error({
              title: 'Server  error occured'
            })
            console.error(err)
          }).then( () => {
            this.setState({
              loading: false
            })
          }))
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Loader
        contentBlur={1}
        show={this.state.loading}
        message={'SAVING...'}
        messageStyle={{
          fontSize: '30px'
        }}
      >
        <Link to={'/'}  style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '50px'
        }}>
          <img alt="logo" src={srcLogoWithText} style={{ height: '90px' }} />
        </Link>
        <h1 style={{ textAlign: 'center', color: '#919191' }}>Sign Up / Forget password</h1>
        <Form
          onSubmit={this.handleSubmit}
          style={{ maxWidth: '380px', paddingTop: '20px', margin: '0 auto' }}
        >
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!'
                },
                {
                  required: true,
                  message: 'Please input your E-mail!'
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="E-mail"
              />
            )}
          </FormItem>
          <FormItem
            validateStatus="error"
            extra={
              <span style={{ color: 'red' }}>{this.state.errorServer}</span>
            }
          />
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between'
            }}
          >
            <Link
              to="/register"
            >
              GO TO LOGIN
            </Link>
            <Button type="primary" htmlType="submit" ghost>
              SUBMIT
            </Button>
          </div>
        </Form>
      </Loader>
    )
  }
}

export default SignUpForgetPassword
