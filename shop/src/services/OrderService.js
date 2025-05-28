import { axiosJWT } from "./UserService"

// export const createProduct = async (data) => {
//     const res = await axios.post(`${process.env.REACT_APP_API_KEY}/product/create`, data)
//     return res.data
// }

export const createOrder = async ( data, access_token) => {
    console.log('access_token', {access_token})
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_KEY}/order/create`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}