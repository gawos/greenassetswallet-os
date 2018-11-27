import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import config from 'config/index'
import cssClasses from './ReportData.module.css'

const ReportData = (props) => {
  const {data} = props
  console.log('data', data)
  return (
    <div
      className={`${cssClasses.index} ${props.className}`}
      style={{
        ...(props.style || {})
      }}
    >
      <div>
        {Object.values(data).map(({ spec, spec: { value } }) => {
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
                    {value.map((file) => {
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
                              target="_blank"
                              rel="noopener noreferrer"
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


ReportData.propTypes = {
  data: PropTypes.object.isRequired
}

export default ReportData
