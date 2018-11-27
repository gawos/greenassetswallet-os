import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

//app modules
import config from 'config/index'
import cssClasses from './ReportData.module.css'

class ReportData extends Component {


  render() {
    const { data } = this.props

    //separate file fields from all another fields

    return (
      <div
        className={`${cssClasses.index} ${this.props.className}`}
        style={{
          ...(this.props.style || {})
        }}
      >
        <div>
          {data.map(({ spec, value }, index, array) => {
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
                            <div
                              style={{ fontSize: '10px', marginRight: '7px' }}
                            >
                              {file.tuid}
                            </div>
                            <div style={{ marginRight: '7px' }}>
                              {file.filename}
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

ReportData.propTypes = {
  data: PropTypes.object.isRequired
}

export default ReportData
