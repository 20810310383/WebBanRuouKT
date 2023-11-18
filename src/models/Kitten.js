const mongoose = require('mongoose')

// shape data
const kittySchema = new mongoose.Schema({
    name: String
});

const Kitten = mongoose.model('Kitten', kittySchema);


module.exports = Kitten

