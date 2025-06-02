import { Col, Row, Input, Button, Badge } from 'antd'
import React, { useEffect, useState } from 'react'
import { WrapperHeader, WrapperTextHeader, WrapperHeaderAccount, WrapperTextHeaderSmall, WrapperContentPopup } from './style'
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Popover } from 'antd';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import Loading from '../LoadingComponent/Loading';
import { isPending } from '@reduxjs/toolkit';
import { searchProduct } from '../../redux/slides/productSilde';
const  { Search } = Input

const HeaderComponents = ({isHiddenSearch = false, isHiddenCart = false}) => {
  const navigate = useNavigate ()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [search, setSearch] = useState('')
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const order = useSelector((state) => state.order)
  const [loading, setLoading] = useState(false)
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

const handleLogout = async () =>{
  setLoading(true)
  await UserService.logoutUser()
  localStorage.removeItem('access_token')
  dispatch(resetUser())
  setLoading(false)
  navigate('/sign-in')
}
  useEffect(() => {
    setLoading(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    setLoading(false)
  }, [user?.name, user?.avatar])

  const content = (
    <div>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lý hệ thống</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate(`my-order`)}>Đơn hàng của tôi</WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
    </div>
  ); 

  const handleClickNavigate = (type) => {
    if(type === 'profile') {
      navigate('/profile-user')
    } else if(type === 'admin' ) {
      navigate('/system/admin')
    } else if( type === 'my-order') {
      navigate('/my-order' , {
        state: {
          id: user?.id,
          token: user?.access_token
        }
      })
    }else {
      handleLogout()
    }
    setIsOpenPopup(false)
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  return (
    <div style={{width: '100%', background: 'rgb(246, 8, 24)', display:'flex', justifyContent: 'center'}}>
      <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset'}}>
        <Col span={5}>
          <WrapperTextHeader style={{ cursor: 'pointer', fontWeight: 'bold' }} to='/' >
          THEGIOIDIENTU
        </WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={13}>
            <ButtonInputSearch
            size="large"
            variant="borderless"
            textButton="Tìm kiếm"
              placeholder="Nhập tên sản phẩm bạn muốn tìm kiếm"
              onChange={onSearch}
            />
          </Col>
        )}
        <Col span={6} style={{ display: 'flex', gap: '24px', alignItems: 'center'}}>
        <Loading isPending={loading}> 
        <WrapperHeaderAccount>
          {userAvatar ? (
            <img src={userAvatar} alt="avatar" style={{
                    height: '30px',
                    width: '30px',
                    borderRadius: '50%',
                    objectFit: 'cover',
              }}/>
          ) : (
          <UserOutlined style={{ fontSize: '30px', color: '#fff' }} />
          )}
            {user?.access_token ? (
              <>
                  <Popover content={content} trigger="click" open={isOpenPopup}>
                  <div style={{ cursor: 'pointer'}} onClick={() => setIsOpenPopup((prev) => !prev )}>{userName?.length ? userName : user?.email}</div>
                </Popover>
              </>
            ) : (
          <div onClick={handleNavigateLogin} style={{ cursor: 'pointer'}}>
            <WrapperTextHeaderSmall >Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
            <div>
            <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
            <CaretDownOutlined />
            </div>
          </div>
          )}
        </WrapperHeaderAccount>
        </Loading>
        {!isHiddenCart &&(
          <div onClick={() => navigate('/order')} style={{cursor: 'pointer'}}>
            <Badge count={order?.orderItems?.length} size="small">
            <ShoppingOutlined style={{ fontSize: '30px', color: '#fff' }} />
            </Badge>
            <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
          </div>
        )}
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponents