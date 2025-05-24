import { configureStore } from '@reduxjs/toolkit'
import productReducer from './slides/productSilde'
import userReducer from './slides/userSlide'


export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer
  },
})