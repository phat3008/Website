import React, { useEffect, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import  slider1  from '../../assets/images/slider1.webp'
import  slider2  from '../../assets/images/slider2.webp'
import  slider3  from '../../assets/images/slider3.webp'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const [pending, setPending] = useState(false)
  const [limit, setLimit] = useState(6)
  const [TypeProducts, setTypeProducts] = useState([])

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
       return res
  }
 
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if(res?.status === 'OK') {
      setTypeProducts(res?.data)
    }
  }

  const { isPending, data: products, isPreviousData } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
    retry : 3, retryDelay: 1000, keepPreviousData: true
  })

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])


    return (
      <Loading isPending={isPending || pending}>
        <div style={{ width: '1270px', margin: '0 auto' }}>
          <WrapperTypeProduct>
            {TypeProducts.map((item) => (
              <TypeProduct name={item} key={item} />
            ))}
          </WrapperTypeProduct>
        </div>
        <div className='body' style={{ width: '100%', backgroundColor: '#efefef' }}>
          <div id="container" style={{ width: '1270px', margin: '0 auto' }}>
            <SliderComponent arrImages={[slider1, slider2, slider3]} />
            <WrapperProducts>
              {products?.data?.map((product) => (
                <CardComponent
                  key={product._id}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  selled={product.selled}
                  discount={product.discount}
                  id={product._id}
                />
              ))}
            </WrapperProducts>
            {products?.data?.length > 0 && products?.data?.length < products?.total && (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '10px',
                  paddingBottom: '40px',
                }}
              >
                <WrapperButtonMore
                  textButton={isPreviousData ? 'Loading...' : 'Xem thêm'}
                  type="outline"
                  styleButton={{
                    border: '1px solid rgb(11, 116, 229)',
                    color: 'rgb(11, 116, 229)',
                    width: '240px',
                    height: '38px',
                    borderRadius: '4px',
                    opacity: isPreviousData ? 0.6 : 1,
                    cursor: isPreviousData ? 'not-allowed' : 'pointer',
                  }}
                  disabled={isPreviousData}
                  styleTextButton={{ fontWeight: 500 }}
                  onClick={() => setLimit((prev) => prev + 6)}
                />
              </div>
            )}
          </div>
        </div>
        <div style={{ backgroundColor: '#f8f8f8', padding: '10px 0', fontSize: '14px', color: '#333', borderBottom: '1px solid #ccc' }}>
          <div style={{ width: '1270px', margin: '0 auto', lineHeight: '1.6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div>
                <strong>Bảo hành</strong> &nbsp;|&nbsp;
                <strong>Đổi trả</strong> &nbsp;|&nbsp;
                <strong>Bảo mật</strong> &nbsp;|&nbsp;
                <strong>Điều khoản</strong>
              </div>
              <div>
                Hộ kinh doanh Linh kiện điện tử HongPhat / GPĐKKD số: 123456789 do Thành Phố  ***  cấp ngày 01/06/2025
              </div>
            </div>
            <div style={{ marginTop: '8px' }}>
              <div><strong>Điện tử HPShop Đà Nẵng:</strong> 33 XVNT, Hòa Cường Nam, Hải Châu, Thành phố Đà Nẵng – 📞 036 87 11 496</div>
              <div><strong>Điện tử HPShop Phú Yên:</strong> An Mỹ, Tuy An, Phú Yên – 📞 036 87 11 496</div>
            </div>
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div>HPShopVN.COM © 2021 - 2025</div>
              <div>
                <span>UDA.com DaiHocDongA</span> &nbsp;|&nbsp;
                <span>Công ty TNHH HPShop</span>
              </div>
            </div>
          </div>
        </div>
      </Loading>
  )
}

export default HomePage