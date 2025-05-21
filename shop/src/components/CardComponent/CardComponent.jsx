import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style'
import {StarFilled} from '@ant-design/icons'

const CardComponent = (props) => {
    const {countInStock, description, image, name, price, rating, type, discount, selled} = props
  return (
    <WrapperCardStyle
        hoverable
        styles={{ header: { width: '200px', height: "200px" }, body: { padding: '10px' } }}
        style={{ width: 200 }}
        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
    >
        <img 
            style={{
                width: '68px',
                height: '14px',
                position: 'absolute',
                top: '-1',
                left: '-1',
                borderTopLeftRadius: '3px',
            }}
        />
        <StyleNameProduct>{name}</StyleNameProduct>
        <WrapperReportText> 
            <span style={{ marginRight: '4px'}}>
                <span>{rating}</span><StarFilled style={{fontSize: '10px', color: 'yellow' }} />
            </span>
            <WrapperStyleTextSell> | {selled || 100 } + </WrapperStyleTextSell>
        </WrapperReportText>
        <WrapperPriceText>
            <span style={{marginRight: '8px' }}>{price}</span>
            <WrapperDiscountText>
                {discount || 5} %
            </WrapperDiscountText>
        </WrapperPriceText>
    </WrapperCardStyle>
  )
}

export default CardComponent