import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { graphql, compose } from 'react-apollo'
import { inject, observer } from 'mobx-react'
import jwtDecode from 'jwt-decode'

import { Form, Icon, Input, Button, Upload, Modal, Avatar, Card, Spin } from 'antd'

import { user as userQueryTmp } from 'src/queries/queries.gql'
import { userUpdate } from 'src/queries/mutations.gql'

import config from 'config/index'
import cssClasses from './ProfileEdit.module.css'

const { Item: FormItem } = Form
const { TextArea } = Input

@withRouter
@inject('authStore')
@observer
@compose(
  graphql(userQueryTmp, {
    options: props => {
      const { tuid } = jwtDecode(props.authStore.user.jwt)
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
  static propTypes = {
    form: PropTypes.object.isRequired,
    authStore: PropTypes.object
  }

  state = {
    isChangeAvatarActive: false
  }

  onSubmit = ev => {
    ev.preventDefault()
    const { form, userQuery } = this.props
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

      const result = await this.props.userUpdate({
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
        onOk: () => {
          this.props.history.push('/profile')
        }
      })
    })
  };

  onChangeAvatar = update => {
    this.setState({
      isChangeAvatarActive:
        update !== undefined ? update : !this.state.isChangeAvatarActive
    })
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    })
  }

  handleCancelPreview = () => this.setState({ previewVisible: false })

  render() {
    const { userQuery } = this.props
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

    const { getFieldDecorator } = this.props.form
    let currentAvatar = null
    if (user.auxData.avatar && user.auxData.avatar.length) {
      currentAvatar = user.auxData.avatar[0]
    }

    return (
      <Card
        style={{ ...this.props.style, maxWidth: '700px', margin: '0 auto' }}
      >
        <Form onSubmit={this.onSubmit}>
          <div style={{ display: 'flex' }}>
            <FormItem
              style={{
                paddingLeft: '10px',
                width: '138px',
                height: '168px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {currentAvatar && !this.state.isChangeAvatarActive ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Avatar
                    size="large"
                    style={{
                      height: '98px',
                      width: '98px'
                    }}
                    src={`${config.api}/upload/${currentAvatar.tuid}.${
                      currentAvatar.ext
                    }`}
                  />
                  <Button
                    type="primary"
                    ghost
                    style={{ marginTop: '20px' }}
                    onClick={this.onChangeAvatar}
                  >
                    Change Avatar
                  </Button>
                </div>
              ) : (
                <Fragment>
                  {getFieldDecorator('avatar', {
                    rules: [
                      { required: false, message: 'Please add an avatar' }
                    ]
                  })(
                    <Upload
                      className={cssClasses.logoUploader}
                      accept="image/*"
                      listType="picture-card"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        const reader = new FileReader()
                        reader.addEventListener(
                          'load',
                          () => {
                            this.setState({ logoBase64: reader.result })
                          },
                          false
                        )
                        if (file) {
                          reader.readAsDataURL(file)
                        }
                        return false
                      }}
                    >
                      {this.state.logoBase64 ? (
                        <img
                          style={{ maxHeight: '148px', maxWith: '200px' }}
                          src={this.state.logoBase64}
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
                  <div className="clearfix">
                    <Modal
                      visible={this.state.previewVisible}
                      footer={null}
                      onCancel={this.handleCancelPreview}
                    >
                      <img
                        alt="example"
                        style={{ width: '100%' }}
                        src={this.state.previewImage}
                      />
                    </Modal>
                  </div>

                  <Button
                    type="primary"
                    ghost
                    style={{
                      marginTop: '20px',
                      visibility: currentAvatar ? 'visible' : 'hidden'
                    }}
                    onClick={() => this.onChangeAvatar(false)}
                  >
                    Current Avatar
                  </Button>
                </Fragment>
              )}
            </FormItem>

            <FormItem label="Name" style={{ flex: 1, paddingRight: '10px' }}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input your name!' }],
                initialValue: user.name
              })(<Input />)}
            </FormItem>
          </div>
          <div style={{ display: 'flex' }} />
          <FormItem label="Website Link" style={{ flex: 1 }}>
            {getFieldDecorator('link', {
              rules: [
                {
                  required: false,
                  message: 'Please input website link!'
                }
              ],
              initialValue: user.auxData.link
            })(<Input />)}
          </FormItem>
          <FormItem label="Description" style={{ flex: 1 }}>
            {getFieldDecorator('description', {
              rules: [
                {
                  required: false,
                  message: ''
                }
              ],
              initialValue: user.auxData.description
            })(
              <TextArea
                style={{
                  background: 'transparent'
                }}
                autosize={{ minRows: 2, maxRows: 10 }}
              />
            )}
          </FormItem>
          <FormItem label="Green Objectives" style={{ flex: 1 }}>
            {getFieldDecorator('greenObjectives', {
              rules: [
                {
                  required: false,
                  message: ''
                }
              ],
              initialValue: user.auxData.greenObjectives
            })(
              <TextArea
                style={{
                  background: 'transparent'
                }}
                autosize={{ minRows: 2, maxRows: 10 }}
              />
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
              <span>Cancel</span>
            </Link>
            <Button type="primary" htmlType="submit" ghost>
              Save
            </Button>
          </div>
        </Form>
      </Card>
    )
  }
}

export default ProfileEdit
