import { Col, Row, Image } from 'antd'
import React from 'react'
import ImageProduct from '../../assets/images/test.jpg'
import ImageProductSmall from '../../assets/images/test1.jpg'
import { WrapperAddressProduct, WrapperBtnQualityProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import {MinusCircleOutlined, PlusCircleOutlined, StarFilled} from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ProductDetailsComponent = () => {
  const onChange = () => { }
  return (
    <Row style={{ padding: '16px', background: '#fff', borderRadius: '5px' }}>
        <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight:'10px'}}>
            <Image src={ImageProduct} alt="image product" preview={false} />
            <Row style={{ padding: '10px', justifyContent: 'space-between' }}>
                <WrapperStyleColImage span={4}>
                <WrapperStyleImageSmall src={ImageProductSmall} alt="image small" preview={false} />
                </WrapperStyleColImage>

                <WrapperStyleColImage span={4}>
                <WrapperStyleImageSmall src={ImageProductSmall} alt="image small" preview={false} />
                </WrapperStyleColImage>

                <WrapperStyleColImage span={4}>
                <WrapperStyleImageSmall src={ImageProductSmall} alt="image small" preview={false} />
                </WrapperStyleColImage>

                <WrapperStyleColImage span={4}>
                <WrapperStyleImageSmall src={ImageProductSmall} alt="image small" preview={false} />
                </WrapperStyleColImage>
            </Row>
        </Col>
        <Col span={12} style={{ paddingLeft: '10px'}}>
          <WrapperStyleNameProduct> Động cơ giảm tốc GA12-N20 12V 235 rpm </WrapperStyleNameProduct>
          <div>
            <StarFilled style={{fontSize: '10px', color: 'rgb(253, 216, 54)' }} />
            <StarFilled style={{fontSize: '10px', color: 'rgb(253, 216, 54)' }} />
            <StarFilled style={{fontSize: '10px', color: 'rgb(253, 216, 54)' }} />
            <WrapperStyleTextSell> | Đã bán 100+</WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>60.000đ</WrapperPriceTextProduct>
          </WrapperPriceProduct>
          <WrapperAddressProduct>
            <span>Giao đến </span>
            <span className='address'>Trường đại học Đông Á - 33 XVNT-Tp.Đà Nẵng </span> - 
            <span className='change-address'>Đổi địa chỉ</span>
          </WrapperAddressProduct>
          <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5'}}>
            <div style={{ marginBottom: '12px' }}>Số lượng</div>
            <WrapperQualityProduct>
              <button style={{ border: 'none', background: 'transparent' }}>
              <MinusCircleOutlined style={{ color: '#000', fontSize:'20px' }}/>
              </button>
              <WrapperInputNumber defaultValue={3} onChange={onChange} size="small" />
              <button style={{ border: 'none', background: 'transparent' }}>
              <PlusCircleOutlined style={{ color: '#000', fontSize:'20px' }} /> 
              </button>
            </WrapperQualityProduct>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px'}}>
          <ButtonComponent
                size={40} 
                styleButton={{ 
                  background: 'rgb(255, 163, 169)',
                  height: '48px',
                  width: '220px',
                  border: 'none',
                  borderRadius: '4px',
                }}
                textButton={'Chọn Mua'}
                styleTextButton={{ color: '#fff', fontSize: '16px', fontWeight:'700' }}
            ></ButtonComponent>
            <ButtonComponent
                size={40} 
                styleButton={{ 
                  background: '#fff',
                  height: '48px',
                  width: '220px',
                  border: '1px solid rgb(13, 92, 182)',
                  borderRadius: '4px',
                }}
                textButton={'Them vao gio hang'}
                styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '16px' }}
            ></ButtonComponent>
          </div>
        </Col>
    </Row>
  )
}

export default ProductDetailsComponent