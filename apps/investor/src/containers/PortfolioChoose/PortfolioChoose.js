import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { NavLink, Link } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import PropTypes from 'prop-types'

import { Table, Form, Modal, InputNumber, Button, Select, Spin } from 'antd'

//app modules
import {
  portfolios as portfoliosQueryTmpl,
  bond as bondQueryTmpl
} from 'src/queries/queries.gql'
import {
  portfolioAddBond as portfolioAddBondTmpl,
  portfolioRemoveBond as portfolioRemoveBondTmpl
} from 'src/queries/mutations.gql'
import styles from './PortfolioChoose.module.css'
const { Column } = Table
const { Item: FormItem } = Form
const Option = Select.Option

const hasErrors = (fieldsError) =>
  Object.keys(fieldsError).some(field => fieldsError[field])


@Form.create()
class AmmountOwnedModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired
  }

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
      this.props.onOk({ bondTuid: this.props.bondTuid, ...values })
    })
  }

  render() {
    const { getFieldDecorator, getFieldsError, isFieldsTouched } = this.props.form
    const bondQuery = this.props.bondQuery
    const itemsQuery = this.props.itemsQuery

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
      <Modal
        width={400}
        title="Add bond to portfolio"
        visible={this.props.visible}
        footer={null}
        onCancel={this.props.onCancel}
      >
        <Form onSubmit={this.handleSubmit} style={{ padding: '2px 10px' }}>
          <FormItem label="Bond">
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
      </Modal>
    )
  }
}

@withRouter
@compose(
  graphql(portfoliosQueryTmpl, {
    name: 'itemsQuery'
  }),
  graphql(bondQueryTmpl, {
    options: ({ bondTuid }) => ({
      variables: {
        tuid: bondTuid
      }
    }),
    name: 'bondQuery'
  }),
  graphql(portfolioAddBondTmpl, { name: 'portfolioAddBond' }),
  graphql(portfolioRemoveBondTmpl, { name: 'portfolioRemoveBond' })
)
class PortfolioChoose extends Component {
  state = {
    isAmmountOwnedVisible: false,
    bondTuid: null,
    portfolioId: null
  }

  addBond = async ({ bondTuid, amount, portfolioId }) => {
    await this.props.portfolioAddBond({
      variables: {
        tuid: portfolioId,
        bondTuid: this.props.bondTuid,
        amount
      },
      refetchQueries: ['portfolios']
    })
    this.closeAmmountOwned()
  }

  removeBond = async (bondTuid, portfolioId) => {
    await this.props.portfolioRemoveBond({
      variables: {
        tuid: portfolioId,
        bondTuid
      },
      refetchQueries: ['portfolios']
    })
  }

  renderPortfolioPreview = (value, record, index) => {
    return (
      <NavLink
        style={{ display: 'block', padding: '5px', color: '#212121' }}
        activeStyle={{
          background: 'rgba(37, 215, 124, 0.28)'
        }}
        to={`/portfolios/${record.tuid}`}
      >
        <div
          style={{ minHeight: '50px', paddingLeft: '10px', fontSize: '18px' }}
        >
          <div
            style={{
              color: 'rgb(18, 56, 152)',
              fontWeight: '700',
              fontSize: '16px'
            }}
          >
            {record.name}
          </div>
        </div>
      </NavLink>
    )
  }

  renderBondPreview = (value, record, index) => {
    return (
      <NavLink
        style={{ display: 'block', padding: '5px', color: '#212121' }}
        activeStyle={{
          background: 'rgba(37, 215, 124, 0.28)'
        }}
        to={`/portfolios/${record.tuid}`}
      >
        <div
          style={{ minHeight: '50px', paddingLeft: '10px', fontSize: '18px' }}
        >
          <div
            style={{
              color: 'rgb(18, 56, 152)',
              fontWeight: '700',
              fontSize: '16px'
            }}
          >
            {record.isin}
          </div>
          <div style={{ color: 'rgb(176, 177, 190)', fontSize: '12px' }}>
            {record.tuid}
          </div>
        </div>
      </NavLink>
    )
  }

  renderActions = (value, record, index) => {
    const { bondTuid } = this.props

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingRight: '20px'
        }}
      >
        {record.bonds.some(({ bond }) => bond.tuid === bondTuid) ? (
          <Button
            type="danger"
            htmlType="button"
            ghost
            onClick={() => this.removeBond(bondTuid, record.tuid)}
          >
            Remove
          </Button>
        ) : (
          <Button
            type="primary"
            htmlType="button"
            ghost
            onClick={() => this.openAmmountOwned(bondTuid, record.tuid)}
          >
            Add
          </Button>
        )}
      </div>
    )
  }

  openAmmountOwned = (bondTuid, portfolioId) => {
    this.setState({
      isAmmountOwnedVisible: true,
      bondTuid,
      portfolioId
    })
  }

  closeAmmountOwned = () => {
    this.setState({
      isAmmountOwnedVisible: false,
      bondTuid: null,
      portfolioId: null
    })
  }

  static renderTitle = () => <h3>Your Portfolios</h3>

  render() {
    const { itemsQuery, bondQuery } = this.props

    if (itemsQuery.error || bondQuery.error)
      return (
        <Fragment>
          Error!
          <div>{itemsQuery.error ? itemsQuery.error.message : null}</div>
          <div>{bondQuery.error ? bondQuery.error.message : null}</div>
        </Fragment>
      )

    return (
      <div style={{ paddingTop: '18px', ...this.props.style }}>
        <AmmountOwnedModal
          bondTuid={this.state.bondTuid}
          portfolioId={this.state.portfolioId}
          visible={this.state.isAmmountOwnedVisible}
          onCancel={this.closeAmmountOwned}
          onOk={this.addBond}
          bondQuery={bondQuery}
          itemsQuery={itemsQuery}
        />
        <Table
          title={PortfolioChoose.renderTitle}
          className="tableNoHeader noCellPadding"
          loading={itemsQuery.loading}
          size="small"
          rowKey="tuid"
          dataSource={itemsQuery.portfolios}
          pagination={{
            hideOnSinglePage: true
          }}
          locale={{
            emptyText: (
              <div>
                no portfolios, please
                <Link
                  to="/portfolios/new"
                  style={{
                    margin: '0 5px'
                  }}
                >
                  create one
                </Link>
                {' '}
                first
              </div>
            )
          }}
        >
          <Column key="name" render={this.renderPortfolioPreview} />
          <Column key="actions" render={this.renderActions} />
        </Table>
      </div>
    )
  }
}

export default PortfolioChoose
