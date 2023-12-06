const SanPham = require("../models/SanPham")
const TaiKhoan_Admin = require("../models/TaiKhoan_Admin")
const TaiKhoan_KH = require("../models/TaiKhoan_KH")
const TaiKhoan_NV = require("../models/TaiKhoan_NV")
const LoaiSP = require("../models/LoaiSP")
const TheLoaiTrongNgoaiNuoc = require("../models/TheLoaiTrongNgoaiNuoc")
require('rootpath')();

const {uploadSingleFile} = require('../services/fileService')
const {
    createSanPhamService,
    searchSanPhamService,

    } = require('../services/sanPhamService')
const aqp = require('api-query-params')
const mongoose = require('mongoose')
// --------------------------------------

module.exports = {

    // tao 1 san pham va upload file anh vao db
    postCreateSP: async (req, res) => {

        let {TenSP, IdLoaiSP, GiaBan, GiaCu, MoTa, Sale_New, SoLuongTon, SoLuongBan, Image} = req.body

        let imageUrl = ""
        // kiem tra xem da co file hay chua
        if (!req.files || Object.keys(req.files).length === 0) {
            // khong lam gi
        }
        else {
            let kq = await uploadSingleFile(req.files.Image)
            imageUrl = kq.path
            console.log(">>> check kq: ", kq.path);
        }

        let sanPhamData = {
            TenSP, IdLoaiSP, GiaBan, GiaCu, MoTa, Sale_New, SoLuongTon, SoLuongBan,
            Image: imageUrl
        }

        let SP = await createSanPhamService(sanPhamData)
        
        return res.status(200).json({
            errCode: 0,
            data: SP
        })
    },



    trangSanPham: async (req, res) => {

        let loaiSP = await LoaiSP.find({}).exec();
        console.log("cac loai sp: ", loaiSP);

        let tenSP = req.query.searchSP
        console.log("ten loai sp can tim req.query.searchSP:",tenSP);

        // //----------------
        // const iDLoaiSP = await LoaiSP.findOne({ TenLoaiSP: tenSP }).exec();

        // let sp = await SanPham.find({}).populate({
        //     path: 'IdLoaiSP',            
        //     match: { TenLoaiSP: tenSP }
        // });


        // Tìm kiếm IdLoaiSP dựa trên TenLoaiSP
        const iDLoaiSP = await LoaiSP.findOne({ TenLoaiSP: tenSP }).exec();

        if (!iDLoaiSP) {
            // Nếu không tìm thấy loại sản phẩm
            return res.status(404).send("Không tìm thấy loại sản phẩm.");
        }

        const idLoaiSP = iDLoaiSP._id.toString(); 
        console.log("idLoaiSP:",idLoaiSP);

        
        let sp = await SanPham.find({ IdLoaiSP: idLoaiSP }).populate('IdLoaiSP').exec();
        // let sp = await SanPham.find({ IdLoaiSP: idLoaiSP }).exec();

        console.log("sp:", sp);
        // //-----------------

        // // Thực hiện tìm kiếm sản phẩm gần đúng
        
        // const timKiemSP = await SanPham.find({ TenSP: { $regex: new RegExp(tenSP, 'i') } }).exec();


        return res.status(200).json({
            errCode: 0,
            data: sp
        })
    },



}