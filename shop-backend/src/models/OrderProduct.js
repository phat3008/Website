const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            name: { type: String, required: true},
            amount: {type: Number, required: true},
            image: { type: String, required: true},
            price: { type: Number, required: true },
            discount: { type: Number },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                require: true,
            },
        },
    ],
    shippingAddress: {
        fullName: { type: String, required: true},
        address: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: Number, required: true }
    },
    paymentMethod: { type: String, required: true},
    itemsPrice: { type: String, required: true},
    shippingPrice: { type: String, required: true},
    totalPrice: { type: String, required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    isPaid: { type: Boolean, default: false},
    paidAt: { type: Date},
    isDelivered: { type: Boolean, default: false},
    deliveredAt: { type: Date },
},
    {
        timestamps: true
    }
);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;