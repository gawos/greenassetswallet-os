import React, { PureComponent, Fragment } from 'react'

import PropTypes from 'prop-types'
import moment from 'moment'

//app modules
import config from 'config/index'
import cssClasses from './ReportData.module.css'

class ReportData extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render() {
    const { data } = this.props

    let sortedData = Object.values(data).slice()
    sortedData.sort((a, b) => a.spec.index - b.spec.index)
    return (
      <div
        className={`${cssClasses.index} ${this.props.className}`}
        style={{
          ...(this.props.style || {})
        }}
      >
        <div>
          {sortedData.map(({ spec, value }, index, array) => {
            //in two columns
            if (spec.type === 'upload') {
              return (
                <Fragment key={spec.tuid}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ marginRight: '5px' }}>{spec.index}.</div>
                    <div style={{ marginRight: '10px', fontSize: '14px' }}>
                      {spec.title}:
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      paddingLeft: '20px'
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>
                      {value.map((file, index) => {
                        return (
                          <div
                            key={file.tuid}
                            style={{ display: 'flex', alignItems: 'flex-end' }}
                          >
                            <div style={{ marginRight: '7px' }}>
                              {file.name}
                            </div>
                            <div style={{ marginRight: '7px' }}>
                              <a
                                href={`${config.api}/upload/${file.tuid}.${
                                  file.ext
                                }`}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                download
                              </a>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </Fragment>
              )
            } else if (spec.type === 'month') {
              return (
                <Fragment key={spec.tuid}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ marginRight: '5px' }}>{spec.index}.</div>
                    <div style={{ marginRight: '10px', fontSize: '14px' }}>
                      {spec.title}
                    </div>
                    <div style={{ fontWeight: 700 }}>
                      {moment(value).format('MM/YYYY')}
                    </div>
                  </div>
                </Fragment>
              )
            } else {
              return (
                <Fragment key={spec.tuid}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ marginRight: '5px' }}>{spec.index}.</div>
                    <div style={{ marginRight: '10px', fontSize: '14px' }}>
                      {spec.title}
                    </div>
                    <div style={{ fontWeight: 700 }}> {value} </div>
                  </div>
                </Fragment>
              )
            }
          })}
        </div>
      </div>
    )
  }
}

export default ReportData
