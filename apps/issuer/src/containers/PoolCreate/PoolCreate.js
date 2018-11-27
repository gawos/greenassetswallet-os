// npm modules
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import Loader from 'react-loader-advanced'
import { Form, Input, Button, Modal, Card } from 'antd'
//app modules
import { pool as poolMutation } from 'src/queries/mutations.gql'
const { Item: FormItem } = Form

@withRouter
@graphql(poolMutation, { name: 'itemCreate' })
@Form.create()
class PoolCreate extends Component {
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
      this.setState({ loading: true }, async () => {
        try {
          const result = await this.props.itemCreate({
            variables: {
              ...values
            }
          })
          if (result.errors) {
            throw result
          }

          Modal.confirm({
            title: 'Created',
            content: (
              <div>
                <p>View pool details</p>
              </div>
            ),
            cancelText: 'Continue',
            okText: 'Check the pool',
            onOk: () => {
              this.props.history.push(`/pools/${result.data.pool.tuid}`)
            },
            onCancel: () => {
              this.props.history.push('/pools')
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
            Create Pool
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
                  { required: true, message: 'Please input your Name!' }
                ]
              })(<Input />)}
            </FormItem>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link
                className="ant-btn ant-btn-primary ant-btn-background-ghost"
                to={'/pools/'}
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

export default PoolCreate
