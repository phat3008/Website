import React, { useEffect, useState } from 'react'
import NavBarComponent from '../../components/NavBarComponent/NavBarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import Loading from '../../components/LoadingComponent/Loading'
import * as ProductService from '../../services/ProductService'
import { WrapperLayout, WrapperProducts } from './style'

const TypeProductPage = () => {
    const [allProducts, setAllProducts] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true)
            const res = await ProductService.getAllProduct()
            if (res?.status === 'OK') {
                setAllProducts(res.data)
                setProducts(res.data)
            }
            setLoading(false)
        }
        fetchAllProducts()
    }, [])

    const handleSelectType = (types) => {
        if (types.length === 0) {
            setProducts(allProducts)
        } else {
            const filtered = allProducts.filter(p => types.includes(p.type))
            setProducts(filtered)
        }
    }

    return (
        <Loading isPending={loading}>
            <WrapperLayout>
                <NavBarComponent products={allProducts} onSelectType={handleSelectType} />
                <WrapperProducts>
                    {products.map(p => (
                        <CardComponent key={p._id} {...p} />
                    ))}
                </WrapperProducts>
            </WrapperLayout>
        </Loading>
    )
}

export default TypeProductPage
