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
      <WrapperContentPopup onClick ={handleLogout}>Đăng xuất</WrapperContentPopup>
      <WrapperContentPopup onClick={() => navigate('/profile-user')}>Thông tin người dùng</WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => navigate('/system/admin')}>Quản lý hệ thống</WrapperContentPopup>
      )}
    </div>
  ); 

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  return (
    <div style={{width: '100%', background: 'rgb(246, 8, 24)', display:'flex', justifyContent: 'center'}}>
      <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset'}}>
        <Col span={5}>
          <WrapperTextHeader style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => { navigate('/') }}>
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
        <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center'}}>
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
          <UserOutlined style={{ fontsize: '30px'}} />
          )}
            {user?.access_token ? (
              <>
                <Popover content={content} trigger="click" >
                  <div style={{ cursor: 'pointer'}}>{userName?.length ? userName : user?.email}</div>
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
            <Badge count={4} size="small">
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