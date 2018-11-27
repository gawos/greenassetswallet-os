import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import currencyCodesData from 'currency-codes/data'
import Loader from 'react-loader-advanced'
import moment from 'moment'

import {
  Form,
  Input,
  Button,
  Select,
  Spin,
  Modal,
  DatePicker,
  InputNumber
} from 'antd'
//app modules
import { bond as bondQuery } from 'src/queries/queries.gql'
import { bondUpdate as bondUpdateMutation } from 'src/queries/mutations.gql'

const { Item: FormItem } = Form
const { Option } = Select

@withRouter
@compose(
  graphql(bondQuery, {
    options: props => ({
      variables: {
        tuid: props.match.params.tuid
      }
    }),
    name: 'bondQuery'
  }),
  graphql(bondUpdateMutation, {
    name: 'itemUpdate'
  })
)

@Form.create()
class BondEdit extends Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
    loading: false
  }

  static propTypes = {
    bondQuery: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
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

  onSubmit = ev => {
    ev.preventDefault()
    const { form, itemUpdate, history, match, bondQuery: { bond } } = this.props
    const tuid = match.params.tuid
    form.validateFieldsAndScroll(null, {},  (errors, values) => {
      if (errors) {
        return
      }

      this.setState({ loading: true }, async () => {
        try {
          const result = await itemUpdate({
            variables: {
              framework: bond.framework.tuid,
              pool: bond.poolTuid,
              ...values,
              tuid,
              dateIssue: values.dateIssue.toDate().getTime(),
              dateMaturity: values.dateMaturity.toDate().getTime(),
            }
          })
          if (result.errors) {
            throw result
          }
          Modal.confirm({
            title: 'Created',
            content: <div>Bond was updated</div>,
            okText: 'Continue',
            onOk: () => {
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

      })

    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { endOpen } = this.state
    const { bondQuery, history } = this.props

    if (bondQuery.error) {
      return (
        <Fragment>
          Error!
          <div>
            {bondQuery.error ? bondQuery.error.message : null}
          </div>
        </Fragment>
      )
    }
    if (bondQuery.loading) {
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
    const { bond } = bondQuery

    return (
      <Loader
        contentBlur={1}
        show={this.state.loading}
        message={'SAVING...'}
        messageStyle={{
          fontSize: '30px'
        }}
      >
        <Form
          onSubmit={this.onSubmit}
          style={{ maxWidth: '600px', margin: '0 auto', ...this.props.style }}
        >
          <FormItem label="ISIN">
            {getFieldDecorator('isin', {
              rules: [
                { required: true, message: 'Please input your rname!' }
              ],
              initialValue: bond.isin
            })(<Input placeholder="Bond ISIN" />)}
          </FormItem>
          <div style={{ display: 'flex' }}>
            <FormItem label="Issue Date" style={{ paddingRight: '25px' }}>
              {getFieldDecorator('dateIssue', {
                initialValue: moment(bond.dateIssue),
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
                initialValue: moment(bond.dateMaturity),
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
                initialValue: bond.volume,
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
              justifyContent: 'space-between',
              paddingTop: '15px',
              paddingBottom: '15px'
            }}
          >
            <Button
              type="primary"
              ghost
              onClick={history.goBack}
              style={{
                justifySelf: 'end',
                alignSelf: 'flex-end',
                display: 'inline-block'
              }}
            >
              <span>Cancel</span>
            </Button>
            <Button type="primary" htmlType="submit" ghost>
              Save changes
            </Button>
          </div>
        </Form>
      </Loader>
    )
  }
}

export default BondEdit
