import React, { useEffect, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Modal } from 'antd'
import {PlusOutlined, DeleteTwoTone, EditTwoTone} from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { getBase64 } from '../../utils'
import { WrapperUploadFile } from './style'
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
      const [fileList] = useState([]);  
  const [stateProduct, setStateProduct] = useState({
    name: '',
    image: '',
    type: '',
    price: '',
    countInStock: '',
    rating: '',
    description: '',
  })

  const [form] = Form.useForm();

  const mutation = useMutationHooks(
    (data) => {
        const {  
              name,
              image,
              type,
              price,
              rating,
              description,
              countInStock: countInStock } = data
            const res = ProductService.createProduct({ 
              name,
              image,
              type,
              price,
              countInStock,
              rating,
              description
            })
          return res
      }
  )

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct() 
    return res
  }

  const { data, isPending, isSuccess, isError } = mutation
  const { isPending : isPendingProduct, data: products } = useQuery({queryKey:['products'], queryFn: getAllProducts})
  const renderAction = () => {
    return (
      <div>
      <DeleteTwoTone style={{ fontSize: '30px', cursor:'pointer'}}/>
      <EditTwoTone style={{ fontSize: '30px', cursor:'pointer'}}/>
      </div>
    )
  }
  const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Price',
        dataIndex: 'price',
    },
    {
        title: 'Rating',
        dataIndex: 'rating',
    },
    {
        title: 'Type',
        dataIndex: 'type',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        render: renderAction
    },
    ];
    const dataTable = products?.data?.length && products?.data?.map((product) => {
      return {...product, key: product._id}
    })
  useEffect (() => {
    if(isSuccess && data?.status === 'OK') {
      message.success()
      handleCancel()
    } else if (isError){
      message.success()
    }
  }, [isSuccess])

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
    name: '',
    image: '',
    type: '',
    price: '',
    countInStock: '',
    rating: '',
    description: '',
    })
    form.resetFields()
  };

  const onFinish = () => {
    mutation.mutate(stateProduct)
  }

  const handleOnChange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    })
  }

  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct ({
      ...stateProduct,
      image: file.preview
    })
  }

  return (
    <div>
        <WrapperHeader>Quản lý sản phẩm </WrapperHeader>
        <div style={{marginTop: '10px'}}>
            <Button style={{height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed'}} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{fontSize: '60px'}}/></Button>
        </div>
        <div style={{ marginTop: '20px'}}>
            <TableComponent columns={columns} isPending={isPendingProduct} data={dataTable}/>
        </div>
        <Modal
          title="Thêm sản phẩm"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Loading isPending={isPending}>

          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
          >
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
              <InputComponent value={stateProduct['name']} onChange={handleOnChange} name="name"/>
              </Form.Item>

              <Form.Item
                label="Type"
                name="type"
                rules={[{ required: true, message: 'Please input your type!' }]}
              >
              <InputComponent value={stateProduct.type} onChange={handleOnChange} name="type"/>
              </Form.Item>

              <Form.Item
                label="Count inStock"
                name="countInStock"
                rules={[{ required: true, message: 'Please input your count inStock!' }]}
              >
              <InputComponent value={stateProduct.countInStock} onChange={handleOnChange} name="countInStock"/>
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: 'Please input your count price!' }]}
              >
              <InputComponent value={stateProduct.price} onChange={handleOnChange} name="price"/>
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please input your count description!' }]}
              >
              <InputComponent value={stateProduct.description} onChange={handleOnChange} name="description"/>
              </Form.Item>

              <Form.Item
                label="Rating"
                name="rating"
                rules={[{ required: true, message: 'Please input your count rating!' }]}
              >
              <InputComponent value={stateProduct.rating} onChange={handleOnChange} name="rating"/>
              </Form.Item>

              <Form.Item
                label="Image"
                name="image"
                rules={[{ required: true, message: 'Please input your count image!' }]}
              >
              <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1} fileList={fileList}>
                <Button >Upload File</Button>
                {stateProduct?.image && (
                  <img src={stateProduct?.image} style={{
                    height: '60px',
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginLeft: '10px'
                    }} alt="avatar"/>
                  )}
              </WrapperUploadFile>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 20, span: 16}}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Loading>
        </Modal>
    </div>
  )
}

export default AdminProduct