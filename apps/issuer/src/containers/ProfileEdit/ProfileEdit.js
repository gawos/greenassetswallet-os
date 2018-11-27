import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { graphql, compose } from 'react-apollo'
import { inject, observer } from 'mobx-react'
import {
  Form,
  Icon,
  Input,
  Button,
  Upload,
  Modal,
  Card,
  Spin,
  Row,
  Col
} from 'antd'

import { user as userQueryTmp } from 'src/queries/queries.gql'
import { userUpdate } from 'src/queries/mutations.gql'

import config from 'config/index'
import styles from './ProfileEdit.module.css'

const { Item: FormItem } = Form
const { TextArea } = Input

const hasErrors = (fieldsError) =>
  Object.keys(fieldsError).some(field => fieldsError[field])

@withRouter
@inject('authStore')
@observer
@compose(
  graphql(userQueryTmp, {
    options: ({authStore}) => {
      const { tuid } = authStore.user
      return {
        variables: {
          tuid
        }
      }
    },
    name: 'userQuery'
  }),
  graphql(userUpdate, {
    name: 'userUpdate'
  })
)
@Form.create()
class ProfileEdit extends Component {
  state = {
    avatarBase64: null
  };

  onSubmit = ev => {
    ev.preventDefault()
    const { form, userQuery, userUpdate, history } = this.props
    form.validateFieldsAndScroll(null, {}, async (errors, values) => {
      if (errors) {
        return
      }

      const { user } = userQuery

      const { avatar, ...filteredValues } = values
      const formattedValues = {
        ...filteredValues
      }
      const avatarsToUpdate = _.has(avatar, 'fileList')
        ? avatar.fileList.map(el => el.originFileObj)
        : []
      if (avatarsToUpdate.length > 0) {
        formattedValues.avatar = avatarsToUpdate
      }

      const result = await userUpdate({
        variables: {
          tuid: user.tuid,
          auxData: { ...formattedValues }
        },
        refetchQueries: ['user']
      })
      if (result.errors) {
        throw result
      }
      Modal.confirm({
        title: 'Edited',
        content: (
          <div>
            <p>User profile was edited</p>
          </div>
        ),
        okText: 'Continue',
        onOk: () => history.push('/profile')
      })
    })
  };

  render() {
    const { userQuery, form } = this.props
    const { avatarBase64 } = this.state
    if (userQuery.error) {
      return (
        <Fragment>
          Error!
          <div>{userQuery.error ? userQuery.error.message : null}</div>
        </Fragment>
      )
    }
    if (userQuery.loading) {
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
    const { user } = userQuery

    const { getFieldDecorator, getFieldsError, isFieldsTouched } = form

    const avatarData =
      user.auxData && user.auxData.avatar && user.auxData.avatar.length > 0
        ? user.auxData.avatar[0]
        : null

    const avatarLink = avatarData
      ? `${config.api}/upload/${avatarData.tuid}.${avatarData.ext}`
      : null

    const avatarSrc = avatarBase64 || avatarLink

    const formHasErrors = hasErrors(getFieldsError())
    const formNotTouched = !isFieldsTouched(['avatar', 'name', 'link', 'description', 'greenObjectives'])
    return (
      <Card>
        <Form onSubmit={this.onSubmit}>
          <Row type="flex" gutter={24}>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('avatar', {
                  rules: [{ required: false, message: 'Please add an avatar' }]
                })(
                  <Upload
                    className={styles.logoUploader}
                    accept="image/*"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      const reader = new FileReader()
                      reader.addEventListener(
                        'load',
                        () => {
                          this.setState({ avatarBase64: reader.result })
                        },
                        false
                      )
                      if (file) {
                        reader.readAsDataURL(file)
                      }
                      return false
                    }}
                  >
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        style={{ width: '100%' }}
                        alt="avatar"
                      />
                    ) : (
                      <div>
                        <Icon type={'plus'} />
                        <div className="ant-upload-text">Add avatar</div>
                      </div>
                    )}
                  </Upload>
                )}
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem label="Name">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Please input your name!' }],
                  initialValue: user.name
                })(<Input />)}
              </FormItem>
              <FormItem label="Website Link">
                {getFieldDecorator('link', {
                  rules: [
                    {
                      required: false,
                      message: 'Please input website link!'
                    }
                  ],
                  initialValue: user.auxData ? user.auxData.link : ''
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>

          <FormItem label="Description">
            {getFieldDecorator('description', {
              rules: [
                {
                  required: false,
                  message: ''
                }
              ],
              initialValue: user.auxData ? user.auxData.description : ''
            })(
              <TextArea
                autosize={{ minRows: 2, maxRows: 10 }}
              />
            )}
          </FormItem>
          <FormItem label="Green Objectives">
            {getFieldDecorator('greenObjectives', {
              rules: [
                {
                  required: false,
                  message: ''
                }
              ],
              initialValue: user.auxData ? user.auxData.greenObjectives : ''
            })(
              <TextArea autosize={{ minRows: 2, maxRows: 10 }} />
            )}
          </FormItem>
          <div className={styles.btns}>
            <Link
              className="ant-btn ant-btn-primary ant-btn-background-ghost"
              to={'/profile'}
            >
              <span>Cancel</span>
            </Link>
            <Button type="primary" htmlType="submit" ghost disabled={formHasErrors || formNotTouched}>
              Save
            </Button>
          </div>
        </Form>
      </Card>
    )
  }
}

export default ProfileEdit
