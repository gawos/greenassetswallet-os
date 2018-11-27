import React, { PureComponent } from 'react'

import styles from './ReportData.module.css'

class ReportData extends PureComponent {
  render() {
    const { data: { data } } = this.props
    return (
      <div className={styles.container}>
        {Object.keys(data).map(key => {
          const spec = data[key]
          if (spec.type === 'upload') {
            return (
              <div key={spec.tuid} className={styles.block}>
                <div className={styles.titleValue}>{spec.index}. {spec.title}:</div>
                <div className={styles.value}>
                  {spec.value.map(file => {
                    return (
                      <div key={file.tuid} >
                        <div>
                          <a
                            className={styles.link}
                            alt="upload"
                            href={`//localhost:3030/upload/${file.tuid}.${file.ext}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {file.name}
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          } else {
            return (
              <div key={spec.tuid} className={styles.block}>
                <div className={styles.titleValue}>{spec.index}. {spec.title}:</div>
                <div className={styles.value}>{spec.value}</div>
              </div>
            )
          }
        })}
      </div>
    )
  }
}

export default ReportData
