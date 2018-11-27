import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { graphql, compose } from 'react-apollo'
import { Form, Input, Button, Radio, Modal, Select } from 'antd'
import Loader from 'react-loader-advanced'

import ErrorContent from '../../_components/ErrorContent/ErrorContent'
import { user as userCreate } from 'src/queries/mutations.gql'

const { Item: FormItem } = Form
const { Button: RadioButton, Group: RadioGroup } = Radio

const Option = Select.Option

@withRouter
@compose(
  graphql(userCreate, {
    name: 'userCreate'
  })
)
@Form.create()
class UserCreate extends Component {
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

  onSubmit = ev => {
    ev.preventDefault()
    const { form } = this.props
    form.validateFieldsAndScroll(null, {},  (errors, values) => {
      if (errors) {
        return
      }
      this.setState({ loading: true }, async () => {
        try {
          const {
            avatar,
            password,
            role,
            email,
            ...filteredValues
          } = values
          const formattedValues = {
            ...filteredValues,

            email,
            avatar: _.has(avatar, 'fileList')
              ? avatar.fileList.map(el => el.originFileObj)
              : []
          }

          const result = await this.props.userCreate({
            variables: {
              login: email,
              password,
              role,
              auxData: { ...formattedValues }
            }
          })
          if (result.errors) {
            throw result
          }
          Modal.confirm({
            title: 'Created',
            content: (
              <div>
                <p>New user was created</p>
              </div>
            ),
            cancelText: 'Continue',
            okText: 'Check new user',
            onOk: () => {
              this.props.history.push(`/users/${result.data.user.tuid}`)
            },
            onCancel: () => {
              this.props.history.push('/users')
            }
          })
          if (this.props.onDidCreate) {
            this.props.onDidCreate(result)
          }
        } catch (err) {
          Modal.error({
            title: 'An error occurred',
            content: (<ErrorContent error={err} />)
          })
          // eslint-disable-next-line no-console
          console.error(err)
        }
        this.setState({ loading: false })
      } )
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    getFieldDecorator('prefix', {
      initialValue: '46'
    })(
      <Select style={{ width: 70 }}>
        <Option value="45">+45</Option>
        <Option value="46">+46</Option>
        <Option value="47">+47</Option>
        <Option value="358">+358</Option>
        <Option value="354">+354</Option>
      </Select>
    )

    getFieldDecorator('description', {initialValue: ''})
    getFieldDecorator('greenObjectives', {initialValue: ''})
    getFieldDecorator('link', {initialValue: ''})


    return (
      <Loader
        contentBlur={1}
        show={this.state.loading}
        message={'SAVING...'}
        messageStyle={{
          fontSize: '30px'
        }}
      >
        <Form onSubmit={this.onSubmit} style={{ ...this.props.style }}>
          <FormItem style={{ flex: 1, paddingRight: '10px' }}>
            {getFieldDecorator('role', {
              rules: [
                { required: true, message: 'Please input your email!' }
              ],
              initialValue: 'issuer'
            })(
              <RadioGroup>
                <RadioButton value="issuer">Issuer</RadioButton>
                <RadioButton value="validator">Validator</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <div style={{ display: 'flex' }}>
            <FormItem label="Name" colomn={false} style={{ flex: 1, paddingRight: '10px' }}>
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: 'Please input your email!' }
                ]
              })(<Input />)}
            </FormItem>
          </div>
          <div style={{ display: 'flex' }}>
            <FormItem label="Email" style={{ flex: 1, paddingRight: '10px' }}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!'
                  },
                  { required: true, message: 'Please input user email!' }
                ]
              })(<Input />)}
            </FormItem>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1, paddingRight: '10px' }}>
              <FormItem label="Password">
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your password!'
                    }
                  ]
                })(<Input type="password" />)}
              </FormItem>
              <FormItem label="Confirm password" style={{ flex: 1 }}>
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
                })(<Input type="password" />)}
              </FormItem>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '15px',
              paddingBottom: '15px'
            }}
          >
            <Link
              className="ant-btn ant-btn-primary ant-btn-background-ghost"
              to={'/users'}
              style={{
                justifySelf: 'end',
                alignSelf: 'flex-end',
                display: 'inline-block'
              }}
            >
              <span>Cancel</span>
            </Link>
            <Button type="primary" htmlType="submit" ghost>
              Create
            </Button>
          </div>
        </Form>
      </Loader>
    )
  }
}

export default UserCreate
