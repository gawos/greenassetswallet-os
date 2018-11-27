import React, { Component } from 'react'
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
class SetUpAccount extends Component {
  state = {
    errorServer: '',
    loading: false
  };

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
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        console.error('Received values of form: ', values)
        return
      }
      this.setState({
        loading: true
      }, () =>
        fetch(`${config.api}/investor/set-up/${this.props.token}`, {
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
            } else {
              throw res
            }
          })
          .then(res => {
            that.props.authStore.login(res)
            return res
          }).catch(err => {
            Modal.error({
              title: 'Server side error occured'
            })
          })
          .then( () => {
            this.setState({
              loading: false
            })
          }))
    })
  };

  render() {
    const { userData } = this.props
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
        <h1 style={{ textAlign: 'center', color: '#919191' }}>
          { userData.isActivated ? 'Change Password' : 'Set Up Account' }
        </h1>
        <Form
          onSubmit={this.handleSubmit}
          style={{ maxWidth: '380px', paddingTop: '20px', margin: '0 auto' }}
        >
          {!userData.isActivated &&
            <FormItem>
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: 'Please input your email!' }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Name"
                />
              )}
            </FormItem>
          }
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!'
                }
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
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password!'
                },
                {
                  validator: this.validateConfirmPassword,
                  message: 'Password does not match!'
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                onBlur={this.handleConfirmBlur}
                placeholder="Confirm password"
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
              Submit
            </Button>
          </div>
        </Form>
      </Loader>
    )
  }
}

export default SetUpAccount
