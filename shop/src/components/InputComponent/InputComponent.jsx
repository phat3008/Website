import { Input } from 'antd'
import React from 'react'

const InputComponent = ({ size, placeholder, variant = 'outlined', style, ...rests }) => {
  return (
    <Input
      size={size}
      placeholder={placeholder}
      variant={variant}
      style={style}
      {...rests}
    />
  )
}

export default InputComponent
