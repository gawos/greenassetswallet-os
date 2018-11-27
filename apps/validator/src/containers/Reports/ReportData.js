import React, { PureComponent, Fragment } from 'react'

import PropTypes from 'prop-types'

//app modules
import cssClasses from './ReportData.module.css'

class ReportData extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render() {
    const { data } = this.props
    return (
      <div
        className={`${cssClasses.index} ${this.props.className}`}
        style={{
          ...(this.props.style || {})
        }}
      >
        <div>
          {Object.values(data).map((spec) => {
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
                      {spec.value.map((file) =>  (
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
                              href={`//localhost:3030/upload/${file.tuid}.${
                                file.ext
                              }`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                                download
                            </a>
                          </div>
                        </div>
                      )
                      )}
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
                    <div style={{ fontWeight: 700 }}> {spec.value} </div>
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
