import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import PropTypes from 'prop-types'
import uuidV4 from 'uuid/v4'
import _ from 'lodash'
import Loader from 'react-loader-advanced'

import { Form, Icon, Input, Button, Select, Modal, Upload, Card } from 'antd'
//app modules
import { framework as frameworkMutation } from 'src/queries/mutations.gql'

import { categories, goals } from 'src/constants'

import styles from './FrameworkCreate.module.css'

const { Item: FormItem } = Form
const { Dragger } = Upload
const { Option } = Select
const { TextArea } = Input

@withRouter
@compose(graphql(frameworkMutation, { name: 'itemCreate' }))
@Form.create()
class FrameworkCreate extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    itemCreate: PropTypes.func
  }
  static draggerProps = {
    name: 'file',
    multiple: true,
    beforeUpload: () => false,
    accept: 'application/pdf'
  }
  static initialId = uuidV4()

  state = {
    loading: false
  }

  remove = k => {
    const keys = this.props.form.getFieldValue('keys')
    delete keys[k]
    this.props.form.setFieldsValue({
      keys
    })
  }

  add = () => {
    const keys = this.props.form.getFieldValue('keys')
    const tuid = uuidV4()
    this.props.form.setFieldsValue({
      keys: { ...keys, [tuid]: tuid }
    })
  }

  onSubmit = ev => {
    ev.preventDefault()
    this.props.form.validateFieldsAndScroll(
      null,
      {},
      (errors, values) => {
        if (errors) {
          return
        }
        const {
          commitments,
          files,
          categories: categoriesChoosen,
          goals: goalsChoosen,
          ...filteredValues
        } = values
        const formatedValues = {
          ...filteredValues,
          categories: (categoriesChoosen || []).map(el => ({
            tuid: el,
            text: categories[Number(el)]
          })),
          goals: (goalsChoosen || []).map(el => ({
            tuid: el,
            text: goals[Number(el)].text
          })),
          files: _.has(files, 'fileList')
            ? files.fileList.map(el => el.originFileObj)
            : [],
          commitments: Object.values(commitments)
        }
        this.setState({ loading: true }, async () => {
          try {
            const result = await this.props.itemCreate({
              variables: {
                ...formatedValues
              }
            })
            if (result.errors) {
              throw result
            }

            Modal.success({
              title: 'Created',
              content: (
                <div>
                  <p>Framework creation successful</p>
                </div>
              ),
              okText: 'Continue',
              onOk: () => {
                this.props.history.push('/profile')
              }
            })
            this.setState({ loading: false })
          } catch (err) {
            Modal.error({
              title: 'An error occured, maybe element with this identificator already exists',
              content: err.errors
                ? err.errors.map(error => (
                  <div key={error.locations.toString()}>{error.message}</div>
                ))
                : err.toString()
            })
            this.setState({ loading: false })
            // eslint-disable-next-line no-console
            console.error(err)
          }
        })
      }
    )
  }

  renderCommitments = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form

    getFieldDecorator('keys', {
      initialValue: { tuid: FrameworkCreate.initialId }
    })
    const keys = getFieldValue('keys')
    return Object.values(keys).map((k, index) => {
      return (
        <FormItem
          label={index === 0 ? 'Green Commitments' : ''}
          required={true}
          key={k}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {getFieldDecorator(`commitments[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please add at least one commitment.'
                }
              ]
            })(<Input style={{ marginRight: 8 }} />)}

            <Icon
              style={{
                fontSize: '28px',
                visibility: 'visible',
                cursor: 'pointer'
              }}
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          </div>
        </FormItem>
      )
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Card
        style={{ ...this.props.style }}
        title={
          <h3
            style={{
              fontSize: '27px',
              color: 'rgb(18, 56, 152)'
            }}
          >
            Create Framework
          </h3>
        }
      >
        <Loader
          contentBlur={1}
          show={this.state.loading}
          message={'SAVING...'}
          messageStyle={{
            fontSize: '30px'
          }}
        >
          <a href="https://github.com/greenassetswallet/greenassetswallet/wiki/2.-Issuer-Guide#framework-creation" target="_blank" className={styles.documentationTitle}><Icon type="question-circle" /> See documentation</a>
          <Form onSubmit={this.onSubmit}>
            <FormItem label="Framework name">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input a framework name'
                  }
                ]
              })(<Input />)}
            </FormItem>
            <div style={{ display: 'flex', width: '100%' }}>
              <FormItem label="Use of proceeds categories" style={{ flex: 1 }}>
                {getFieldDecorator('categories', {
                  rules: [
                    {
                      required: true,
                      type: 'array'
                    }
                  ]
                })(
                  <Select mode="multiple" style={{ width: '100%' }}>
                    {categories.map((el, index) => (
                      <Option
                        value={index}
                        key={el}
                        style={{ fontWeight: '900' }}
                      >
                        {el}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <div style={{ width: '8px' }} />
              <FormItem
                label="UN Sustainable Development Goals"
                style={{ flex: 1 }}
              >
                {getFieldDecorator('goals', {
                  rules: [
                    {
                      type: 'array'
                    }
                  ]
                })(
                  <Select mode="multiple" style={{ width: '100%' }}>
                    {goals.map((el, index) => (
                      <Option
                        value={index}
                        key={index}
                        style={{ fontWeight: '900' }}
                      >
                        {el.text}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </div>
            <FormItem label="Description" style={{ flex: 1 }}>
              {getFieldDecorator('description', {
                rules: [{}]
              })(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
            </FormItem>
            {this.renderCommitments()}
            <FormItem>
              <Button
                type="dashed"
                onClick={this.add}
                style={{ width: '100%' }}
              >
                <Icon type="plus" /> Add commitment
              </Button>
            </FormItem>
            <FormItem label="Upload framework documents">
              {getFieldDecorator('files', {
                rules: [
                  {
                    required: true,
                    message: 'Please add your original framework documentation'
                  }
                ]
              })(
                <Dragger {...FrameworkCreate.draggerProps}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="download" style={{color: '#CDD1DD'}} />
                  </p>
                  <p className="ant-upload-text">
                    Upload by clicking here, or drag files to this area
                  </p>
                </Dragger>
              )}
            </FormItem>
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
                to={'/profile'}
                style={{
                  justifySelf: 'end',
                  alignSelf: 'flex-end',
                  display: 'inline-block'
                }}
              >
                Cancel
              </Link>
              <Button type="primary" htmlType="submit" ghost>
                Create
              </Button>
            </div>
          </Form>
        </Loader>
      </Card>
    )
  }
}

export default FrameworkCreate
