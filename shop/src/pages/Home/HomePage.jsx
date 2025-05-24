import React, { useState } from 'react'
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
  const searchDebounce = useDebounce(searchProduct, 1000)
  const [pending, setPending] = useState(false)
  const [limit, setLimit] = useState(6)
  // const [page, setLimit] = useState(6)
  const arr = ['Smartphone', 'Laptop', 'Camera', 'Thiết bị hỗ trợ']

  const fetchProductAll = async (context) => {
    console.log('context', context)
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
       return res
  }

  const { isPending, data: products, isPreviousData } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
    retry : 3, retryDelay: 1000, keepPreviousData: true
  })
  console.log('isPreviousData', products )

    return (
    <Loading isPending={isPending || pending}>
      <div style={{ width: '1270px', margin: '0 auto' }}>
        <WrapperTypeProduct>
        {arr.map((item) => {
          return (
            <TypeProduct name={item} key={item} />
          )
        })}
        </WrapperTypeProduct>
        </div>
        <div className='body' style ={{ width: '100%', backgroundColor: '#efefef' }}>
        <div id="container" style={{ height: '1000px', width: '1270px', margin: '0 auto'}}>
        <SliderComponent arrImages={[slider1, slider2, slider3]}/>    
        <WrapperProducts>
          {products?.data?.map((product) => {
            console.log('product', product)
            return (
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
            )
          })}
        </WrapperProducts>
        <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px', paddingBottom: '40px'}}>
          <WrapperButtonMore 
            textButton={isPreviousData ? 'Load More' : "Xem thêm"} type="outline" styleButton={{
            border: '1px solid rgb(11, 116, 229)', color: `${products?.total === products?.data?.length ? '#ccc' : 'rgb(11, 116, 229)'}`,
          width: '240px', height: '38px', borderRadius: '4px'
        }}
          disable={products?.total === products?.data?.length || products?.totalPage === 1}
                styleTextButton={{ fontWeight: 500, color: products?.total === products?.data?.length && '#fff' }}
          onClick={() => setLimit((prev) => prev + 6)}
          />
        </div>
      </div>
    </div>
    </Loading>
  )
}

export default HomePage