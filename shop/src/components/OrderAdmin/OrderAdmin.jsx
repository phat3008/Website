import React, { useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Space} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import * as OrderService from '../../services/OrderService'
import { orderContant } from '../../contant'

const OrderAdmin = () => {
    const user = useSelector((state) => state?.user)
  
    const [fileList] = useState([]);
  
  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    console.log('res', res)
    return res
    }
    const queryOrder = useQuery({ queryKey: ['order'], queryFn: getAllOrder })
    const { isPending: isPendingOrders, data: orders } = queryOrder

  
    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <InputComponent
            // ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              // onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      filterDropdownOpenChange: (visible) => {
          if (visible) {
            // setTimeout(() => searchInput.current?.select(), 100);
          }
        },
    });
  
    const columns = [
      {
        title: 'User Name',
        dataIndex: 'userName',
        sorter: (a, b) => a.userName.length - b.userName.length,
        ...getColumnSearchProps('userName')
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        sorter: (a, b) => a.phone.length - b.phone.length,
        ...getColumnSearchProps('phone')
      },
      {
        title: 'Address',
        dataIndex: 'address',
        sorter: (a, b) => a.address.length - b.address.length,
        ...getColumnSearchProps('address')
      },
      {
        title: 'Total Price',
        dataIndex: 'totalPrice',
        sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
        ...getColumnSearchProps('totalPrice'),
      },
    ];
  const dataTable = orders?.data?.length && orders?.data?.map((order) => {
    return { ...order, key: order._id, userName: order?.shippingAddress?.fullName, phone: order?.shippingAddress?.phone, address: order?.shippingAddress?.address,
      paymentMethod: orderContant.payment[order?.paymentMethod], isPaid: order?.isPaid ? 'TRUE' : 'FALSE', isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE'
    }
      })

  return (
    <div>
        <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      <div style={{ marginTop: '20px' }}>
        <TableComponent columns={columns} isPending={isPendingOrders} data={dataTable}  />
      </div>
    </div>
  )
}

export default OrderAdmin