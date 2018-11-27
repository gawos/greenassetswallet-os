import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import PropTypes from 'prop-types'
import _ from 'lodash'
import currencyCodesData from 'currency-codes/data'
import Loader from 'react-loader-advanced'
import { observer, inject } from 'mobx-react'

import {
  Form,
  Icon,
  Input,
  Button,
  Modal,
  Upload,
  Table,
  Select,
  InputNumber,
  Card
} from 'antd'

//app modules
import config from 'config/index'
import { project as projectMutation } from 'src/queries/mutations.gql'
import Framework from 'src/containers/Framework'

import cssClasses from './ProjectCreate.module.css'

const { Column } = Table
const { TextArea } = Input
const { Dragger } = Upload
const { Item: FormItem } = Form
const { Option } = Select

const propsUploadPdf = {
  name: 'files',
  accept: 'application/pdf',
  multiple: true,
  beforeUpload: file => false
}

const regions = [
  {
    id: 'europe',
    name: 'Europe'
  },
  {
    id: 'asia',
    name: 'Asia'
  },
  {
    id: 'africa',
    name: 'Africa'
  },
  {
    id: 'north_america',
    name: 'North America'
  },
  {
    id: 'south_america',
    name: 'South America'
  },
  {
    id: 'oceania',
    name: 'Oceania'
  }
]

@inject('authStore')
@observer
@withRouter
@compose(
  graphql(projectMutation, {
    name: 'projectCreate'
  })
)
@Form.create()
class ProjectCreate extends Component {
  static propTypes = {
    form: PropTypes.object
  }

  static validatePoneNumber = (rule, value, callback) => {
    if (!value || value.match(/^\d+(-{0,1}\d{1,20})*$/)) {
      callback()
    } else {
      callback(new Error('Phone format is invalid'))
    }
  }

  static validateEmail = (rule, value, callback) => {
    // eslint-disable-next-line
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    if (!value || value.match(re)) {
      callback()
    } else {
      callback(new Error('Email format is invalid'))
    }
  }

  state = {
    loading: false
  }

  validateChooseFramework = (rule, value, callback) => {
    const { getFieldValue } = this.props.form

    const frameworkId = getFieldValue('framework')
    if (!frameworkId) {
      callback(new Error('user must choose framework'))
    } else {
      callback()
    }
  }

  onSubmit = ev => {
    ev.preventDefault()
    const { form } = this.props
    form.validateFieldsAndScroll(null, {},  (errors, values) => {
      //create a BOND
      if (errors) return
      const { files, logo, ...restValues } = values

      const formattedValues = {
        ...restValues,
        filesListList: [
          {
            tuid: 'files',
            spec: {},
            files: _.has(files, 'fileList')
              ? files.fileList.map(el => el.originFileObj)
              : []
          },
          {
            tuid: 'logo',
            spec: {},
            files: _.has(logo, 'fileList')
              ? logo.fileList.map(el => el.originFileObj)
              : []
          }
        ]
      }


      this.setState({ loading: true },  async () => {
        try {
          const result = await this.props.projectCreate({
            variables: {
              ...formattedValues
            }
          })
          if (result.errors) {
            throw result
          }
          Modal.confirm({
            title: 'Created',
            content: <div>Project creation successful</div>,
            cancelText: 'Continue',
            okText: 'View project details',
            onOk: () => {
              this.props.history.push(`/projects/${result.data.project.tuid}`)
            },
            onCancel: () => {
              this.props.history.push('/projects')
            }
          })
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

  onChooseFramework = record => {
    const { setFieldsValue } = this.props.form
    setFieldsValue({
      framework: record.tuid
    })
  }

  renderFrameworkActions = framework => {
    const { getFieldValue } = this.props.form

    const frameworkId = getFieldValue('framework')
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          ghost
          disabled={frameworkId === framework.tuid ? true : false}
          onClick={() => this.onChooseFramework(framework)}
        >
          {frameworkId === framework.tuid ? 'Chosen' : 'Choose'}
        </Button>
      </div>
    )
  }

  renderFrameworkFileLink = (value, record) => {
    return (
      <Fragment>
        <span>{record.filename}</span>
        <a
          href={`${config.api}/upload/${record.tuid}.${record.ext}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ paddingLeft: '10px' }}
        >
          Download
        </a>
      </Fragment>
    )
  }
  renderExpendedFrameworkView = record => {
    return (
      <Fragment>
        {/*<h3>Green Commitments</h3>*/}
        <Table
          rowKey="tuid"
          size="small"
          dataSource={record.commitments}
          pagination={{
            hideOnSinglePage: true
          }}
        >
          {/*<Column key={'index'} render={(value, record, index) => index} />*/}
          <Column
            key={'commitment'}
            title="Green Commitments"
            dataIndex="text"
          />
        </Table>
        <br />
        {/*<h3>Files</h3>*/}
        <Table
          rowKey="tuid"
          size="small"
          dataSource={record.files}
          pagination={{
            hideOnSinglePage: true
          }}
        >
          {/*<Column key={'index'} render={(value, record, index) => index} />*/}
          <Column
            key={'fileName'}
            title="Files"
            render={this.renderFrameworkFileLink}
          />
        </Table>
      </Fragment>
    )
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
            Create Project
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
         <a href="https://github.com/greenassetswallet/greenassetswallet/wiki/2.-Issuer-Guide#create-project" target="_blank" className={cssClasses.documentationTitle}><Icon type="question-circle" /> See documentation</a>
          <Form onSubmit={this.onSubmit}>
            <FormItem label="Name">
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: 'Please input a project name!' }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="Description">
              {getFieldDecorator('description', {
                rules: [{ message: 'Please input a project description!' }]
              })(<TextArea autosize={{ minRows: 3, maxRows: 10 }} />)}
            </FormItem>

            <FormItem label="Region">
              {getFieldDecorator('region', {
                rules: [{ required: true, message: 'Please select a region' }],
                initialValue: regions[0].id
              })(
                <Select>
                  {regions.map(({ id, name }) => (
                    <Option key={id} value={id}>
                      {name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <div>
              <p>
                Note: The <strong>Area</strong> and
                {' '}
                <strong>Baseline energy performance</strong> values only apply
                to green building renovation and construction projects.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormItem label="Upload project image">
                {getFieldDecorator('logo', {
                  rules: [{ required: false, message: 'Please add a logo' }]
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
                        alt="logo"
                      />
                    ) : (
                      <div>
                        <Icon type={'plus'} />
                        <div className="ant-upload-text">Add logo</div>
                      </div>
                    )}
                  </Upload>
                )}
              </FormItem>

              <FormItem label="Upload project files">
                {getFieldDecorator('files', {
                  rules: [
                    { required: false, message: 'Please choose a framework' }
                  ]
                })(
                  <Dragger style={{ padding: '10px' }} {...propsUploadPdf}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="download" style={{color: '#CDD1DD'}} />
                    </p>
                    <p className="ant-upload-text">
                      Upload by clicking here, or drag files to this area
                    </p>
                  </Dragger>
                )}
              </FormItem>
            </div>

            <div style={{ display: 'flex' }}>
              <FormItem label="Amount allocated" style={{ flex: 1 }}>
                {getFieldDecorator('amount', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input an allocated amount!'
                    }
                  ]
                })(<InputNumber style={{ width: '100%' }} />)}
              </FormItem>
              <div style={{ width: '22px' }} />
              <FormItem label="Currency" style={{ flex: 1 }}>
                {getFieldDecorator('currency', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select a currency!'
                    }
                  ],
                  initialValue: 'EUR'
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
            </div>

            <div style={{ display: 'flex' }}>
              <FormItem label="Framework" required style={{ width: '100%' }}>
                <Fragment>
                  {this.props.form.getFieldValue('framework') && (
                    <Fragment>
                      <div>Chosen Framework Id</div>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <strong>
                          {this.props.form.getFieldValue('framework')}
                          {' '}
                        </strong>
                      </div>
                    </Fragment>
                  )}
                  {getFieldDecorator('framework', {
                    rules: [
                      {
                        required: false,
                        validator: this.validateChooseFramework,
                        message: 'Please add some docs'
                      }
                    ]
                  })(<Framework renderActions={this.renderFrameworkActions} />)}
                </Fragment>
              </FormItem>
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
                to={'/projects'}
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

export default ProjectCreate
