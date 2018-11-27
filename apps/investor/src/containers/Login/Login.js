import React, { Component } from 'react'
import { inject } from 'mobx-react'
import { Form, Icon, Input, Button, Modal } from 'antd'
import { Link } from 'react-router-dom'
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
  handleSubmit = ev => {
    const that = this
    ev.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        console.error('Received values of form: ', values)
        return
      }
      this.setState({loading: true }, () =>
        fetch(`${config.api}/investor/login`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },

          body: JSON.stringify({ ...values }),
          redirect: 'follow'
        })
          .then(res => {
            if (res.ok) {
              return res.json()
            } else{
              throw res
            }
          })
          .then(res => {
            that.props.authStore.login(res)
            return res
          })
          .catch(err => {
            if (err.status === 401 || err.status === 403) {
              Modal.error({
                title: 'User not created',
                content: 'userame or password is incorrect'
              })
            } else {
              Modal.error({
                title: 'Some error occured',
                content: ''
              })
            }
            this.setState({ loading: false })
            return err
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
        <Link
          to="/"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '50px'
          }}
        >
          <img alt="logo" src={srcLogoWithText} style={{ height: '90px' }} />
          <h1 style={{ color: 'red', marginBottom: 0 }}>Investor</h1>
        </Link>
        <Form
          onSubmit={this.handleSubmit}
        >

          <FormItem label='Email'>
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
          <FormItem label='Password'>
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
              flexDirection: 'column',
              width: '100%'
            }}
          >
            <Link to="/auth/sign-up">
              GO TO SIGN UP / FORGET PASSWORD
            </Link>
            <Button type="primary" htmlType="submit" ghost>
              LOGIN
            </Button>
          </div>
        </Form>
      </Loader>
    )
  }
}

export default LoginForm
