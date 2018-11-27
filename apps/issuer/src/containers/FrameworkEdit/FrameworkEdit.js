import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { make_tuid } from '../../utils'
import { graphql, compose } from 'react-apollo'
import _ from 'lodash'
import Loader from 'react-loader-advanced'

import {
  Form,
  Icon,
  Input,
  Button,
  Select,
  Upload,
  Spin,
  Modal,
  Checkbox
} from 'antd'
//app modules
import { framework as frameworkQuery } from 'src/queries/queries.gql'
import { frameworkUpdate as frameworkUpdateMutation } from 'src/queries/mutations.gql'

import { goals, categories } from 'src/constants'

import styles from './FrameworkEdit.module.css'

const { Item: FormItem } = Form
const { Dragger } = Upload
const { Option } = Select

const propsUploader = {
  name: 'file',
  multiple: true,
  beforeUpload: (file, fileList) => false
}

@withRouter
@compose(
  graphql(frameworkQuery, {
    options: props => ({
      variables: {
        tuid: props.match.params.tuid
      }
    }),
    name: 'frameworkQuery'
  }),
  graphql(frameworkUpdateMutation, {
    name: 'itemUpdate'
  })
)
@Form.create()
class FrameworkEdit extends Component {
  state = {
    loading: false
  }
  static propTypes = {
    frameworkQuery: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired
  }

  remove = tuid => {
    const { form } = this.props
    const commitmentsAdd = form.getFieldValue('commitmentsAdd')
    const commitmentsUpdate = form.getFieldValue('commitmentsUpdate')
    const deleteKeys = form.getFieldValue('commitmentsDelete')
    delete commitmentsAdd[tuid]
    delete commitmentsUpdate[tuid]

    form.setFieldsValue({
      commitmentsAdd,
      commitmentsUpdate,
      commitmentsDelete: { ...deleteKeys, [tuid]: { tuid } }
    })
  }

  add = () => {
    const { form } = this.props
    const commitmentsAdd = form.getFieldValue('commitmentsAdd')
    const tuid = make_tuid()
    form.setFieldsValue({
      commitmentsAdd: {
        ...commitmentsAdd,
        [tuid]: { tuid }
      }
    })
  }

  handleRemoveFile = tuid => {
    const { form } = this.props
    const filesDelete = form.getFieldValue('filesDelete')

    form.setFieldsValue({
      filesDelete: { ...filesDelete, [tuid]: true }
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
          commitmentsAdd,
          commitmentsDelete,
          commitmentsUpdate,
          files,
          categories: categoriesChosen,
          goals: goalsChosen,
          filesDelete,
          ...filteredValues
        } = values

        const formatedValues = {
          ...filteredValues,
          categories: (categoriesChosen || []).map(el => ({
            tuid: el,
            text: categories[Number(el)]
          })),
          goals: (goalsChosen || []).map(el => ({
            tuid: el,
            text: goals[Number(el)].text
          })),
          commitmentsUpdate: Object.entries(commitmentsUpdate).map(el => ({
            tuid: el[0],
            commitment: commitments[el[0]]
          })),
          commitmentsAdd: Object.entries(commitmentsAdd).map(el => ({
            tuid: el[0],
            commitment: commitments[el[0]]
          })),
          commitmentsDelete: Object.entries(commitmentsDelete).map(el => ({
            tuid: el[0],
            commitment: el[1]
          })),
          files: _.has(files, 'fileList')
            ? files.fileList.map(el => el.originFileObj)
            : [],
          filesDelete: Object.keys(filesDelete)
        }

        this.setState({ loading: true }, async () => {
          try {
            const tuid = this.props.frameworkQuery.framework.tuid
            const result = await this.props.itemUpdate({
              variables: {
                ...formatedValues,
                tuid
              }
            })
            if (result.errors) {
              throw result
            }
            Modal.info({
              title: 'Updated',
              content: (
                <p>Framework updated successfully</p>
              ),
              okText: 'Ok',
              onOk: () => this.props.history.push('/profile')
            })
          } catch (err) {
            Modal.error({
              title:
                'An error occured, maybe element with this identificator already exists',
              content: err.errors
                ? err.errors.map(error => (
                  <div key={error.locations.toString()}>{error.message}</div>
                ))
                : err.toString()
            })
            // eslint-disable-next-line no-console
            console.error(err)
          }
          this.setState({ loading: false })
        })
      }
    )
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { frameworkQuery, history } = this.props

    if (frameworkQuery.error) {
      return (
        <Fragment>
          Error!
          <div>
            {frameworkQuery.error ? frameworkQuery.error.message : null}
          </div>
        </Fragment>
      )
    }
    if (frameworkQuery.loading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Spin size="large" />
        </div>
      )
    }
    const { framework } = frameworkQuery

    getFieldDecorator('filesDelete', { initialValue: {} })
    const filesDelete = getFieldValue('filesDelete')
    const files = framework.files.filter(file => !filesDelete[file.tuid])
    getFieldDecorator('commitmentsDelete', { initialValue: [] })
    const commitmentsUpdateInitial = framework.commitments.reduce(
      (accum, commitment) => {
        accum[commitment.tuid] = commitment
        return accum
      },
      {}
    )
    getFieldDecorator('commitmentsUpdate', {
      initialValue: commitmentsUpdateInitial
    })
    getFieldDecorator('commitmentsAdd', { initialValue: [] })
    const commitmentsAdd = getFieldValue('commitmentsAdd')
    const commitmentsUpdate = getFieldValue('commitmentsUpdate')
    const allCommitments = [
      ...Object.values(commitmentsUpdate),
      ...Object.values(commitmentsAdd)
    ].map((k, index) => {
      return (
        <FormItem
          key={k.tuid}
          label={index === 0 ? 'Green Commitments' : ''}
          required={true}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {getFieldDecorator(`commitments[${k.tuid}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please add at least one commitment.'
                }
              ],
              initialValue: k.text
            })(
              <Input placeholder="commitment rule" style={{ marginRight: 8 }} />
            )}

            <Icon
              style={{
                fontSize: '28px',
                visibility: index > 0 ? 'visible' : 'hidden',
                cursor: 'pointer'
              }}
              type="minus-circle-o"
              disabled={
                commitmentsAdd.length === 1 && commitmentsUpdate.length === 1
              }
              onClick={() => this.remove(k.tuid)}
            />
          </div>
        </FormItem>
      )
    })

    return (
      <Loader
        contentBlur={1}
        show={this.state.loading}
        message={'SAVING...'}
        messageStyle={{
          fontSize: '30px'
        }}
      >
        <a href="https://github.com/greenassetswallet/greenassetswallet/wiki/2.-Issuer-Guide#framework-creation" target="_blank" className={styles.documentationTitle}><Icon type="question-circle" /> See documentation</a>
        <Form
          onSubmit={this.onSubmit}
          style={{ maxWidth: '600px', margin: '0 auto', ...this.props.style }}
        >
          <FormItem label="Name">
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: 'Please input your rname!' }
              ],
              initialValue: framework.name
            })(<Input placeholder="framework name" />)}
          </FormItem>
          <FormItem label="Description">
            {getFieldDecorator('description', {
              rules: [
                { required: true, message: 'Please input the description!' }
              ],
              initialValue: framework.description
            })(<Input placeholder="framework description" />)}
          </FormItem>
          <FormItem label="Proceeds categories">
            {getFieldDecorator('categories', {
              rules: [
                { required: true, message: 'Please input your categories!' }
              ],
              initialValue: framework.categories.map(el => el.tuid)
            })(
              <Select mode="multiple" style={{ width: '100%' }}>
                {categories.map((el, index) => (
                  <Option value={index} key={el} style={{ fontWeight: '900' }}>
                    {el}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          {allCommitments}
          <FormItem>
            <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
              <Icon type="plus" /> Add commitment
            </Button>
          </FormItem>
          <FormItem
            label="UN Sustainable Development Goals"
            style={{ flex: 1 }}
          >
            {getFieldDecorator('goals', {
              rules: [
                {
                  required: true,
                  type: 'array'
                }
              ],
              initialValue: framework.goals.map(el => el.tuid)
            })(
              <Select mode="multiple" style={{ width: '100%' }}>
                {goals.map((el, index) => (
                  <Option value={index} key={index} style={{ fontWeight: '900' }}>
                    {el.text}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="Registered Projects">
            {getFieldDecorator('isEveryProjectRegistered', {
              rules: [
                {
                  required: false,
                  message:
                    'Please choose if all projects financed by the proceeds are registered in the Green Assets Wallet!'
                }
              ],
              initialValue: framework.isEveryProjectRegistered || false
            })(
              <Checkbox defaultChecked={framework.isEveryProjectRegistered}>
                All projects financed by the proceeds are registered in the
                Green Assets Wallet
              </Checkbox>
            )}
          </FormItem>
          <FormItem label="Upload framework documents">
            {files.map(file => (
              <div key={file.tuid}>{file.filename} <Button onClick={() => this.handleRemoveFile(file.tuid)} shape="circle" icon="delete" /></div>
            ))}
            {getFieldDecorator('files', {
              rules: [{ required: !files.length, message: 'Please add some docs' }]
            })(
              <Dragger {...propsUploader} accept="application/pdf">
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
            <Button
              type="primary"
              ghost
              onClick={history.goBack}
              style={{
                justifySelf: 'end',
                alignSelf: 'flex-end',
                display: 'inline-block'
              }}
            >
              <span>Cancel</span>
            </Button>
            <Button type="primary" htmlType="submit" ghost>
              Save changes
            </Button>
          </div>
        </Form>
      </Loader>
    )
  }
}

export default FrameworkEdit
