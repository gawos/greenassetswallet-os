import React, { Component, Fragment } from 'react'
import { Input, InputNumber, Button, Checkbox, Form, Icon } from 'antd'
import PropTypes from 'prop-types'
import {ITEM_TYPES} from './constants'
import uuidv4 from 'uuid/v4'
const {Item: FormItem} = Form

@Form.create()
class ConfigureItem extends Component {
  static propTypes = {
    onDone: PropTypes.func.isRequired
  }

  addOption = () => {
    const { form } = this.props
    // can use data-binding to get
    const optionKeys = form.getFieldValue('optionKeys')
    // can use data-binding to set
    // important! notify form to detect changes
    const newOptions = { ...optionKeys}
    const key = uuidv4()
    newOptions[key] = { key }
    form.setFieldsValue({
      optionKeys:newOptions
    })
  }

  deleteOption = (key) => {
    const { form } = this.props
    // can use data-binding to get
    const optionKeys = form.getFieldValue('optionKeys')
    // can use data-binding to set
    // important! notify form to detect changes
    const newOptionsKeys = { ...optionKeys}
    delete newOptionsKeys[key]
    form.setFieldsValue({
      optionKeys:newOptionsKeys
    })
  }

  get AuxConfigure() {
    const { editItemSpec } = this.props
    const { getFieldDecorator, getFieldValue } = this.props.form
    if(editItemSpec.type === ITEM_TYPES.inputNumber){
      return  (
        <Fragment>
          <FormItem label="min">
            {getFieldDecorator('aux[min]', {
              initialValue: editItemSpec.aux.min
            })(
              <InputNumber
                placeholder="not set"
              />
            )}
          </FormItem>
          <FormItem label="max">
            {getFieldDecorator('aux[max]', {
              initialValue: editItemSpec.aux.max
            })(
              <InputNumber
                placeholder="not set"
              />
            )}
          </FormItem>
        </Fragment>)
    } else if(editItemSpec.type === ITEM_TYPES.select){
      const optionsExistsMap = (editItemSpec.options)
        .reduce( (accum, {key, title}) =>
          ({
            ...accum,
            [key]: {
              key, title
            }
          }) , {})
      getFieldDecorator('optionKeys', { initialValue: {...optionsExistsMap } })
      const optionsKeys = getFieldValue('optionKeys')
      return  (
        <Fragment>
          <div>Add select options</div>
          <div style={{paddingBottom: '8px'}}>
            {Object.values( optionsKeys ).map(({key, title }, index) =>
              <div key={key} style={{padding: '15px 4px', borderBottom:'1px solid rgba(155,155,155,0.8)'}}>
                <FormItem label="key">
                  {getFieldDecorator(`options[${key}][key]`, {
                    rules: [{ required: true, message: 'Key is required'}],
                    initialValue: key
                  })(
                    <Input placeholder="key"/>
                  )}
                </FormItem>
                <FormItem label="title">
                  {getFieldDecorator(`options[${key}][title]`, {
                    rules: [{ required: true, message: 'Title is required'}],
                    initialValue: title
                  })(
                    <Input placeholder="Title"/>
                  )}
                </FormItem>
                {index > 0 &&
                <div style={{display: 'flex', justifyContent: 'flex-end', paddingTop: '3px'}}>
                  <Button
                    onClick={() => this.deleteOption(key)}
                    size="small"
                    htmlType="button"
                    type="danger"
                    ghost>
                      Delete
                  </Button>
                </div>
                }
              </div>
            )}
          </div>
          <Button
            htmlType="button"
            type="dashed"
            onClick={this.addOption} style={{ width: '100%' }}>
            <Icon type="plus" /> Add option
          </Button>
        </Fragment>)
    } else if(editItemSpec.type === ITEM_TYPES.radio){

      const optionsExistsMap = (editItemSpec.options )
        .reduce( (accum, {key, title}) =>
          ({
            ...accum,
            [key]: {
              key, title
            }
          }) , {})
      getFieldDecorator('optionKeys', { initialValue: {...optionsExistsMap } })
      const optionsKeys = getFieldValue('optionKeys')
      return  (
        <Fragment>
          <div>Add radio options</div>
          <div style={{paddingBottom: '8px'}}>
            {Object.values( optionsKeys ).map(({key, title }, index) =>
              <div key={key} style={{padding: '15px 4px', borderBottom:'1px solid rgba(155,155,155,0.8)'}}>
                <FormItem label="key">
                  {getFieldDecorator(`options[${key}][key]`, {
                    rules: [{ required: true, message: 'Key is required'}],
                    initialValue: key
                  })(
                    <Input placeholder="key"/>
                  )}
                </FormItem>
                <FormItem label="title">
                  {getFieldDecorator(`options[${key}][title]`, {
                    rules: [{ required: true, message: 'Title is required'}],
                    initialValue: title
                  })(
                    <Input placeholder="Title"/>
                  )}
                </FormItem>
                {index > 1 &&
                <div style={{display: 'flex', justifyContent: 'flex-end', paddingTop: '3px'}}>
                  <Button
                    onClick={() => this.deleteOption(key)}
                    size="small"
                    htmlType="button"
                    type="danger"
                    ghost>
                      Delete
                  </Button>
                </div>
                }
              </div>
            )}
          </div>
          <Button
            htmlType="button"
            type="dashed"
            onClick={this.addOption} style={{ width: '100%' }}>
            <Icon type="plus" /> Add option
          </Button>
        </Fragment>)
    }  else if(editItemSpec.type === ITEM_TYPES.year){
      return  (
        <Fragment>
          <div>Choose year range</div>
          <div style={{paddingBottom: '8px'}}>
            <FormItem label="start year">
              {getFieldDecorator('startYear', {
                rules: [{ required: true, message: 'Key is required'}],
                initialValue: editItemSpec.startYear
              })(
                <InputNumber />
              )}
            </FormItem>
            <FormItem label="end year">
              {getFieldDecorator('endYear]', {
                rules: [{ required: true, message: 'Title is required'}],
                initialValue: editItemSpec.endYear
              })(
                <InputNumber />
              )}
            </FormItem>
          </div>
        </Fragment>)
    }
    return null
  }

  onDone = ev => {
    ev.preventDefault( )
    this.props.form.validateFieldsAndScroll ((errors, values) => {
      const newValues = {...values}
      delete newValues.optionKeys
      this.props.onDone(errors, newValues)
    })
  }
  onCancel = ev => {
    const { editItemSpec } = this.props
    this.props.onCancel(editItemSpec.tuid)
  }
  render() {
    const { editItemSpec } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.onDone}>
        <h2>Configure Input Item</h2>
        <FormItem label="Title">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input an item title' }],
            initialValue: editItemSpec.title
          })(
            <Input
              placeholder="enter a title"
            />
          )}
        </FormItem>
        <FormItem label="Key">
          {getFieldDecorator('key', {
            rules: [{ required: true, message: 'Please input an item key' }],
            initialValue: editItemSpec.key
          })(
            <Input
              placeholder="enter a key"
            />
          )}
        </FormItem>
        {getFieldDecorator('isRequired', {
          rules: [],
          initialValue: editItemSpec.isRequired || false,
          valuePropName: 'checked'
        })(
          <Checkbox
            style={{ marginTop: '10px' }}
          >
          Is required
          </Checkbox>
        )}
        {
          this.AuxConfigure
        }
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '20px'
          }}
        >
          <Button htmlType="reset" type="primary" ghost onClick={this.onCancel}>
            Cancel
          </Button>
          <Button htmlType="submit" type="primary" ghost>
            Done
          </Button>
        </div>
      </Form>
    )
  }
}

export default ConfigureItem