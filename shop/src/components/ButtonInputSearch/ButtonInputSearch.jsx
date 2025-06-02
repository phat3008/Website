import React from 'react'
import { Button } from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButtonInputSearch = (props) => {
    const { 
            size, placeholder, textbutton,
            bordered, backgroundColorInput = '#fff',
            backgroundColorButton = 'rgb(246, 8, 24)',
            colorButton = '#ffffff'
    } = props

  return (
    <div style={{ display: 'flex', }}>
        <InputComponent 
          size={size} 
          placeholder={placeholder}
          variant={bordered === false ? 'borderless' : 'outlined'}
          style={{ backgroundColor: backgroundColorInput }}
          {...props}
        />
        <ButtonComponent
          size={size} 
          icon={<SearchOutlined  style={{ color: colorButton }}/>}
          styleButton={{ background: backgroundColorButton, bordered: !bordered && 'none' }}
          textbutton={textbutton}
          styletextbutton={{ color: colorButton }}
        />
    </div>
  )
}

export default ButtonInputSearch