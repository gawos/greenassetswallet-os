import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

export default class Main extends PureComponent {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '4%'
        }}
      >
        <div>
          <h1>Page404</h1>
          <Link to="/">hoomepage</Link>
        </div>
      </div>
    )
  }
}
