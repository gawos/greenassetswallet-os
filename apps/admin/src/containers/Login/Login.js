import React, { Fragment } from 'react'
import { inject } from 'mobx-react'
import { Form, Icon, Input, Button, Modal } from 'antd'
import Loader from 'react-loader-advanced'

//app modules
import config from 'config/index'
import srcLogoWithText from 'static/images/stockholm-green-digital-finance-logo.png'

const { Item: FormItem } = Form

@inject('authStore')
@Form.create()
class LoginForm extends React.Component {
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
      this.setState({ loading: true }, () =>
        fetch(`${config.api}/admin/login`, {
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
          })
          .catch(err=> {
            let errorServer = null
            if (err.status === 401 || err.status === 403) {
              errorServer = 'Invalid login or password'
            } else {
              Modal.error({
                title: 'Some error occured',
                content: ''
              })
            }
            this.setState({ errorServer, loading: false })
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
          <h1 style={{ color: 'red', marginBottom: 0 }}>Admin</h1>
        </div>
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
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Email"
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
          <FormItem
            validateStatus="error"
            extra={
              <span style={{ color: 'red' }}>{this.state.errorServer}</span>
            }
          />
          <FormItem style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" htmlType="submit" ghost>
              Log in
            </Button>
          </FormItem>
        </Form>
      </Loader>
    )
  }
}

export default LoginForm
