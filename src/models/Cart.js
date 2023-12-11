const mongoose = require('mongoose');
const SanPham = require("./SanPham")

const Schema = mongoose.Schema;

const CartSchema = new Schema({

    cart: {
        items: [{
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'SanPham',
                required: true
            },
            qty: {
                type: Number,
                required: true
            }
        }],
        totalPrice: Number,
        totalQuaty: Number,
        MaTKKH: { type: mongoose.SchemaTypes.ObjectId, ref: "TaiKhoan_KH" },
    }
});


module.exports = mongoose.model('Cart', CartSchema);