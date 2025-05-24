import { Drawer } from 'antd'
import React from 'react'

const DrawerComponent = ({title = 'Drawer', placement = 'right', isOpen = false, children, ...rests}) => {
  return (
     <>
      <Drawer
        title={title}
        placement={placement}
        closable={{ 'aria-label': 'Close Button' }}
        open={isOpen}
        {...rests}
      >
        {children}
      </Drawer>
    </>
  )
}

export default DrawerComponent