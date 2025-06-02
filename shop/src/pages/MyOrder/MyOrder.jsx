import React, { useEffect } from 'react';
import Loading from '../../components/LoadingComponent/Loading';
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { WrapperContainer, WrapperListOrder, WrapperItemOrder, WrapperHeaderItem, WrapperStatus, WrapperFooterItem } from './style'
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useMutationHooks } from '../../hooks/useMutationHook';

const MyOrderPage = () => {
  const location = useLocation()
  const { state } = location
  const navigate = useNavigate()

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.token)
    return res.data 
  }
  const queryOrder = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrder,
    enabled: !!state?.token
  });
  const { isLoading, data } = queryOrder

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token
      }
    })
  }

  const mutation = useMutationHooks( async (data) => {
      const { id, token, orderItems } = data
      const res = await OrderService.cancelOrder(id, token, orderItems)
      return res
    }
  )

  const handleCancelOrder = (order) => {
    mutation.mutate({ id: order._id, token:state?.token, orderItems: order?.orderItems}, {
      onSuccess: () => {
        queryOrder.refetch()
      }
    })
  }

  const { isPending: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel} = mutation

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success()
    } else if (isErrorCancel) {
      message.error()
    }
  }, [isErrorCancel, isSuccessCancel])

  const renderProduct = (data) => {
    return data?.map((order) => {
      return <WrapperHeaderItem key={order._id}>
        <img src={order?.image}
          style={{
            width: '70px',
            height: '70px',
            objectFit: 'cover',
            border: '1px solid rgb(238, 238, 238)',
            padding: '2px'
          }}
        />
        <div style={{
          width: 260,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginLeft: '10px'
        }}> {order?.name} </div>
        <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>{convertPrice(order?.price)}</span>
      </WrapperHeaderItem>
    })
  }

  return (
    <Loading isPending={isLoading || isLoadingCancel}>
      <WrapperContainer>
        <div style={{
          width: '100%',
          maxWidth: '1000px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          padding: '20px',
        }}>
          <h4>Đơn hàng của tôi</h4>
          <WrapperListOrder>
            {data?.map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{fontSize: '14px', fontWeight: 'bold'}}>Trạng thái</span>
                    <div><span style={{ color: 'rgb(255, 66, 78)' }}> Giao hàng: </span>{`${order.isDelivery ? 'Đã giao hàng' : 'Chưa giao hàng'}`}</div>
                    <div><span style={{ color: 'rgb(255, 66, 78)' }}> Thanh toán: </span>{`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}</div>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                <WrapperFooterItem>
                  <div>
                    <span style={{ color: 'rgb(255, 66, 78)'}}>Tổng tiền: </span>
                    <span 
                    style={{fontSize: '13px', color: 'rgb(56, 56, 61)', fontWeight: 700}}>
                        {convertPrice(Number(order?.totalPrice))}</span>
                  </div>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <ButtonComponent
                    disabled={order.isDelivery}
                    onClick={() => handleCancelOrder(order)}
                    size={40}
                    styleButton={{
                      height: '36px',
                      border: '1px solid rgb(11, 116, 229)',
                      borderRadius: '4px'
                    }}
                    textButton={'Hủy đơn hàng'}
                    styleTextButton={{color: 'rgb(11, 116, 229)', fontSize: '14px' }}
                    >
                    </ButtonComponent>
                    <ButtonComponent
                      onClick={() => handleDetailsOrder(order?._id)}
                      size="middle"
                      styleButton={{
                        height: '36px',
                        border: '1px solid rgb(11, 116, 229)',
                        borderRadius: '4px'
                      }}
                      textButton={'Xem chi tiết'}
                      styleTextButton={{ color: 'rgb(11, 116, 229)', fontSize: '14px' }}
                    >
                    </ButtonComponent>
                  </div>
                </WrapperFooterItem>
                </WrapperItemOrder>
              )
            })}
          </WrapperListOrder>
          </div>
        </WrapperContainer>
    </Loading>
  );
};

export default MyOrderPage;