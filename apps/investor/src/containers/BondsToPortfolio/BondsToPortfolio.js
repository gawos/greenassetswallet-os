import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { graphql, compose } from 'react-apollo'
import { Modal, Button } from 'antd'
import transformProps from 'transform-props-with'
import { Input, Form } from 'antd'

//app modules
import { bonds as bondsQueryTmpl } from 'src/queries/queries.gql'
import {
  portfolios as portfoliosQueryTmpl
} from 'src/queries/queries.gql'
import {
  portfolioAddBond as portfolioAddBondTmpl,
  portfolioRemoveBond as portfolioRemoveBondTmpl
} from 'src/queries/mutations.gql'
import Bonds from 'src/containers/Bonds/_Bonds'
import AddBondToPortfolioForm from 'src/containers/BondsToPortfolio/AddBondToPortfolioForm.js'

const { Search, Group: InputGroup } = Input

const BondsContainer = compose(
  graphql(bondsQueryTmpl, {
    name: 'itemsQuery',
    options: ({ filter }) => ({
      variables: { filter }
    })
  })
)(props => <Bonds {...props} />)

@withRouter
@transformProps(oldProps => {
  return {
    tuid: oldProps.match.params.tuid,
    ...oldProps
  }
})
@compose(
  graphql(portfoliosQueryTmpl, {
    name: 'portfoliosQuery'
  }),
  graphql(portfolioAddBondTmpl, { name: 'portfolioAddBond' }),
  graphql(portfolioRemoveBondTmpl, { name: 'portfolioRemoveBond' })
)
@Form.create()
class ProjectsBonds extends Component {
  state = {
    modalVisible: false
  }

  addBond = async ({ bondTuid, amount, portfolioId }) => {
    await this.props.portfolioAddBond({
      variables: {
        tuid: portfolioId,
        bondTuid,
        amount
      },
      refetchQueries: ['portfolios']
    })
    this.closeModal()
  }

  closeModal = () => {
    this.setState({
      modalVisible: false
    })
  }

  onToPortfolio = bondTuid => {
    this.setState({
      modalVisible: true,
      bondTuid
    })
  }

  renderBondsActions = (item, { tuid }) => (
    <Button
      type="primary"
      htmlType="button"
      ghost
      onClick={() => this.onToPortfolio(tuid)}
    >
      add to portfolio
    </Button>
  )

  handleSubmit = ev => {
    if (ev && ev.preventDefault) {
      ev.preventDefault()
    }
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      this.setState(state => ({ filter: { ...state.filter, ...values } }))
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { portfoliosQuery } = this.props

    if (portfoliosQuery.error)
      return (
        <Fragment>
          Error!
          <div>{portfoliosQuery.error ? portfoliosQuery.error.message : null}</div>
        </Fragment>
      )
    return (
      <Fragment>
        <Modal
          width={400}
          title="Add bond to portfolio"
          visible={this.state.modalVisible}
          footer={null}
          onCancel={this.closeModal}
        >
          <AddBondToPortfolioForm
            bondTuid={this.state.bondTuid}
            portfolioId={this.state.portfolioId}
            onOk={this.addBond}
            itemsQuery={portfoliosQuery}
          />
        </Modal>
        <Form onSubmit={this.handleSubmit}>
          <InputGroup style={{ display: 'flex' }}>
            {/* <Select defaultValue="Zhejiang" style={{ minWidth: `170px` }}>
            <Option value="isin">isin</Option>
            <Option value="issuer">issuer</Option>
            <Option value="project">project</Option>
          </Select> */}
            {getFieldDecorator('isinSearchTerm', {})(
              <Search
                placeholder="search by bond isin"
                enterButton
                onSearch={this.handleSubmit}
              />
            )}
          </InputGroup>
        </Form>
        <BondsContainer
          filter={this.state.filter}
          isExpandable={true}
          renderActions={this.renderBondsActions}
        />
      </Fragment>
    )
  }
}

export default ProjectsBonds
