import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Form, Input, Button, Select, Spin, Radio, Modal } from 'antd'
import Loader from 'react-loader-advanced'
import { graphql, compose } from 'react-apollo'
import PropTypes from 'prop-types'
import uuidv4 from 'uuid/v4'
import transformProps from 'transform-props-with'

import { indicators, defaultSpecs } from 'src/constants'

import { report as reportMutation } from 'src/queries/mutations.gql'
import CustomFieldsView from 'src/containers/FormBuilder/FieldsView'
import FormBuilderModal from './FormBuilderModal'

import { users as usersQuery } from 'src/queries/queries.gql'

const { TextArea } = Input
const { Item: FormItem } = Form
const { Option } = Select
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const formId = uuidv4()
@withRouter
@transformProps(oldProps => {
  const { tuid, ...props } = oldProps
  return {
    tuid: tuid || props.match.params.tuid,
    ...props
  }
})
@compose(
  graphql(usersQuery, {
    name: 'validatorsQuery'
  }),
  graphql(reportMutation, {
    name: 'reportMutation'
  })
)
@Form.create()
class ReportCategoryForm extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    validatorsQuery: PropTypes.object.isRequired,
    reportMutation: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired,
    commitments: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired
  }
  state = {
    isFormBuilderActive: false,
    reportType: 'impactReport',
    specMeta: defaultSpecs.impactReport[0],
    loading: false
  }

  handleSubmit = ev => {
    ev.preventDefault()
    const { reportType } = this.state
    this.props.form.validateFieldsAndScroll(
      null,
      {},
      (errors, values) => {
        if (errors) {
          // eslint-disable-next-line no-console
          return console.error(errors)
        }
        this.setState({ loading: true }, async () => {
          try {
            // put validator data into a separate field
            let newValues = { certificationSpec: {} }
            let keys = Object.keys(values)
            let indexCertificationSpec = 0

            for (let i = 0; i < keys.length; ++i) {
              let key = keys[i]
              if (!values.hasOwnProperty(key)) continue
              if (key.startsWith('certificationSpec_')) {
                indexCertificationSpec++
                let originalKey = key.replace(/^certificationSpec_/, '')

                let spec = this.state.specMeta.spec[originalKey]

                newValues.certificationSpec[originalKey] = {
                  tuid: originalKey,
                  value: values[key],
                  spec: { ...spec, index: indexCertificationSpec }
                }
              } else {
                newValues[key] = values[key]
              }
            }
            newValues.type = reportType
            const { certificationSpec, ...metaReportData } = newValues
            for (let key in certificationSpec) {
              let spec = certificationSpec[key]
              if (
                spec.value &&
                Array.isArray( spec.value.fileList )
              ) {
                certificationSpec[key] = {
                  ...spec,
                  value: spec.value.fileList.map(el => el.originFileObj)
                }
              }
            }

            const result = await this.props.reportMutation({
              variables: {
                projectId: this.props.projectId,
                report: {
                  ...metaReportData,
                  type: this.state.reportType,
                  certificationSpec: certificationSpec
                }
              },
              refetchQueries: ['reports']
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
  };

  openFormBuilder = () => {
    this.setState({
      isFormBuilderActive: true
    })
  }

  closeFormBuilder = () => {
    this.setState({
      isFormBuilderActive: false
    })
  }

  onFormBuilderDone = formSpec => {
    //with some flag that form is custom and temporary
    this.setState({
      specMeta: formSpec,
      isFormBuilderActive: false
    })
  }

  reportTypeChange = ev => {
    let specMeta = null
    if (ev.target.value === 'validationReport') {
      specMeta = defaultSpecs.validationReport[0]
    } else if (ev.target.value === 'impactReport') {
      specMeta = defaultSpecs.impactReport[0]
    }
    this.setState({
      reportType: ev.target.value,
      specMeta
    })
  }

  onChangeReportForm = value => {
    if (value === 'customReportForm') {
      this.setState({
        specMeta: null
      })
    } else {
      const { reportType } = this.state
      const specMeta = defaultSpecs[reportType].find(el => el.tuid === value)
      this.setState({ specMeta })
    }
  }

  onChangeIndicator = value => {
    const { reportType } = this.state
    const specMeta = defaultSpecs[reportType].find(({ tuid }) => value === tuid)
    this.setState({ specMeta })
  };

  render() {
    const {
      validatorsQuery,
      form: { getFieldDecorator },
      commitments
    } = this.props

    if (validatorsQuery.error) {
      return (
        <Fragment>
          Error!
          <div>
            {validatorsQuery.error ? validatorsQuery.error.message : null}
          </div>
        </Fragment>
      )
    }
    if (validatorsQuery.loading) {
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

    const { users } = validatorsQuery
    const validators = users.filter(el => el.role === 'validator')
    return (
      <Loader
        contentBlur={1}
        show={this.state.loading}
        message={'SAVING...'}
        messageStyle={{
          fontSize: '30px'
        }}
      >
        {this.state.isFormBuilderActive && (
          <FormBuilderModal
            onCancel={this.closeFormBuilder}
            onOk={this.onFormBuilderDone}
          />
        )}
        <RadioGroup
          value={this.state.reportType}
          onChange={this.reportTypeChange}
        >
          <RadioButton value="impactReport">Impact Report</RadioButton>
          <RadioButton value="validationReport">Validation Report</RadioButton>
        </RadioGroup>
        <Form
          id={formId}
          onSubmit={this.handleSubmit}
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            ...this.props.style,
            backgroundColor: 'rgba(224, 247, 250, 0.4)'
          }}
        >
          <div style={{ display: 'flex' }}>
            {this.state.reportType === 'impactReport' && (
              <FormItem label="Indicator" style={{ flex: 1 }}>
                {getFieldDecorator('indicator', {
                  rules: [
                    {
                      required: true,
                      message: 'Please provide an indicator!'
                    }
                  ],
                  initialValue: Object.keys(indicators)[0]
                })(
                  <Select
                    style={{ width: '100%' }}
                    onChange={this.onChangeIndicator}
                  >
                    {Object.keys(indicators).map(indicator => {
                      return (
                        <Option key={indicator} value={indicator}>
                          {indicators[indicator]}
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </FormItem>
            )}
            {this.state.reportType === 'validationReport' && (
              <Fragment>
                <FormItem label="Name" style={{ flex: 1 }}>
                  {getFieldDecorator('name', {
                    rules: [
                      { required: true, message: 'Please input your name!' }
                    ]
                  })(<Input size="small" />)}
                </FormItem>
                <FormItem
                  label="Validators"
                  style={{ flex: 1, paddingLeft: '10px' }}
                >
                  {getFieldDecorator('validators', {
                    rules: [
                      {
                        required: true,
                        message: 'Please provide a validators!'
                      }
                    ],
                    initialValue: validators.length ? [validators[0].tuid] : []
                  })(
                    <Select style={{ width: '100%' }}>
                      {validators.map(el => {
                        return (
                          <Option
                            key={el.tuid}
                            value={el.tuid}
                            title={`${el.name} | ${el.tuid}`}
                          >
                            <div
                              style={{
                                display: 'flex',
                                borderBottom: 'solid 1px rgba(150,150,150, 0.5)',
                                padding: '2px'
                              }}
                            >
                              <div>
                                <small>{el.tuid}</small>
                              </div>
                              <div style={{ padding: '0 2px' }}>|</div>
                              <strong>{el.name}</strong>
                            </div>
                          </Option>
                        )
                      })}
                    </Select>
                  )}
                </FormItem>
              </Fragment>
            )}
          </div>
          {this.state.reportType === 'validationReport' && (
            <Fragment>
              <FormItem label="Commitment">
                <div
                  style={{
                    display: 'flex',
                    width: '100%'
                  }}
                >
                  {getFieldDecorator('commitment', {
                    rules: [
                      { required: true, message: 'Please choose a commitment!' }
                    ],
                    initialValue: commitments[0].tuid
                  })(
                    <Select
                      style={{ width: '100%' }}
                      onChange={this.onChangeReportForm}
                    >
                      {commitments.map(el => (
                        <Option key={el.tuid} value={el.tuid} title={el.name}>
                          <div
                            style={{
                              borderBottom: 'solid 1px rgba(150,150,150, 0.5)'
                            }}
                          >
                            <small>{el.tuid}</small>{' '}
                            <span style={{ padding: '0 5px' }}>|</span>
                            <strong>{el.text} </strong>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  )}
                </div>
              </FormItem>
              <FormItem label="Report form">
                <div
                  style={{
                    display: 'flex',
                    width: '100%'
                  }}
                >
                  {getFieldDecorator('reportForm', {
                    rules: [
                      {
                        required: true,
                        message: 'Please choose a report form template!'
                      }
                    ],
                    initialValue: this.state.specMeta
                      ? this.state.specMeta.tuid
                      : 'customReportForm'
                  })(
                    <Select
                      style={{ width: '100%' }}
                      onChange={this.onChangeReportForm}
                    >
                      <Option
                        key={'customReportForm'}
                        value={'customReportForm'}
                        title={'CUSTOM REPORT FORM'}
                        onClick={this.openFormBuilder}
                      >
                        <div
                          style={{
                            borderBottom: 'solid 1px rgba(150,150,150, 0.5)'
                          }}
                        >
                          <div>
                            <Button
                              type="primary"
                              htmlType="button"
                              size="small"
                              ghost
                              style={{ width: '100%' }}
                              onClick={this.openFormBuilder}
                            >
                              CUSTOM REPORT FORM
                            </Button>
                          </div>
                        </div>
                      </Option>
                      {defaultSpecs.validationReport.map(el => (
                        <Option key={el.tuid} value={el.tuid} title={el.name}>
                          <div
                            style={{
                              borderBottom: 'solid 1px rgba(150,150,150, 0.5)'
                            }}
                          >
                            <small>{el.tuid}</small>{' '}
                            <span style={{ padding: '0 5px' }}>|</span>
                            <strong>{el.name} </strong>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  )}
                </div>
              </FormItem>
            </Fragment>
          )}
          <h3 style={{ marginTop: '20px' }}>Report data</h3>
          <div
            style={{
              padding: '10px 15px',
              backgroundColor: 'rgba(156,204,101, 0.5)'
            }}
          >
            {this.state.specMeta && this.state.specMeta.spec ? (
              this.state.reportType === 'impactReport' ? (
                <CustomFieldsView
                  fieldsNamePrefix={'certificationSpec'}
                  spec={this.state.specMeta.spec}
                  {...this.props}
                />
              ) : (
                <div
                  style={{ position: 'relative' }}
                  className=" hoverDetector"
                >
                  <div
                    className="showOnHower"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      fontWeight: '700',
                      color: 'red',
                      textAlign: 'center',
                      paddingTop: '10px',
                      fontSize: '18px',
                      zIndex: '100'
                    }}
                  >
                    This form will be filled by a chosen issuer
                  </div>
                  <CustomFieldsView
                    fieldsNamePrefix={'certificationSpec'}
                    specMeta={this.state.specMeta}
                    {...this.props}
                  />
                </div>
              )
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <p style={{ fontSize: '18px', color: 'rgb(91, 91, 91)' }}>
                  Report form is required, and may not be empty <br />
                  please choose a default template or build a
                  <Button
                    type="primary"
                    htmlType="button"
                    size="small"
                    ghost
                    onClick={this.openFormBuilder}
                  >
                    custom one
                  </Button>
                </p>
              </div>
            )}
          </div>
          <div style={{ display: 'flex' }} />
          <FormItem label="Description">
            {getFieldDecorator('description', {
              rules: [
                { required: true, message: 'Please input description!' }
              ]
            })(<TextArea size="small" autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
        <div
          style={{
            marginTop: '5px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <Button type="primary" ghost onClick={this.props.onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" ghost form={formId}>
            Add Report
          </Button>
        </div>
      </Loader>
    )
  }
}

export default ReportCategoryForm
