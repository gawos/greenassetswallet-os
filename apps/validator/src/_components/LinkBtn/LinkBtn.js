import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'antd'

import cssClasses from './LinkBtn.module.css'

const btnSizes = ['sm', 'lg']

export default class LinkBtn extends PureComponent {
  get getIcon() {
    const { icon } = this.props

    if (!icon) return ''

    if (typeof icon === 'string') return <Icon type={icon} theme="outlined" />

    return <Icon component={icon} />
  }

  render() {
    const { primary, ghost, size, to, text } = this.props

    const primaryClass = primary ? `ant-btn-primary ${cssClasses.primary}` : ''
    const ghostClass = ghost
      ? `ant-btn-background-ghost ${cssClasses.ghost}`
      : ''
    const sizeClass = btnSizes.includes(size) ? `ant-btn-${size}` : ''
    return (
      <Link
        className={`ant-btn ${
          cssClasses.btn
        } ${primaryClass} ${ghostClass} ${sizeClass} `}
        to={to}
      >
        {this.getIcon} {text}
      </Link>
    )
  }
}
