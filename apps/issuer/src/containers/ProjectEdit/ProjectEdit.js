import React, { PureComponent, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import transformProps from 'transform-props-with'
import { graphql, compose } from 'react-apollo'
import Loader from 'react-loader-advanced'
import currencyCodesData from 'currency-codes/data'
import { Form, Spin, Icon, Input, Button, Row, Col, Upload, Select, InputNumber, Card, Modal } from 'antd'

import config from 'config/index'
import { regions } from 'src/constants'

import { project as projectQuery } from 'src/queries/queries.gql'
import { projectUpdate as projectUpdateMutation } from 'src/queries/mutations.gql'

import styles from './ProjectEdit.module.css'

const { TextArea } = Input
const { Dragger } = Upload
const { Item: FormItem } = Form
const { Option } = Select

const propsUploadPdf = {
  name: 'files',
  accept: 'application/pdf',
  multiple: true,
  beforeUpload: () => false
}

@withRouter
@transformProps(oldProps => {
  const { tuid } = oldProps
  return {
    ...oldProps,
    tuid: tuid || oldProps.match.params.tuid
  }
})
@compose(
  graphql(projectQuery, {
    options: ({ tuid }) => ({
      variables: {
        tuid
      }
    }),
    name: 'projectQuery'
  })
)
@compose(graphql(projectUpdateMutation, { name: 'projectUpdate' }))
@Form.create()
class ProjectCreate extends PureComponent {
  state = {
    loading: false,
    logoBase64: null
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
    const { form, projectUpdate, history, onDidCreate, projectQuery } = this.props
    form.validateFieldsAndScroll(null, {},  (errors, values) => {
      if (errors) return
      const { files = {}, logo = {}, filesDelete = {}, ...restValues } = values

      const formattedValues = {
        ...restValues,
        filesListList: [
          {
            tuid: 'files',
            spec: {},
            files: files.fileList && files.fileList.length > 0
              ? files.fileList.map(el => el.originFileObj)
              : []
          },
          {
            tuid: 'logo',
            spec: {},
            files: logo.fileList && logo.fileList.length > 0
              ? logo.fileList[0].originFileObj
              : []
          }
        ],
        filesDelete: Object.keys(filesDelete)
      }

      this.setState({ loading: true }, async () => {
        try {
          const { project } = projectQuery
          const result = await projectUpdate({
            variables: {
              tuid: project.tuid,
              framework: project.framework.tuid,
              pool: project.poolTuid,
              logo: logo.fileList && logo.fileList.length > 0 ? null : project.logo,
              ...formattedValues
            }
          })

          if (result.errors) {
            throw result
          }
          Modal.confirm({
            title: 'Updated',
            content: <div>Project update successful</div>,
            cancelText: 'Continue',
            okText: 'View project details',
            onOk: () => history.push(`/projects/${result.data.projectUpdate.tuid}`),
            onCancel: () => history.push('/projects')
          })
          onDidCreate && onDidCreate(result)
        } catch (err) {
          Modal.error({
            title: 'An error occurred',
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

    })
  }

  render() {
    const { form, projectQuery } = this.props
    const { loading, logoBase64 } = this.state

    const { getFieldDecorator, getFieldValue } = form

    if (projectQuery.loading) {
      return (
        <Card className="empty-card">
          <Spin size="large" />
        </Card>
      )
    }
    if (projectQuery.error) {
      return (
        <Fragment>
        Error!
          <div>{projectQuery.error ? projectQuery.error.message : null}</div>
        </Fragment>
      )
    }

    const { project } = projectQuery
    if (!project) {
      return (
        <Card className="empty-card">
          Project does not exists or was removed
        </Card>
      )
    }


    const logoData =
      project.logo && project.logo.length > 0
        ? project.logo[0]
        : null

    const logoLink = logoData
      ? `${config.api}/upload/${logoData.tuid}.${logoData.ext}`
      : null

    const logoSrc = logoBase64 || logoLink

    getFieldDecorator('filesDelete', { initialValue: {} })
    const filesDelete = getFieldValue('filesDelete')
    const files = project.files.filter(file => !filesDelete[file.tuid])

    return (
      <Card>
        <Loader
          contentBlur={1}
          show={loading}
          message={'SAVING...'}
        >
        <a href="https://github.com/greenassetswallet/greenassetswallet/wiki/2.-Issuer-Guide#create-project" target="_blank" className={styles.documentationTitle}><Icon type="question-circle" /> See documentation</a>
          <Form onSubmit={this.onSubmit}>
            <Row type="flex" gutter={24} >
              <Col span={8}>
                <FormItem label="Upload project image">
                  {getFieldDecorator('logo', {
                    rules: [{ required: false, message: 'Please add a logo' }]
                  })(
                    <Upload
                      accept="image/*"
                      listType="picture-card"
                      fileList={[]}
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
                      {logoSrc ? (
                        <img
                          style={{ width: '100%' }}
                          src={logoSrc}
                          alt="logo"
                        />
                      ) : (
                        <div>
                          <Icon type="plus" />
                          <div className="ant-upload-text">Add logo</div>
                        </div>
                      )}
                    </Upload>
                  )}
                </FormItem>
              </Col>
              <Col span={16}>
                <FormItem label="Name">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Please input a project name!' }],
                    initialValue: project.name
                  })(<Input />)}
                </FormItem>
                <Row type="flex" gutter={24}>
                  <Col span={12}>
                    <FormItem label="Amount allocated">
                      {getFieldDecorator('amount', {
                        rules: [{ required: true, message: 'Please input an allocated amount!' }],
                        initialValue: project.amount
                      })(<InputNumber style={{ width: '100%' }} />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Currency">
                      {getFieldDecorator('currency', {
                        rules: [{ required: true, message: 'Please select a currency!' }],
                        initialValue: project.currency
                      })(
                        <Select showSearch>
                          {currencyCodesData.map(el => (
                            <Option key={el.code} value={el.code}>
                              {el.currency} - {el.code}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <FormItem label="Region">
                  {getFieldDecorator('region', {
                    rules: [{ required: true, message: 'Please select a region' }],
                    initialValue: project.region
                  })(
                    <Select>
                      {Object.keys(regions).map(id => (
                        <Option key={id} value={id}>{regions[id]}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <FormItem label="Upload project files">
              <div className="ant-upload-list ant-upload-list-text">
                {files.map(file => (
                  <div key={file.tuid}>{file.filename} <Button onClick={() => this.handleRemoveFile(file.tuid)} shape="circle" icon="delete" /></div>
                ))}
              </div>
              {getFieldDecorator('files')(
                <Dragger {...propsUploadPdf}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="download" style={{ color: '#CDD1DD' }} />
                  </p>
                  <p className="ant-upload-text">
                    Upload by clicking here, or drag files to this area
                  </p>
                </Dragger>
              )}
            </FormItem>

            <FormItem label="Description">
              {getFieldDecorator('description', {
                rules: [{ message: 'Please input a project description!' }],
                initialValue: project.description
              })(<TextArea autosize={{ minRows: 3, maxRows: 10 }} />)}
            </FormItem>

            <div className={styles.btns}>
              <Link
                className="ant-btn ant-btn-primary ant-btn-background-ghost"
                to={'/projects'}
              >
                Cancel
              </Link>
              <Button type="primary" htmlType="submit" ghost>Edit</Button>
            </div>
          </Form>
        </Loader>
      </Card>
    )
  }
}

export default ProjectCreate
