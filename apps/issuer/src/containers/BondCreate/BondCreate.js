import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import currencyCodesData from 'currency-codes/data'
import Loader from 'react-loader-advanced'
import { observer, inject } from 'mobx-react'

import {
  Form,
  Input,
  DatePicker,
  Button,
  InputNumber,
  Select,
  Modal,
  Card
} from 'antd'
// app modules
import Framework from 'src/containers/Framework'
import { bond as itemMutation } from 'src/queries/mutations.gql'
// consts
const { Item: FormItem } = Form
const { Option } = Select

@withRouter
@inject('authStore')
@observer
@compose(
  graphql(itemMutation, {
    name: 'itemCreate'
  })
)
@Form.create()
class BondCreate extends Component {
  static propTypes = {
    itemCreate: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired
  }

  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
    loading: false
  }

  disabledStartDate = startValue => {
    const endValue = this.state.endValue
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }

  disabledEndDate = endValue => {
    const startValue = this.state.startValue
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value
    })
  }

  onStartChange = value => {
    this.onChange('startValue', value)
  }

  onEndChange = value => {
    this.onChange('endValue', value)
  }

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }

  handleEndOpenChange = open => {
    this.setState({ endOpen: open })
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
    const { form, itemCreate, history } = this.props
    form.validateFieldsAndScroll(null, {},  (errors, values) => {
      if (errors) {
        return
      }
      this.setState({ loading: true }, async () => {
        try {
          const result = await itemCreate({
            variables: {
              ...values,
              dateIssue: values.dateIssue.toDate().getTime(),
              dateMaturity: values.dateMaturity.toDate().getTime()
            }
          })
          if (result.errors) {
            throw result
          }
          Modal.confirm({
            title: 'Created',
            content: <div>New bond was created</div>,
            cancelText: 'Continue',
            okText: 'View bond details',
            onOk: () => {
              history.push(`/bonds/${result.data.bond.tuid}`)
            },
            onCancel: () => {
              history.push('/bonds')
            }
          })
        } catch (err) {
          Modal.error({
            title: 'An error occured, maybe element with this identificator already exists',
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



      }  )

    })
  }

  onChooseFramework = record => {
    const { setFieldsValue } = this.props.form
    setFieldsValue({
      framework: record.tuid
    })
  }

  renderFrameworkActions = (framework) => {
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

  render() {
    const { startValue, endValue, endOpen } = this.state
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
            Create BOND
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
          <Form onSubmit={this.onSubmit}>
            <FormItem label="ISIN or bond ID">
              {getFieldDecorator('isin', {
                rules: [{ required: true, message: 'Please input an isin!' }]
              })(<Input />)}
            </FormItem>

            <div style={{ display: 'flex' }}>
              <FormItem label="Issue Date" style={{ paddingRight: '25px' }}>
                {getFieldDecorator('dateIssue', {
                  initialValue: startValue,
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: 'Please select time!'
                    }
                  ]
                })(
                  <DatePicker
                    disabledDate={this.disabledStartDate}
                    placeholder="Start"
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                    showTime
                    format="DD-MM-YYYY"
                  />
                )}
              </FormItem>
              <FormItem label="Maturity Date">
                {getFieldDecorator('dateMaturity', {
                  initialValue: endValue,
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: 'Please select time!'
                    }
                  ]
                })(
                  <DatePicker
                    disabledDate={this.disabledEndDate}
                    placeholder="End"
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                    showTime
                    format="DD-MM-YYYY"
                  />
                )}
              </FormItem>
            </div>

            <div style={{ display: 'flex' }}>
              <FormItem label="Currency">
                {getFieldDecorator('currency', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select a currency'
                    }
                  ],
                  initialValue: 'EUR'
                })(
                  <Select showSearch style={{ width: '150px' }}>
                    {currencyCodesData.map(el => (
                      <Option key={el.code} value={el.code}>
                        {el.currency} - {el.code}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <div style={{ width: '10px' }} />
              <FormItem label="Volume" style={{ paddingRight: '30px' }}>
                {getFieldDecorator('volume', {
                  initialValue: 1000,
                  rules: [
                    {
                      type: 'number',
                      required: true,
                      message: 'Please input a value'
                    }
                  ]
                })(<InputNumber min={0} />)}
              </FormItem>
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: '10px',
                marginBottom: '10px'
              }}
            >
              <FormItem
                label="Choose a Framework"
                required
                style={{ width: '100%' }}
              >
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
                  })(
                    <Framework renderActions={this.renderFrameworkActions} />
                  )}
                </Fragment>
              </FormItem>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link
                className="ant-btn ant-btn-primary ant-btn-background-ghost"
                to={'/bonds/'}
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

export default BondCreate
