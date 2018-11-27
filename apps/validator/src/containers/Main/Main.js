import { Table } from 'antd'
import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'

const PAGE_SIZE = 20

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}

@inject('issuerStore')
@observer
export default class Main extends Component {
  columns = [
    {
      title: 'COIN',
      key: 'symbol',
      render: rawData => {
        const { baseImageUrl, coinMetadata } = this.props.coinsStore
        const currentCoinData = coinMetadata.get(rawData.SYMBOL)
        return (
          <Fragment>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <div>
                {Boolean(currentCoinData) && currentCoinData.ImageUrl ? (
                  <img
                    style={{ height: '30px' }}
                    src={`${baseImageUrl}${currentCoinData.ImageUrl}`}
                  />
                ) : (
                  <div style={{ height: '30px', width: '30px' }} />
                )}
              </div>
              <div style={{ marginLeft: '10px' }}>
                <div style={{ fontWeight: 700 }}>{rawData.NAME}</div>
                <div>{rawData.SYMBOL}</div>
              </div>
            </div>
          </Fragment>
        )
      }
    },
    {
      title: 'Price',
      key: 'price',
      render: rawData => {
        const { coinMetadata } = this.props.coinsStore
        const currentCoinData = coinMetadata.get(rawData.SYMBOL)

        return currentCoinData && currentCoinData.price
          ? `$${precisionRound(currentCoinData.price.USD.PRICE, 2)}`
          : null
      }
    },
    {
      title: 'Price Change 24H',
      key: 'priceChange',
      render: rawData => {
        const { coinMetadata } = this.props.coinsStore
        const currentCoinData = coinMetadata.get(rawData.SYMBOL)
        if (currentCoinData && currentCoinData.price) {
          const styleColor =
            currentCoinData.price.USD.CHANGEPCT24HOUR > 0
              ? { color: 'green' }
              : { color: 'red' }
          return (
            <span style={{ ...styleColor }}>
              {precisionRound(currentCoinData.price.USD.CHANGEPCT24HOUR, 2)} %
            </span>
          )
        } else {
          return null
        }
      }
    },
    {
      title: 'Total Vol. 24H',
      key: 'VOLUME24HOURTO',
      render: rawData => `$${precisionRound(rawData.VOLUME24HOURTO, 2)}`
    }
  ]

  componentDidMount() {
    const { updateCoinMetadata, updateCoinList } = this.props.coinsStore
    updateCoinMetadata()
      .then(() => {
        return updateCoinList()
      })
      .then(() => {
        return this.onUpdateCoinsInfo()
      })
  }

  onUpdateCoinsInfo = (from = 0, to = 20) => {
    const { updateCoinsInfo } = this.props.coinsStore
    updateCoinsInfo(from, to)
  }

  tableOnChange = (pagination, filters, sorter) => {
    this.onUpdateCoinsInfo(
      pagination.pageSize * (pagination.current - 1),
      pagination.pageSize * (pagination.current - 1) + pagination.pageSize
    )
  }

  render() {
    const { coinList } = this.props.coinsStore

    return (
      <Table
        rowKey={'SYMBOL'}
        columns={this.columns}
        dataSource={coinList.slice()}
        onChange={this.tableOnChange}
        pagination={{
          defaultPageSize: PAGE_SIZE,
          pageSize: PAGE_SIZE,
          hideOnSinglePage: true
        }}
      />
    )
  }
}
