const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');

const TheLoaiTrongNgoaiNuoc_Schema = new mongoose.Schema(
    {
        TenTheLoaiTrongNgoaiNuoc: { type: String, required: false },
        
    },

);

// Override all methods
TheLoaiTrongNgoaiNuoc_Schema.plugin(mongoose_delete, { overrideMethods: 'all' });

const TheLoaiTrongNgoaiNuoc = mongoose.model('TheLoaiTrongNgoaiNuoc', TheLoaiTrongNgoaiNuoc_Schema);

module.exports = TheLoaiTrongNgoaiNuoc;