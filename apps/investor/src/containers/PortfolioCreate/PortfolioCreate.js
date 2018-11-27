import React, { Component } from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
/* app modules */
import { portfolio as portfolioMutation } from 'src/queries/mutations.gql'
import { portfolios as portfoliosQueryTmpl } from 'src/queries/queries.gql'

import { Form, Input, Button, Modal } from 'antd'
/* constants */
const { Item: FormItem } = Form

@withRouter
@compose(
  graphql(portfolioMutation, {
    name: 'portfolioCreate'
  }),
  graphql(portfoliosQueryTmpl, {
    name: 'portfoliosQuery'
  })
)
@Form.create()
class PortfolioCreate extends Component {
  static propTypes = {
    onCreate: PropTypes.func,
    form: PropTypes.object.isRequired
  }

  onSubmit = ev => {
    ev.preventDefault()
    const { form, history } = this.props
    form.validateFieldsAndScroll(null, {}, async (errors, values) => {
      if (errors) {
        return
      }

      try {
        const { name } = values

        const result = await this.props.portfolioCreate({
          variables: {
            name
          },
          refetchQueries: ['portfolios']
        })

        if (result.errors) {
          throw result
        }

        const {
          data: { portfolio }
        } = result

        const modal = Modal.success({
          title: 'New portfolio was created',
          onOk: () => {
            history.push(`/portfolios/${portfolio.tuid}`)
          }
        })
        setTimeout(() => {
          modal.destroy()
        }, 2100)
      } catch (err) {
        Modal.error({
          title: 'New portfolio was not created',
          content: err.errors
            ? err.errors.map(error => (
              <div key={error.locations.toString()}>{error.message}</div>
            ))
            : err.toString()
        })
        // eslint-disable-next-line no-console
        console.error(err)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.onSubmit} style={{ ...this.props.style }}>
        <h2 style={{ textAlign: 'center' }}>Create Portfolio</h2>
        <FormItem label="Name">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input portfolio name!' }]
          })(<Input placeholder="portfolio name" />)}
        </FormItem>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            style={{ justifySelf: 'end', display: 'block' }}
            type="primary"
            htmlType="submit"
            ghost
          >
            Create
          </Button>
        </div>
      </Form>
    )
  }
}

export default PortfolioCreate
