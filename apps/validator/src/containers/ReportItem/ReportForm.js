import React, { Component } from 'react'
import { Form, Modal, Button } from 'antd'
import { graphql, compose } from 'react-apollo'

import CustomFieldsView from 'src/containers/FormBuilder/FieldsView'
import { reportCertification as reportCertificationMutation } from 'src/queries/mutations.gql'

@compose(
  graphql(reportCertificationMutation, {
    name: 'reportCertificationMutation'
  })
)
@Form.create()
class ReportForm extends Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) return
      const {
        data: { certificationSpec, tuid }
      } = this.props

      const certification = {}
      for (let specKey in certificationSpec) {
        let spec = certificationSpec[specKey]
        let value = values[specKey]
        if (spec.type !== 'upload') {
          certification[specKey] = {
            tuid: specKey,
            ...spec,
            value: value
          }
        } else {
          let files = value.fileList.map(el => el.originFileObj)
          certification[spec.tuid] = {
            tuid: specKey,
            ...spec,
            value: files
          }
        }
      }
      await this.props.reportCertificationMutation({
        variables: {
          tuid: tuid,
          certification: certification
        }
      })

      Modal.info({
        title: 'Reported',
        content: <div>Report was sent</div>,
        onOk() {
          window.location.reload()
        }
      })
    })
  }
  render() {
    const { data } = this.props
    return (
      <Form onSubmit={this.handleSubmit}>
        <CustomFieldsView
          {...this.props}
          spec={Object.values(data.certificationSpec) }
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" htmlType="submit" ghost>
            Submit
          </Button>
        </div>
      </Form>
    )
  }
}
export default ReportForm
