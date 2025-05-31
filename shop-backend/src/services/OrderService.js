const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt } = newOrder;
        try {
            // Cập nhật sản phẩm, kiểm tra tồn kho
            for (const order of orderItems) {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: { countInStock: -order.amount, selled: order.amount }
                    },
                    { new: true }
                );
                if (!productData) {
                    return resolve({
                        status: 'ERR',
                        message: `Sản phẩm với id ${order.product} không đủ hàng`
                    });
                }
            }

            // Nếu update sản phẩm thành công, tạo order 1 lần
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
                user,
                isPaid, 
                paidAt
            });

            if (createdOrder) {
                return resolve({
                    status: 'OK',
                    message: 'Success',
                    orderId: createdOrder._id
                });
            }

            resolve({
                status: 'ERR',
                message: 'Không thể tạo đơn hàng'
            });
        } catch (e) {
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



module.exports = {
    createOrder,
    getAllDetailsOrder,
    getOrderDetails,
    cancelOrderDetails
}