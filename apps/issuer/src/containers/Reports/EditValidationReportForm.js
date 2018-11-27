import React, { PureComponent, Fragment } from 'react'
import { Button, Modal, Form, Input, Select, Spin } from 'antd'
import { graphql, compose } from 'react-apollo'

import CustomFieldsView from '../FormBuilder/FieldsView'
import FormBuilderModal from './FormBuilderModal'

import { defaultSpecs } from 'src/constants'
import { users as usersQuery } from 'src/queries/queries.gql'
import { reportUpdate as reportUpdateMutation } from 'src/queries/mutations.gql'

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
  graphql(reportUpdateMutation, { name: 'reportUpdate' })
)
class EditValidationReportForm extends PureComponent {
  state = {
    spec: null,
    isFormBuilderActive: false,
    loading: false
  }

  handleSubmit = ev => {
    ev.preventDefault()
    const { form, reportUpdate, onCancel, report } = this.props
    const { spec } = this.state
    form.validateFieldsAndScroll(
      null,
      {},
      (errors, values) => {
        if (errors) {
          // eslint-disable-next-line no-console
          return console.error(errors)
        }
        this.setState({ loading: true }, async () => {
          try {
            let newValues = { certificationSpec: {} }
            let keys = Object.keys(values)
            let indexCertificationSpec = 0

            const defaultReporSpecs = defaultSpecs.validationReport.find(r => r.tuid === report.reportForm)

            const specMeta = spec || {
              tuid: report.reportForm,
              type: 'validationReport',
              name: defaultReporSpecs ? defaultReporSpecs.name : '',
              spec: Object.keys(report.certificationSpec).reduce((acc, key) => {
                acc[key] = {
                  ...report.certificationSpec[key],
                  ...report.certificationSpec[key].spec
                }
                delete acc[key].spec
                return acc
              }, {})
            }

            for (let i = 0; i < keys.length; ++i) {
              let key = keys[i]
              if (!values.hasOwnProperty(key)) continue
              if (key.startsWith('certificationSpec_')) {
                indexCertificationSpec++
                let originalKey = key.replace(/^certificationSpec_/, '')

                let spec = specMeta.spec[originalKey]

                newValues.certificationSpec[originalKey] = {
                  tuid: originalKey,
                  value: values[key],
                  spec: { ...spec, index: indexCertificationSpec }
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

            const result = await reportUpdate({
              variables: {
                tuid: report.tuid,
                report: {
                  ...metaReportData,
                  type: 'validationReport',
                  certificationSpec: certificationSpec
                }
              },
              refetchQueries: ['reports', 'project']
            })

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
        } )
      })
  }

  getForm = () => {
    const { validatorsQuery, commitments = [], form, report } = this.props
    const { spec, isFormBuilderActive } = this.state
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

    const defaultReporSpecs = defaultSpecs.validationReport.find(r => r.tuid === report.reportForm)

    const specMeta = spec || {
      tuid: report.reportForm,
      type: 'validationReport',
      name: defaultReporSpecs ? defaultReporSpecs.name : '',
      spec: Object.keys(report.certificationSpec).reduce((acc, key) => {
        acc[key] = {
          ...report.certificationSpec[key],
          ...report.certificationSpec[key].spec
        }
        delete acc[key].spec
        return acc
      }, {})
    }

    return (
      <Fragment>
        <Form layout="vertical">
          <FormItem label="Name">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input your name!' }],
              initialValue: report.aux.name
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Validator">
            {getFieldDecorator('validator', {
              rules: [{ required: true, message: 'Please provide a validator!' }],
              initialValue: report.validatedBy.tuid,
              hidden: true
            })(
              <Select disabled={true}>
                {users.map(el => <Option key={el.tuid} value={el.tuid}>{el.name}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem label="Commitment">
            <div>
              {getFieldDecorator('commitment', {
                rules: [{ required: true, message: 'Please choose a commitment!' }],
                initialValue: report.commitment.tuid,
                hidden: true
              })(
                <Select disabled={true}>
                  {commitments.map(el => <Option key={el.tuid} value={el.tuid}>{el.text}</Option>)}
                </Select>
              )}
            </div>
          </FormItem>
          <FormItem label="Report form">
            <div>
              {getFieldDecorator('reportForm', {
                rules: [{ required: true, message: 'Please choose a report form template!' }],
                initialValue: report.reportForm,
                hidden: true
              })(
                <Select  disabled={true}  >
                  <Option
                    key={'customReportForm'}
                    value={'customReportForm'}
                    title={'CUSTOM REPORT FORM'}
                  >
                    <div>
                      <Button
                        type="primary"
                        size="small"
                        ghost
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
                  >
                    custom one
                  </Button>
                </p>
              </div>
            )}
          </div>
          <FormItem label="Description">
            {getFieldDecorator('description', {
              initialValue: report.aux.description || ''
            })(<TextArea rows={4} placeholder="Comment on methodology" />)}
          </FormItem>
        </Form>

        {isFormBuilderActive && (
          <FormBuilderModal
            onOk={this.onFormBuilderDone}
          />
        )}
      </Fragment>
    )
  }

  render() {
    const { visible, report, onCancel } = this.props

    return (
      <Modal
        width={800}
        visible={visible}
        title="Edit Validation Report"
        okText="Save Report"
        onCancel={onCancel}
        onOk={this.handleSubmit}
        destroyOnClose
      >
        {!!report && this.getForm()}
      </Modal>
    )
  }
}

export default EditValidationReportForm
