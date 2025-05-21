import { Button } from 'antd'
import React from 'react'

const ButtonComponent = React.forwardRef(
  ({ size, styleButton, styleTextButton, textButton, disabled, ...rests }, ref) => {
    return (
      <Button
        ref={ref} 
        style={{
          ...styleButton,
          background: disabled ? '#ccc' : styleButton?.background,
        }}
        size={size}
        {...rests}
      >
        <span style={styleTextButton}>{textButton}</span>
      </Button>
    );
  }
);

export default ButtonComponent;
