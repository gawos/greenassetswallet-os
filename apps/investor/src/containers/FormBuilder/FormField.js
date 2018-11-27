import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'
import {
  Icon,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Upload,
  Select,
  Radio
} from 'antd'
import moment from 'moment'
//app modules
import { GenerateFieldSpec } from './FieldSpec'
import { ITEM_TYPES } from './constants'
import cssClasses from './FormField.module.css'

const { Dragger } = Upload
const { RangePicker } = DatePicker
const { Item: FormItem } = Form
const { Option } = Select
const { Group: RadioGroup } = Radio

const draggerProps = {
  multiple: true,
  accept: 'application/pdf',
  beforeUpload: () => false
}
const ItemTypes = {
  BOX: 'box'
}
const boxSource = {
  beginDrag(props) {
    return props.spec
  }
}

@DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class FormItemPrototype extends PureComponent {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    name: PropTypes.string,
    spec: PropTypes.object.isRequired
  }

  render() {
    const { connectDragSource } = this.props
    const spec = GenerateFieldSpec[this.props.spec.type]()
    return connectDragSource(
      <div>
        <FormFieldToUse {...this.props} spec={spec} />
      </div>
    )
  }
}

class FormItemConfigurable extends PureComponent {
  static propTypes = {
    spec: PropTypes.object.isRequired,
    onConf: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
  }

  render() {
    const { name, type, spec } = this.props
    let upperStyle = {}
    let borderStyle = {}
    if (type === 'upload') {
      upperStyle = { ...upperStyle, maxWidth: '280px' }
    }
    if (spec.aux.active) {
      borderStyle = { border: '2px dashed  rgb(33,150,243)' }
    } else {
      borderStyle = { border: '1px dashed rgba(91,91,91,0.8)' }
    }
    return (
      <div style={{ ...upperStyle, padding: '10px' }}>
        <div
          style={{
            padding: '10px',
            ...borderStyle
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Icon type="swap" className={`pointer ${cssClasses.itemButton}`} />
            <Icon
              type="setting"
              className={`pointer ${cssClasses.itemButton}`}
              onClick={() => this.props.onConf(this.props.spec.tuid)}
            />
            <Icon
              type="delete"
              className={`pointer ${cssClasses.itemButton}`}
              onClick={() => this.props.onRemove(this.props.spec.tuid)}
            />
          </div>

          <FormFieldToUse {...this.props} />
          <div>
            <div>Specefication</div>
            <div>key: {spec.key}</div>
          </div>
        </div>
      </div>
    )
  }
}

class FormFieldToUse extends PureComponent {
  static defaultProps = {
    form: {
      getFieldDecorator: () => (el) => el
    }
  }

  render() {
    let { spec, fieldsNamePrefix } = this.props
    const {
      getFieldDecorator
    } = this.props.form

    let keyWithPrefix = spec.key
    if (fieldsNamePrefix) {
      keyWithPrefix = `${fieldsNamePrefix}_${keyWithPrefix}`
    }

    switch (spec.type) {
      case ITEM_TYPES.inputText:
        return (
          <FormItem label={`${spec.title}`} required={spec.isRequired}>
            {getFieldDecorator(keyWithPrefix, {
              rules: [
                {
                  required: !this.props.disabled && spec.isRequired,
                  message: `Please input ${spec.title}`
                }
              ],
              initialValue: spec.value
            })(
              <Input
                disabled={this.props.disabled}
                className={cssClasses.item}
              />
            )}
          </FormItem>
        )
      case ITEM_TYPES.inputNumber:{
        let props = {}
        if(spec.aux.min ){
          props.min = Number(spec.aux.min)
        }
        if(spec.aux.max ){
          props.max = Number(spec.aux.max)
        }
        return (
          <FormItem label={`${spec.title}`} required={spec.isRequired}>
            {getFieldDecorator(keyWithPrefix, {
              rules: [
                {
                  required: !this.props.disabled && spec.isRequired,
                  message: `Please input ${spec.title}`
                },

              ],
              initialValue: spec.value
            })(
              <InputNumber
                disabled={this.props.disabled}
                formatter={value => `${value} ${spec.unit || ''}`}
                parser={value => value.replace(new RegExp(`${spec.unit}|[^0-9]`, 'gi'), '')}
                {...props}
                className={cssClasses.item}
              />
            )}
          </FormItem>
        )
      }
      case ITEM_TYPES.select:
        return (
          <FormItem label={`${spec.title}`} required={spec.isRequired}>
            {getFieldDecorator(keyWithPrefix, {
              rules: [
                {
                  required: !this.props.disabled && spec.isRequired,
                  message: `Please input ${spec.title}`
                },

              ],
              initialValue: spec.value
            })(
              <Select

                disabled={this.props.disabled}
                className={cssClasses.item}
              >
                { (spec.options).map( ({key, title}) => <Option key={key} value={key}>{title}</Option>)}
              </Select>
            )}
          </FormItem>
        )
      case ITEM_TYPES.date:
        return (
          <FormItem label={`${spec.title}`} required={spec.isRequired}>
            {getFieldDecorator(keyWithPrefix, {
              rules: [
                {
                  required: !this.props.disabled && spec.isRequired,
                  message: `Please input ${spec.title}`
                }
              ],
              initialValue: spec.value || moment()
            })(
              <DatePicker
                disabled={this.props.disabled}
                className={cssClasses.item}
              />
            )}
          </FormItem>
        )

      case ITEM_TYPES.dateRange:
        return (
          <FormItem label={`${spec.title}`} required={spec.isRequired}>
            {getFieldDecorator(keyWithPrefix, {
              rules: [
                {
                  required: !this.props.disabled && spec.isRequired,
                  message: `Please input ${spec.title}`
                }
              ],
              initialValue: spec.value || [moment(), moment()]
            })(
              <RangePicker
                disabled={this.props.disabled}
                className={cssClasses.item}
              />
            )}
          </FormItem>
        )

      case ITEM_TYPES.year:{
        const options = []
        const startYear = Number( spec.startYear)
        const endYear = Number( spec.endYear)
        let year = startYear
        while(year <= endYear ){
          options.push(<Option  key={year} value={year}>{year}</Option>)
          year++
        }
        return (
          <FormItem label={`${spec.title}`} required={spec.isRequired}>
            {getFieldDecorator(keyWithPrefix, {
              rules: [
                {
                  required: !this.props.disabled && spec.isRequired,
                  message: `Please input ${spec.title}`
                }
              ],
              initialValue: spec.value
            })(
              <Select
                showSearch
                className={cssClasses.item}
                disabled={this.props.disabled}
              >
                { options }
              </Select>
            )}
          </FormItem>
        )
      }

      case ITEM_TYPES.upload:
        return (
          <FormItem
            key={keyWithPrefix}
            label={`${spec.title}`}
            style={{ maxWidth: '250px' }}
            required={spec.isRequired}
          >
            {getFieldDecorator(keyWithPrefix, {
              rules: [
                {
                  required: !this.props.disabled && spec.isRequired,
                  message: `Please input ${spec.title}`
                }
              ],
              initialValue: spec.value
            })(
              <Dragger
                disabled={this.props.disabled}
                size="small"
                {...draggerProps}
                className="pointer"
                style={{ maxWidth: '250px' }}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="download" style={{color: '#CDD1DD'}} />
                </p>
                <p className="ant-upload-text">
                  Upload by clicking here, or drag files to this area
                </p>
              </Dragger>
            )}
          </FormItem>
        )

      case ITEM_TYPES.radio:
        return (
          <FormItem
            key={keyWithPrefix}
            label={`${spec.title}`}
            required={spec.isRequired}
          >
            {getFieldDecorator(keyWithPrefix, {
              rules: [
                {
                  required: !this.props.disabled && spec.isRequired,
                  message: `Please choose ${spec.title}`
                }
              ],
              initialValue: spec.value
            })(
              <RadioGroup disabled={this.props.disabled} className={cssClasses.item} >
                { (spec.options).map( ({key, title}) =>
                  <Radio key={key} value={key}>{title}</Radio>
                )}
              </RadioGroup>
            )}
          </FormItem>
        )

      default:
        return null
    }
  }
}


export { ItemTypes, FormItemPrototype, FormItemConfigurable, FormFieldToUse }
