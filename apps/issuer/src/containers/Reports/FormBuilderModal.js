import React, { Component } from 'react'
import { Modal } from 'antd'
import PropTypes from 'prop-types'

import FormBuilder from 'src/containers/FormBuilder'

class FormBuilderModal extends Component {
  static propTypes = {
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }
  formBuilder = null
  onOk = fieldsSpecs => {
    /*  this.formBuilder.child beacause FormBuilder is inside an highOrder component */
    const metaFormData = {
      tuid: null,
      type: 'validationReport',
      name: 'Validation Report'
    }
    this.props.onOk({ ...metaFormData, spec: fieldsSpecs })
  }
  render() {
    return (
      <Modal
        width="98%"
        title="Form builder"
        visible={true}
        footer={null}
        onCancel={this.props.onCancel}
        okText="Ok"
        cancelText="Cancel"
        maskClosable={false}
      >
        <FormBuilder
          ref={ref => {
            this.formBuilder = ref
          }}
          onOk={this.onOk}
          onCancel={this.props.onCancel}
        />
      </Modal>
    )
  }
}

export default FormBuilderModal
