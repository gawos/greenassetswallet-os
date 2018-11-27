import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { inject } from 'mobx-react'
import { Form, Icon, Input, Button, Modal } from 'antd'
import Loader from 'react-loader-advanced'

//app modules
import config from 'config/index'
import srcLogoWithText from 'static/images/stockholm-green-digital-finance-logo.png'

const { Item: FormItem } = Form

@inject('authStore')
@Form.create()
class LoginForm extends Component {
  state = {
    loading: false
  }

  validateConfirmPassword = (rule, value, callback) => {
    const { getFieldValue } = this.props.form

    const passwordField = getFieldValue('password')
    if (passwordField !== value) {
      callback(new Error('passwords does not match'))
    } else {
      callback()
    }
  }

  handleSubmit = ev => {
    const that = this
    ev.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error('Received values of form: ', values)
        return
      }
      this.setState({ loading: true }, () =>
        fetch(`${config.api}/issuer/sign-up`, {
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
              return res.json()
            } else{
              throw res
            }
          })
          .then(res => {
            that.props.authStore.login(res)
            return res
          }).catch(err=> {
            if (err.status === 401 || err.status === 403) {
              Modal.error({
                title: 'User not created',
                content: 'user with this name may already exists'
              })
            } else {
              Modal.error({
                title: 'Some error occured',
                content: ''
              })
            }
            this.setState({ loading: false })
            console.error(err)
          }))
    })
  }

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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '50px'
          }}
        >
          <img alt="logo" src={srcLogoWithText} style={{ height: '90px' }} />
        </div>
        <h1 style={{ textAlign: 'center', color: '#919191' }}>Sign Up</h1>
        <Form
          onSubmit={this.handleSubmit}
          style={{ maxWidth: '380px', paddingTop: '20px', margin: '0 auto' }}
        >
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: 'Please input your email!' }
              ]
            })(
              <Input
                prefix={
                  <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="email"
              />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please input your Password!' }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirmPassword', {
              rules: [
                { required: true, message: 'Please input your Password!' },
                {
                  validator: this.validateConfirmPassword,
                  message: 'Password do not match'
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="confirm"
                placeholder="Confirm Password"
              />
            )}
          </FormItem>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between'
            }}
          >
            <Link to="/register">GO TO LOGIN</Link>
            <Button type="primary" htmlType="submit" ghost>
              Sign Up
            </Button>
          </div>
        </Form>
      </Loader>
    )
  }
}

export default LoginForm
