import React, { PureComponent, Fragment } from 'react'
import { Card, Table, Form, InputNumber } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { graphql, compose } from 'react-apollo'

import classStyles from './Bonds.module.css'

import { portfolioUpdateBond as portfolioUpdateBondTmpl } from 'src/queries/mutations.gql'

const { Column } = Table
const FormItem = Form.Item

const EditableContext = React.createContext()

@Form.create()
class EditableFormRow extends PureComponent {
  render() {
    const { form, ...restProps } = this.props
    return (
      <EditableContext.Provider value={form}>
        <tr {...restProps} />
      </EditableContext.Provider>
    )
  }
}

class EditableCell extends PureComponent {
  state = {
    editing: false,
  }

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true)
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true)
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus()
      }
    })
  }

  handleClickOutside = (e) => {
    const { editing } = this.state
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save()
    }
  }

  save = () => {
    const { record, handleSave } = this.props
    this.form.validateFields((error, values) => {
      if (error) {
        return
      }
      this.toggleEdit()
      handleSave({ ...record, ...values })
    })
  }

  render() {
    const { editing } = this.state
    const {
      editable,
      dataIndex,
      record,
      handleSave,
      ...restProps
    } = this.props

    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        type: 'number',
                        max: record.volume,
                        message: `Max amout owned value is (${record.volume})`
                      }],
                      initialValue: record[dataIndex]
                    })(
                      <InputNumber
                        ref={node => (this.input = node)}
                        type="number" placeholder={`Max value is ${record.volume}`}
                        onPressEnter={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              )
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    )
  }
}

@compose(graphql(portfolioUpdateBondTmpl, { name: 'portfolioUpdateBond' }))
class Bonds extends PureComponent {
  handleSave = record => {
    const { portfolioUpdateBond, portfolioId } = this.props
    portfolioUpdateBond({
      variables: {
        tuid: portfolioId,
        bondTuid: record.tuid,
        amount: record.ownedAmount
      },
      refetchQueries: ['portfolio']
    })
  }

  render() {
    const { bonds, withOwnedAmount, actions, className, loading, sorted, renderActions } = this.props
    if (loading)
      return (
        <Fragment>
          <div className={classStyles.title}>Bonds</div>
          <Card className={className} loading={true} />
        </Fragment>
      )
    if (!bonds || !bonds.length)
      return (
        <Fragment>
          <div className={classStyles.title}>Bonds</div>
          <Card className={className}>
            <div style={{ textAlign: 'center', fontSize: '20px' }}>
              No bonds found
            </div>
          </Card>
        </Fragment>
      )

    return (
      <Fragment>
        <div className={classStyles.titleContainer}>
          <div className={classStyles.title}>Bonds</div>
          {actions}
        </div>
        <Card className={className}>
          <Table
            className={classStyles.table}
            rowKey={(b, idx) => idx}
            dataSource={bonds}
            pagination={false}
            components={{ body: { row: EditableFormRow, cell: EditableCell } }}
            rowClassName={(bond, idx) =>
              idx % 2 === 0 ? classStyles.even : classStyles.odd
            }
          >
            <Column
              title="ISIN"
              dataIndex="isin"
              render={(value, { tuid }) =>
                <Link to={`/bonds/${tuid}`}>{value}</Link>
              }
              sorter={sorted && ((a, b) => {
                if(a.isin.toLowerCase() < b.isin.toLowerCase()) { return 1 }
                if(a.isin.toLowerCase() > b.isin.toLowerCase()) { return -1 }
                return 0
              })}
            />
            <Column
              title="ISSUER"
              dataIndex="issuer"
              render={issuer => (
                <Link to={`/issuers/${issuer.tuid}`}>
                  {issuer.name}
                </Link>
              )}
              sorter={sorted && ((a, b) => {
                if(a.issuer.name.toLowerCase() < b.issuer.name.toLowerCase()) { return 1 }
                if(a.issuer.name.toLowerCase() > b.issuer.name.toLowerCase()) { return -1 }
                return 0
              })}
            />
            <Column
              title="ISSUE DATE"
              dataIndex="dateIssue"
              render={dateIssue => (
                <div>{moment(dateIssue).format('YYYY-MM-DD')}</div>
              )}
              align="center"
              sorter={sorted && ((a, b) => {
                if(a.dateIssue < b.dateIssue) { return 1 }
                if(a.dateIssue > b.dateIssue) { return -1 }
                return 0
              })}
            />
            <Column
              title="MATURITY DATE"
              dataIndex="dateMaturity"
              render={dateMaturity => (
                <div>{moment(dateMaturity).format('YYYY-MM-DD')}</div>
              )}
              align="center"
              sorter={sorted && ((a, b) => {
                if(a.dateMaturity < b.dateMaturity) { return 1 }
                if(a.dateMaturity > b.dateMaturity) { return -1 }
                return 0
              })}
            />
            <Column
              title="ISSUE VOLUME"
              dataIndex="volume"
              render={(volume, bond) =>
                `${volume} ${bond.currency.toUpperCase()}`
              }
              align={(withOwnedAmount || renderActions) ? 'center' : 'right'}
              sorter={sorted && ((a, b) => {
                if(a.volume < b.volume) { return 1 }
                if(a.volume > b.volume) { return -1 }
                return 0
              })}
            />
            {withOwnedAmount && (
              <Column
                title="AMOUNT HELD"
                dataIndex="ownedAmount"
                onCell={record => ({
                  record,
                  editable: true,
                  dataIndex: 'ownedAmount',
                  handleSave: this.handleSave,
                })}
                render={(ownedAmount, bond) =>
                  ownedAmount
                    ? `${ownedAmount} ${bond.currency.toUpperCase()}`
                    : 'not owned'
                }
                align={renderActions ? 'center' : 'right'}
                sorter={sorted && ((a, b) => {
                  if(a.ownedAmount < b.ownedAmount) { return 1 }
                  if(a.ownedAmount > b.ownedAmount) { return -1 }
                  return 0
                })}
              />
            )}
            {renderActions && <Column
              align="right"
              render={renderActions}
            />}
          </Table>
        </Card>
      </Fragment>
    )
  }
}

export default Bonds
