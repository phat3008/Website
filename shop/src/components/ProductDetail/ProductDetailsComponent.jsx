import { Col, Row, Image } from 'antd'
import React, { useState } from 'react'
import ImageProduct from '../../assets/images/test.jpg'
import ImageProductSmall from '../../assets/images/test1.jpg'
import { WrapperAddressProduct, WrapperBtnQualityProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import {MinusCircleOutlined, PlusCircleOutlined, StarFilled} from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { Rate } from 'antd'
import { useSelector } from 'react-redux'

const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1)
  const user = useSelector((state) => state.user) 
  const onChange = (value) => {
    setNumProduct(value)
  }
  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1]
      if(id) {
        const res = await ProductService.getDetailsProduct(id)
          return res.data
      }
    }

  const handleChangeCount = (type) => {
    setNumProduct(prev => {
      if (type === 'increase') return prev + 1
      if (type === 'decrease') return prev > 1 ? prev - 1 : 1
      return prev
    })
    }

  const { isPending, data: productsDetails } = useQuery({
    queryKey: ['products-details', idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct 
  })
  return (
    <Loading isPending={isPending}>
    <Row style={{ padding: '16px', background: '#fff', borderRadius: '5px' }}>
        <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight:'10px'}}>
          <Image src={productsDetails?.image || ImageProduct} alt="image product" preview={false} />
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
          <WrapperStyleNameProduct>{productsDetails?.name}</WrapperStyleNameProduct>
          <div>
            <Rate allowHalf defaultValue={productsDetails?.rating} value={productsDetails?.rating}/>
            <WrapperStyleTextSell> | Đã bán 100+</WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>
              {productsDetails?.price?.toLocaleString('vi-VN')} đ
            </WrapperPriceTextProduct>
          </WrapperPriceProduct>
          <WrapperAddressProduct>
            <span>Giao đến </span>
            <span className='address'>{user?.address}</span> - 
            <span className='change-address'>Đổi địa chỉ</span>
          </WrapperAddressProduct>
          <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5'}}>
            <div style={{ marginBottom: '12px' }}>Số lượng</div>
            <WrapperQualityProduct>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <MinusCircleOutlined style={{ color: '#000', fontSize: '20px' }} onClick={() => handleChangeCount('decrease')} />
              </button>
              <WrapperInputNumber onChange={onChange} value={numProduct} size="small" />
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase')}>
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
                textButton={'Thêm vào giỏ hàng'}
                styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '16px' }}
            ></ButtonComponent>
          </div>
        </Col>
    </Row>
    </Loading>
  )
}

export default ProductDetailsComponent