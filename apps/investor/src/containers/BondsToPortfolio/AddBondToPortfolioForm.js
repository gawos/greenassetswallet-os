import React, { Fragment } from 'react'
import { withRouter } from 'react-router'
import { graphql, compose } from 'react-apollo'

import { Form, InputNumber, Button, Select, Spin } from 'antd'

//app modules
import {
  bond as bondQueryTmpl
} from 'src/queries/queries.gql'
import styles from './AddBondToPortfolioForm.module.css'
const { Item: FormItem } = Form
const Option = Select.Option

const hasErrors = (fieldsError) =>
  Object.keys(fieldsError).some(field => fieldsError[field])

@withRouter
@compose(
  graphql(bondQueryTmpl, {
    options: ({ bondTuid }) => ({
      variables: {
        tuid: bondTuid
      }
    }),
    name: 'bondQuery'
  })
)
@Form.create()
class AddBondToPortfolioForm extends React.Component {

    static formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }

    handleSubmit = e => {
      e.preventDefault()
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (err) {
          console.log('Received values of form: ', values)
          return
        }
        const { portfolioId } = values
        this.props.onOk({ bondTuid: this.props.bondTuid, portfolioId: portfolioId, ...values })
      })
    }

    render() {
      const { getFieldDecorator, getFieldsError, isFieldsTouched } = this.props.form
      const { bondQuery } = this.props
      const itemsQuery = this.props.itemsQuery

      if (bondQuery.error)
        return (
          <Fragment>
          Error!
            <div>{bondQuery.error ? bondQuery.error.message : null}</div>
          </Fragment>
        )

      if(bondQuery.loading) {
        return (<Spin />)
      }

      if(itemsQuery.loading) {
        return (<Spin />)
      }

      const ownedAmountRules = [
        {
          required: true,
          type: 'number',
          message: 'Please input owned amount!'
        },
        {
          type: 'number',
          max: bondQuery.bond.volume,
          message: `Amout owned max value can't be greater than bond volume (${bondQuery.bond.volume})`
        }
      ]
      const formHasErrors = hasErrors(getFieldsError())
      const formNotTouched = !isFieldsTouched(['amount'])
      return (
        <Form onSubmit={this.handleSubmit} style={{ padding: '2px 10px' }}>
          <FormItem label="Bond" colon={false}>
            <div className={styles.value}>{bondQuery.bond.isin}</div>
          </FormItem>
          <div style={{margin: '10px'}}></div>
          <FormItem label="Amount">
            {
              getFieldDecorator('amount', {
                rules: ownedAmountRules
              })(
                <InputNumber type="number" placeholder={`Max value is ${bondQuery.bond.volume}`} autoFocus style={{ width: '60%' }} />
              )
            }
            <Select
              style={{ width: '35%', paddingLeft: '8px' }}
              defaultValue={bondQuery.bond.currency}
              disabled
            >
              <Option value={bondQuery.bond.currency}>{bondQuery.bond.currency}</Option>
            </Select>
          </FormItem>
          <div style={{margin: '10px'}}></div>
          <FormItem label="Portfolio">
            {
              getFieldDecorator('portfolioId', {
                rules: [{ required: true, message: 'Please choose a portfolio!' }],
                initialValue: itemsQuery.portfolios[0].tuid
              })(
                <Select style={{ width: '100%'}}>
                  {itemsQuery.portfolios.map(el => <Option key={el.name} value={el.tuid}>{el.name}</Option>)}
                </Select>
              )
            }
          </FormItem>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '18px'
            }}
          >
            <Button type="primary" htmlType="reset" ghost onClick={this.props.onCancel}>
                Cancel
            </Button>
            <div style={{ width: '24px' }} />
            <Button type="primary" htmlType="submit" ghost disabled={formHasErrors || formNotTouched}>
                Ok
            </Button>
          </div>
        </Form>
      )
    }
}

export default AddBondToPortfolioForm