const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');

const KhachHang_Schema = new mongoose.Schema({
  HoTen: { type: String, required: true },
  GioiTinh: { type: String, enum: ["Nam", "Nữ"], required: true },
  DiaChi: { type: String, require: true },
  NgaySinh: { type: Date },
  SDT: { type: String },
  Avatar: { type: mongoose.SchemaTypes.ObjectId, ref: "Image" }
});

KhachHang_Schema.plugin(mongoose_delete);
module.exports = mongoose.model("KhachHang", KhachHang_Schema);
