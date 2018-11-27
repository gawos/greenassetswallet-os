import React, { PureComponent } from 'react'
import { Modal, Form, Input, Select, Icon } from 'antd'
import { graphql, compose } from 'react-apollo'

import CustomFieldsView from '../FormBuilder/FieldsView'

import { defaultSpecs } from 'src/constants'

import { report as reportMutation } from 'src/queries/mutations.gql'

import styles from './CreateReportForm.module.css'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea

@Form.create()
@compose(graphql(reportMutation, { name: 'reportMutation' }))
class CreateImpactReportForm extends PureComponent {
    state = {
      specMeta: defaultSpecs.impactReport[0],
      loading: false
    }
    handleSubmit = ev => {
      ev.preventDefault()
      const { form, reportMutation, projectId, onOk } = this.props
      form.validateFieldsAndScroll(
        (errors, values) => {
          if (errors) {
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
                    ...spec,
                    index: indexCertificationSpec,
                    value: values[key] }
                } else {
                  newValues[key] = values[key]
                }
              }
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
                    type: 'impactReport',
                    certificationSpec: certificationSpec
                  }
                },
                refetchQueries: ['reports', 'project',  'projects']
              })
              form.resetFields()
              this.setState({ loading: false }, onOk)
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
            }
          })
        })
    }

    onChangeIndicator = value => {
      const specMeta = defaultSpecs.impactReport.find(({ tuid }) => value === tuid)
      this.setState({ specMeta })
    }

    render() {
      const { visible, onCancel, form } = this.props
      const { getFieldDecorator } = form
      return (
        <Modal
          width={800}
          visible={visible}
          title="New Impact Report"
          okText="Save Report"
          onCancel={onCancel}
          onOk={this.handleSubmit}
        >
          <a href="https://github.com/greenassetswallet/greenassetswallet/wiki/2.-Issuer-Guide#impact-report-creation" target="_blank" className={styles.documentationTitle}><Icon type="question-circle" /> See documentation</a>
          <Form layout="vertical">
            <FormItem label="Indicator">
              {getFieldDecorator('indicator', {
                rules: [{ required: true, message: 'Please input the title of collection!' }],
                initialValue: 'energy_generation'
              })(
                <Select onChange={this.onChangeIndicator}>
                  <Option key="energy_generation">Energy Generation</Option>
                  <Option key="energy_performance">Energy Performance</Option>
                  <Option key="emission_avoidance">Emission Avoidance</Option>
                  <Option key="miscellaneous">Miscellaneous</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="Report Data">
              <CustomFieldsView
                fieldsNamePrefix={'certificationSpec'}
                spec={this.state.specMeta.spec}
                {...this.props}
              />
            </FormItem>
            <FormItem label="Description">
              {getFieldDecorator('description')(<TextArea rows={4} placeholder="Comment on methodology" />)}
            </FormItem>
          </Form>
        </Modal>
      )
    }
}

export default CreateImpactReportForm
