import React, { Component, Fragment } from "react"
import { withRouter } from "react-router"
import { Table, Spin, Card } from "antd"
import { Link } from "react-router-dom"
import { graphql, compose } from "react-apollo"
import PropTypes from "prop-types"
import moment from "moment"
import transformProps from "transform-props-with"

//app modules
import config from "config/index"
import {
  framework as frameworkQuery
  //reports as reportsQuery
} from "src/queries/queries.gql"
import cssClasses from "./FrameworkItem.module.css"
const { Column } = Table

@withRouter
@transformProps(oldProps => {
  const { tuid, ...props } = oldProps
  return {
    tuid: tuid || props.match.params.tuid,
    ...props
  }
})
@compose(
  graphql(frameworkQuery, {
    options: ({ tuid }) => ({
      variables: {
        tuid
      }
    }),
    name: `frameworkQuery`
  })
)
class FrameworkItem extends Component {
  static propTypes = {
    frameworkQuery: PropTypes.object.isRequired
  }

  render() {
    const { frameworkQuery } = this.props
    if (frameworkQuery.error) {
      return (
        <Fragment>
          Error!
          <div>
            {frameworkQuery.error ? frameworkQuery.error.message : null}
          </div>
        </Fragment>
      )
    }
    if (frameworkQuery.loading) {
      return (
        <div
          style={{
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`
          }}
        >
          <Spin size="large" />
        </div>
      )
    }
    const { framework } = frameworkQuery
    if (!framework) {
      return (
        <div style={{ textAlign: `center`, fontSize: `20px` }}>
          Framework does not exists or was removed
        </div>
      )
    }
    return (
      <Card style={{ ...this.props.style }} loading={frameworkQuery.loading}>
        <div style={{ display: `flex`, justifyContent: `space-between` }}>
          <div
            style={{
              fontSize: `11px`
            }}
          >
            <div>
              <span style={{ paddingRight: `5px`, color: `rgba(100,100,100)` }}>
                Created at:
              </span>
              <span style={{ color: `rgba(21,21,21)` }}>
                {moment(framework.createdAt).format(`DD/MM/YYYY`)}
              </span>
            </div>
          </div>
        </div>

        <h1
          style={{
            display: `flex`,
            color: `rgb(60, 30, 134)`,
            fontSize: `25px`
          }}
        >
          {framework.name}
        </h1>

        <div style={{ display: `flex`, marginBottom: `20px` }}>
          <Table
            className="tableNoColumnsTitle tableNoBorder"
            style={{ flex: 1 }}
            title={() => (
              <h4 className={cssClasses.relatedTableTitle}>Categories</h4>
            )}
            size="small"
            rowKey="tuid"
            dataSource={framework.categories}
            pagination={{
              hideOnSinglePage: true
            }}
          >
            <Column
              title={null}
              key={`category`}
              dataIndex="text"
              render={value => (
                <span style={{ fontSize: `14px` }}>{value}</span>
              )}
            />
          </Table>
          <div style={{ width: `20px` }} />
          <Table
            className="tableNoColumnsTitle tableNoBorder"
            style={{ flex: 1 }}
            title={() => (
              <h4 className={cssClasses.relatedTableTitle}>Goals</h4>
            )}
            size="small"
            rowKey="tuid"
            dataSource={framework.goals}
            pagination={{
              hideOnSinglePage: true
            }}
          >
            <Column
              title={null}
              key={`goal`}
              dataIndex="text"
              render={value => (
                <span style={{ fontSize: `14px` }}>{value}</span>
              )}
            />
          </Table>
        </div>

        <Table
          className="tableNoColumnsTitle tableNoBorder"
          style={{ marginBottom: `20px` }}
          title={() => (
            <h4 className={cssClasses.relatedTableTitle}>Green Commitments</h4>
          )}
          size="small"
          rowKey="tuid"
          dataSource={framework.commitments}
          pagination={{
            hideOnSinglePage: true
          }}
        >
          <Column title="Text" key={`text`} dataIndex="text" />
        </Table>

        <Table
          className="tableNoColumnsTitle tableNoBorder"
          style={{ marginBottom: `20px` }}
          title={() => <h4 className={cssClasses.relatedTableTitle}>Supporting Documentation</h4>}
          size="small"
          rowKey="tuid"
          dataSource={framework.files}
          pagination={{
            hideOnSinglePage: true
          }}
        >
          <Column title="Filename" key={`filename`} dataIndex="filename" />
          <Column
            title="Filename"
            key={`actions`}
            render={record => (
              <a
                href={`${config.api}/upload/${record.tuid}.${record.ext}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ paddingLeft: `10px` }}
              >
                Download
              </a>
            )}
          />
        </Table>
      </Card>
    )
  }
}

export default FrameworkItem
