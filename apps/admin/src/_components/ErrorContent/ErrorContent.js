import React from 'react'

const ErrorContent = (props) => {
  const errors = props.error.errors || [props.error]
  return (
    <div>
      {
        errors.map((err, idx) => {
          return (<div key={`err-${idx}`}>{err.message || err.toString()}</div>)
        })
      }
      <div>
        Please report issue to <a href="mailto:error@greenassetswallet.org">error@greenassetswallet.org </a>
      </div>
    </div>
  )
}
export default ErrorContent
