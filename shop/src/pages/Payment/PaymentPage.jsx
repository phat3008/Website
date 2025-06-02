import React, { useEffect, useMemo, useState } from 'react';
import { Label, WrapperInfo,  WrapperLeft,  WrapperRadio,  WrapperRight, WrapperTotal} from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import InputComponent from '../../components/InputComponent/InputComponent';
import { Form, Radio } from 'antd';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slides/userSlide';
import * as message from '../../components/Message/Message'
import { useNavigate } from 'react-router-dom';
import { removeAllOrderProduct } from '../../redux/slides/orderSlide';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import * as PaymentService from '../../services/PaymentService'

const PaymentPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)

  const [delivery, setDelivery] = useState('fast')
  const [payment, setPayment] = useState('later_money')
  const navigate = useNavigate()
  const [sdkReady, setSdkReady] = useState(false)

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
      name: '',
      phone: '',
      address: '',
      city: ''
  })

  const [clientId, setClientId] = useState(null);

  const [form] = Form.useForm();
  const dispatch = useDispatch()

  useEffect(() => {
      form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if(isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }
  useEffect(() => {
    // Lấy client-id PayPal từ server
    const fetchClientId = async () => {
      try {
        const { data } = await PaymentService.getConfig();
        setClientId(data);
      } catch (error) {
        console.error('Failed to get PayPal client ID', error);
      }
    };
    fetchClientId();
  }, []);
  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    }, 0)
      return result
  },[order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      const discountPercent = cur.discount || 0
      const price = cur.price || 0
      const amount = cur.amount || 1
      const discountAmount = (price * discountPercent / 100) * amount
      return total + discountAmount
    }, 0)

    return Number(result) || 0
  }, [order])
  

  const diliveryPriceMemo = useMemo(() => {
    if(priceMemo >= 200000 && priceMemo < 500000 ){
      return 10000
    } else if (priceMemo >= 500000 || order?.orderItemsSelected?.length === 0){
      return 0
    } else {
      return 30000
    }
  }, [priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
  }, [priceMemo, priceDiscountMemo, diliveryPriceMemo])

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemsSelected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      mutationAddOrder.mutate({
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: 'payment',
        itemsPrice: priceMemo,
        shippingPrice: diliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id
      }, {
        onSuccess: () => {
          const arrayOrdered = []
          order?.orderItemsSelected?.forEach(element => {
            arrayOrdered.push(element.product)
          });
          dispatch(removeAllOrderProduct({listChecked: arrayOrdered}))
          message.success('Đặt hàng thành công')
          navigate('/orderSuccess', {
            state: {
              delivery,
              payment,
              orders: order?.orderItemsSelected,
              totalPriceMemo: totalPriceMemo
            }
          })
        },
        onError: () => {
          message.error('Đặt hàng thất bại')
        }
      })
    }
  }

  const mutationUpdate = useMutationHooks(
        (data) => {
          const { id,
            token,
            ...rests } = data
          const res = UserService.updateUser(
            id,
            { ...rests }, token)
          return res
        }
      )

    const mutationAddOrder = useMutationHooks(async (data) => {
    return await OrderService.createOrder(data, user?.access_token)
      })

  const { isPending, data } = mutationUpdate 
  const { isPending: isPendingAddOrder } = mutationAddOrder 
  

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: '',
      phone: '',
      address: '',
      city: ''
    })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }

  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate({
      orderItems: order?.orderItemsSelected,
      fullName: user?.name,
      address: user?.address,
      phone: user?.phone,
      city: user?.city,
      paymentMethod: payment,
      itemsPrice: priceMemo,
      shippingPrice: diliveryPriceMemo,
      totalPrice: totalPriceMemo,
      user: user?.id,
      isPaid: true,
      paidAt: details.update_time
    })
  }

  const handleUpdateInforUser = () => {
  const {name, address, city, phone} = stateUserDetails
  if (name && address && city && phone){
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({name, address, city, phone}))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }

  const handleDilivery = (e) => {
    setDelivery(e.target.value)
  }

  const handlePayment = (e) => {
    setPayment(e.target.value)
  }

  return (
    <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
      <Loading isPending={isPendingAddOrder}>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
          <h3>Thanh toán</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WrapperLeft>
              <WrapperInfo>
                <div>
                  <Label>Chọn phương thức giao hàng</Label>
                  <WrapperRadio onChange={handleDilivery} value ={delivery}>
                    <Radio value ="fast"><span style={{color: '#ea8500', fontWeight:' bold'}}>FAST</span> Giao hàng tiết kiệm</Radio>
                    <Radio value="gojek"><span style={{ color: '#ea8500', fontWeight: ' bold' }}>GO_JEL</span> Giao hàng tiết kiệm</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Label>Chọn phương thức thanh toán</Label>
                  <WrapperRadio onChange={handlePayment} value={payment}>
                    <Radio value="later_money">Thanh toán tiền mặt khi nhận hàng</Radio>
                    <Radio value="paypal">Thanh toán bằng paypal</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
            </WrapperLeft>
            <WrapperRight>
              <div style={{ width: '100%' }}>
                <WrapperInfo>
                  <div>
                    <span>Địa chỉ: </span>
                    <span>{`${user?.address} ${user?.city}`} </span>
                    <span onClick={handleChangeAddress} style={{color: 'blue', cursor: 'pointer'}}>Thay đổi</span>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
                  <div style={{ display: 'flex',alignItems: '13px', justifyContent: 'space-between' }}>
                    <span>Tạm tính</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
                  </div>
                  <div style={{ display: 'flex',alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Giảm giá</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceDiscountMemo)}</span>
                  </div>
                  <div style={{ display: 'flex',alignItems: 'center',justifyContent: 'space-between' }}>
                    <span>Phí giao hàng</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(diliveryPriceMemo)}</span>
                  </div>
                </WrapperInfo>
                <WrapperTotal>
                  <span>Tổng tiền</span>
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
                    <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                  </span>
                </WrapperTotal>
              </div>
              {payment === 'paypal' ? (
                clientId ? (
                  <div style={{ width: '350px' }}>
                    <PayPalScriptProvider options={{ "client-id": clientId, components: "buttons" }}>
                      <PayPalButtons
                        style={{ layout: 'vertical' }}
                        onApprove={(data, actions) => {
                          return actions.order.capture().then((details) => {
                            onSuccessPaypal(details, data);
                          });
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                ) : (
                  <Loading isPending={true} />
                )
              ) : (
                <ButtonComponent
                  onClick={handleAddOrder}
                  size={40}
                  styleButton={{
                    background: 'rgb(255, 57, 69)',
                    height: '48px',
                    width: '320px',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                  textButton={'ĐẶT HÀNG'}
                  styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                ></ButtonComponent>
              )}
            </WrapperRight>
          </div>
        </div>
        <ModalComponent forceRender
          title="Cập nhật thông tin giao hàng"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isOpenModalUpdateInfo}
          onCancel={handleCancelUpdate}
          onOk={handleUpdateInforUser}>
          <Loading isPending={isPending}>
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              form={form}
              // onFinish={onUpdateUser}
              autoComplete="on">
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
              </Form.Item>

              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'Please input your city!' }]}
              >
                <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
              </Form.Item>
                        
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please input your phone!' }]}
              >
                <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
              </Form.Item>
                        
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please input your address!' }]}
              >
                <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
              </Form.Item>
          </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  );
};

export default PaymentPage;