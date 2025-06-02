const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt } = newOrder;
        try {
            // Cập nhật sản phẩm, kiểm tra tồn kho
            const promise = orderItems.map(async (order)=> {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: { countInStock: -order.amount, selled: +order.amount }
                    },
                    { new: true }
                );
                if (productData) {
                    return {
                        status: 'OK',
                        message: 'Success'
                    };
                } else {
                    return{ 
                        status:'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promise)
            const newData = results && results.filter((item) => item.id)
            if(newData.length) {
                const arrId= []
                newData.forEach((item) => {
                    arrId.push(item.id)
                })
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id: ${arrId.join(',')} không đủ hàng`
                })
            } else {
                const createdOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        fullName,
                        address,
                        phone,
                        city
                    },
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    user: user,
                    isPaid, 
                    paidAt
                });
                if (createdOrder) {
                    resolve({
                        status: 'OK',
                        message: 'Success',
                    });
                }
            }
        } catch (e) {
            console.log('e', e)
            reject(e);
        }
    });
};
  

const getAllDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user : id
            })
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            } 

            resolve({
                status: 'OK',
                message: 'Success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const cancelOrderDetails = (id, orderItems) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Bước 1: Cập nhật lại kho cho từng sản phẩm
            for (const item of orderItems) {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: item.product
                    },
                    {
                        $inc: {
                            countInStock: item.amount,
                            selled: -item.amount
                        }
                    },
                    { new: true }
                );

                if (!productData) {
                    return resolve({
                        status: 'ERR',
                        message: `Không tìm thấy sản phẩm với id ${item.product}`
                    });
                }
            }

            // Bước 2: Xoá đơn hàng
            const deletedOrder = await Order.findByIdAndDelete(id);

            if (!deletedOrder) {
                return resolve({
                    status: 'ERR',
                    message: 'Đơn hàng không tồn tại'
                });
            }

            return resolve({
                status: 'OK',
                message: 'Huỷ đơn hàng thành công',
                deletedOrder
            });
        } catch (e) {
            console.log('Lỗi huỷ đơn hàng:', e);
            return reject(e);
        }
    });
};

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createOrder,
    getAllDetailsOrder,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder
}