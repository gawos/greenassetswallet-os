import React, { PureComponent, Fragment } from 'react'
import { Button, Modal, Form, Input, Select, Spin, Icon } from 'antd'
import { graphql, compose } from 'react-apollo'

import CustomFieldsView from '../FormBuilder/FieldsView'
import FormBuilderModal from './FormBuilderModal'

import { defaultSpecs } from 'src/constants'
import { users as usersQuery } from 'src/queries/queries.gql'
import { report as reportMutation } from 'src/queries/mutations.gql'

import styles from './CreateReportForm.module.css'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea

@Form.create()
@compose(
  graphql(usersQuery, {
    options: () => ({
      variables: {
        filter: {
          role: 'validator'
        }
      }
    }),
    name: 'validatorsQuery'
  }),
  graphql(reportMutation, { name: 'reportMutation' })
)
class ValidationReportCreateForm extends PureComponent {
  state = {
    specMeta: defaultSpecs.validationReport[0],
    isFormBuilderActive: false,
    loading: false
  }

  onChangeReportForm = value => {
    if (value === 'customReportForm') {
      this.setState({
        specMeta: null
      })
    } else {
      const specMeta = defaultSpecs.validationReport.find(el => el.tuid === value)
      this.setState({ specMeta })
    }
  }

  handleSubmit = ev => {
    ev.preventDefault()
    const { form, reportMutation, projectId, onCancel } = this.props
    form.validateFieldsAndScroll(
      null,
      {},
      (errors, values) => {
        if (errors) {
          // eslint-disable-next-line no-console
          return console.error(errors)
        }

        this.setState({ loading: true }, async() => {
          try {
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
                  ...spec,
                  index: indexCertificationSpec,
                  value: values[key],
                }
              } else {
                newValues[key] = values[key]
              }
            }

            newValues.type = 'validationReport'
            const { certificationSpec, ...metaReportData } = newValues
            for (let key in certificationSpec) {
              let spec = certificationSpec[key]
              if (
                spec.value &&
                spec.value.fileList &&
                spec.value.fileList[0].originFileObj
              ) {
                certificationSpec[key] = {
                  ...spec,
                  value: spec.value.fileList.map(el => el.originFileObj)
                }
              }
            }
            await reportMutation({
              variables: {
                projectId,
                report: {
                  ...metaReportData,
                  type: 'validationReport',
                  certificationSpec: certificationSpec
                }
              },
              refetchQueries: ['reports', 'project', 'projects']
            })
            form.resetFields()
            this.setState({ loading: false })
            onCancel()
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

  openFormBuilder = () => this.setState({ isFormBuilderActive: true })
  closeFormBuilder = () => this.setState({ isFormBuilderActive: false })

  onFormBuilderDone = formSpec => this.setState({
    specMeta: formSpec,
    isFormBuilderActive: false
  })

  getForm = () => {
    const { validatorsQuery, commitments = [], form } = this.props
    const { specMeta, isFormBuilderActive } = this.state
    const { getFieldDecorator } = form

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
        <div>
          <Spin size="large" />
        </div>
      )
    }

    const { users } = validatorsQuery

    return (
      <Fragment>
         <a href="https://github.com/greenassetswallet/greenassetswallet/wiki/2.-Issuer-Guide#validation-report-creation" target="_blank" className={styles.documentationTitle}><Icon type="question-circle" /> See documentation</a>
        <Form layout="vertical">
          <FormItem label="Name">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input your name!' }]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Validator">
            {getFieldDecorator('validator', {
              rules: [{ required: true, message: 'Please provide a validator!' }],
              initialValue: users.length && users[0].tuid
            })(
              <Select>
                {users.map(el => <Option key={el.tuid} value={el.tuid}>{el.name}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem label="Commitment">
            <div>
              {getFieldDecorator('commitment', {
                rules: [{ required: true, message: 'Please choose a commitment!' }],
                initialValue: commitments[0].tuid
              })(
                <Select>
                  {commitments.map(el => <Option key={el.tuid} value={el.tuid}>{el.text}</Option>)}
                </Select>
              )}
            </div>
          </FormItem>
          <FormItem label="Report form">
            <div>
              {getFieldDecorator('reportForm', {
                rules: [{ required: true, message: 'Please choose a report form template!' }],
                initialValue: specMeta ? specMeta.tuid : 'customReportForm'
              })(
                <Select onChange={this.onChangeReportForm} >
                  <Option
                    key={'customReportForm'}
                    value={'customReportForm'}
                    title={'CUSTOM REPORT FORM'}
                    onClick={this.openFormBuilder}
                  >
                    <div>
                      <Button
                        type="primary"
                        size="small"
                        ghost
                        onClick={this.openFormBuilder}
                      >
                        CUSTOM REPORT FORM
                      </Button>
                    </div>
                  </Option>
                  {defaultSpecs.validationReport.map(el => <Option key={el.tuid} value={el.tuid}>{el.name}</Option>)}
                </Select>
              )}
            </div>
          </FormItem>
          <h3>Report data</h3>
          <div>
            {specMeta && specMeta.spec ? (
              <div className="hoverDetector">
                <div className="showOnHower">
                  This form will be filled by a chosen validator
                </div>
                <CustomFieldsView
                  fieldsNamePrefix={'certificationSpec'}
                  disabled={true}
                  spec={specMeta.spec}
                  {...this.props}
                />
              </div>
            ) : (
              <div>
                <p>
                  Report form is required, and may not be empty <br />
                  please choose a default template or build a
                  <Button
                    type="primary"
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
          <FormItem label="Description">
            {getFieldDecorator('description')(<TextArea rows={4} placeholder="Comment on methodology" />)}
          </FormItem>
        </Form>

        {isFormBuilderActive && (
          <FormBuilderModal
            onCancel={this.closeFormBuilder}
            onOk={this.onFormBuilderDone}
          />
        )}
      </Fragment>
    )
  }

  render() {
    const { visible, onCancel } = this.props

    return (
      <Modal
        width={800}
        visible={visible}
        title="New Validation Report"
        okText="Save Report"
        onCancel={onCancel}
        onOk={this.handleSubmit}
        destroyOnClose
      >
        {this.getForm()}
      </Modal>
    )
  }
}

export default ValidationReportCreateForm
