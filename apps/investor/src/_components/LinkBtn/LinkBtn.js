import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'antd'

import cssClasses from './LinkBtn.module.css'

const btnSizes = ['sm', 'lg']

function getIcon(icon) {

  if (!icon) return ''

  if (typeof icon === 'string') return <Icon type={icon} theme="outlined" />

  return <Icon component={icon} />
}

const LinkBtn = props => {
  const { primary, ghost, size, link, text, className } = props

  const primaryClass = primary ? `ant-btn-primary ${cssClasses.primary}` : ''
  const ghostClass = ghost
    ? `ant-btn-background-ghost ${cssClasses.ghost}`
    : ''
  const sizeClass = btnSizes.includes(size) ? `ant-btn-${size}` : ''

  return (
    <Link
      className={`ant-btn ${
        cssClasses.btn
      } ${primaryClass} ${ghostClass} ${sizeClass} ${className}`}
      to={link}
    >
      {getIcon(props.icon)} {text}
    </Link>
  )
}

export default LinkBtn
