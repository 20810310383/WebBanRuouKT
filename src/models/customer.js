const mongoose = require('mongoose')

// shape data
const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        address: String,
        phone: String,
        email: String,
        image: String,
        description: String,
    },
    { timestamps: true }    // createAt, updateAt
);

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;

