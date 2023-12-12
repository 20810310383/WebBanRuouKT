const mongoose = require('mongoose');
const SanPham = require("./SanPham")
const mongoose_delete = require('mongoose-delete');

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

CartSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
module.exports = mongoose.model('Cart', CartSchema);