import React, { Component, Fragment } from 'react'
import { inject } from 'mobx-react'
import { Form, Icon, Input, Button, Modal } from 'antd'
import Loader from 'react-loader-advanced'

//app modules
import config from 'config/index'
import gawLogo from 'static/images/gaw-logo.png'

const { Item: FormItem } = Form

@inject('authStore')
@Form.create()
class LoginForm extends Component {
  state = {
    errorServer: '',
    loading: false
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
      this.setState({
        loading: true
      }, () =>
        fetch(`${config.api}/issuer/login`, {
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
                content: 'username or pasword is invalid'
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
          <img alt="logo" src={gawLogo} style={{ height: '90px' }} />
          <h2 className="login-title">Issuer</h2>
        </div>
        <Form
          onSubmit={this.handleSubmit}
          style={{ maxWidth: '380px', paddingTop: '20px', margin: '0 auto' }}
        >
          <label className="input-label" htmlFor="email">
              Email
          </label>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: 'Please input your email!' }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
              />
            )}
          </FormItem>
          <label className="input-label" htmlFor="password">
               Password
          </label>
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
            <Button type="primary" htmlType="submit" ghost>
              Login
            </Button>
          </div>

        </Form>
      </Loader>
    )
  }
}

export default LoginForm
