import React, { PureComponent, Fragment } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { graphql, compose } from 'react-apollo'

import CustomFieldsView from '../FormBuilder/FieldsView'

import { defaultSpecs } from 'src/constants'
import { reportUpdate, reportAndCertificationUpdate } from 'src/queries/mutations.gql'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea

@Form.create()
@compose(
  graphql(reportUpdate, { name: 'reportUpdate' }),
  graphql(reportAndCertificationUpdate, { name: 'reportAndCertificationUpdate' })
)
class EditImpactReportForm extends PureComponent {
  state = {
    specMeta: defaultSpecs.impactReport[0],
    loading: false
  }

  handleSubmit = ev => {
    ev.preventDefault()
    const { form, reportAndCertificationUpdate, onCancel,report } = this.props

    const certification = report.certifications[0]

    form.validateFieldsAndScroll(
      null,
      {},
      async (errors, values) => {
        if (errors) {
          return console.error(errors)
        }
        try {
          await reportAndCertificationUpdate({
            variables: {
              reportTuid: report.tuid,
              report: {
                description: values.description
              },
              certificationTuid: certification.tuid,
              certification: certification.data
            },
            refetchQueries: ['reports', 'project']
          })
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
        }
        this.setState({ loading: false })
      }
    )
  }


  getForm = () => {
    const { form, report } = this.props
    const { getFieldDecorator } = form
    return (
      <Form layout="vertical">
        <FormItem label="Indicator">
          {getFieldDecorator('indicator', {
            rules: [{ required: true, message: 'Please input the title of collection!' }],
            initialValue: report.indicator,
            hidden: true
          })(
            <Select disabled>
              <Option key="energy_generation">Energy Generation</Option>
              <Option key="energy_consumption">Energy Consumption</Option>
              <Option key="emission_avoidance">Emission Avoidance</Option>
              <Option key="energy_performance">Energy Performance</Option>
              <Option key="miscellaneous">Miscellaneous</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="Report Data">
          <CustomFieldsView
            fieldsNamePrefix={'certificationSpec'}
            spec={report.certifications[0].data}
            disabled={true}
            {...this.props}
          />
        </FormItem>
        <FormItem label="Description">
          {getFieldDecorator('description', {
            initialValue: report.aux.description || ''
          })(<TextArea rows={4} placeholder="Comment on methodology" />)}
        </FormItem>
      </Form>
    )
  }

  render() {
    const { visible, report, onCancel } = this.props

    return (
      <Modal
        width={800}
        visible={visible}
        title="Edit Impact Report"
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

export default EditImpactReportForm
