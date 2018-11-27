// npm modules
import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import Loader from 'react-loader-advanced'
import transformProps from 'transform-props-with'
import { Form, Input, Button, Modal, Card, Spin } from 'antd'
import { inject } from 'mobx-react'
//app modules
import {
  pool as poolQuery,
} from 'src/queries/queries.gql'
import { pool as poolMutation } from 'src/queries/mutations.gql'
const { Item: FormItem } = Form

@withRouter
@inject('authStore')
@transformProps(oldProps => {
  const {
    tuid,
    authStore: { user },
    ...props
  } = oldProps
  return {
    tuid: tuid || props.match.params.tuid,
    ...props,
    issuerTuid: user.tuid
  }
})
@compose(
  graphql(poolQuery, {
    options: ({ tuid }) => ({
      variables: {
        tuid
      }
    }),
    name: 'poolQuery'
  })
)
@graphql(poolMutation, { name: 'itemCreate' })
@Form.create()
class PoolEdit extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    itemCreate: PropTypes.func
  }

  state = {
    loading: false
  }

  onSubmit = ev => {
    ev.preventDefault()
    const { form } = this.props
    form.validateFieldsAndScroll(null, {},  (errors, values) => {
      if (errors) {
        return
      }
      this.setState({ loading: true },async () => {
        try {
          const result = await this.props.itemCreate({
            variables: {
              ...values
            }
          })
          if (result.errors) {
            throw result
          }

          Modal.info({
            title: 'Updated',
            content: (
              <div>
                <p>Pool was updated</p>
              </div>
            ),
            cancelText: 'Continue',
            okText: 'Check the pool',
            onOk: () => {
              this.props.history.push(`/pools/${result.data.pool.tuid}`)
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
          console.error(err)
        }
        this.setState({ loading: false })
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { poolQuery } = this.props

    if (poolQuery.loading ) {
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
    if (poolQuery.error)
      return (
        <Fragment>
        Error!
          <div>{poolQuery.error ? poolQuery.error.message : null}</div>
        </Fragment>
      )
    const { pool } = poolQuery
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
            Edit Pool
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
            <FormItem label="Name">
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: 'Please input your name!' }
                ],
                initialValue: pool.name
              })(<Input />)}
            </FormItem>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link
                className="ant-btn ant-btn-primary ant-btn-background-ghost"
                to={`/pools/${pool.tuid}`}
                style={{
                  justifySelf: 'end',
                  alignSelf: 'flex-end',
                  display: 'inline-block'
                }}
              >
                Cancel
              </Link>
              <Button type="primary" htmlType="submit" ghost>
                Save
              </Button>
            </div>
          </Form>
        </Loader>
      </Card>
    )
  }
}

export default PoolEdit
