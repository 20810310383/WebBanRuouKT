const SanPham = require("../models/SanPham")
const TaiKhoan_Admin = require("../models/TaiKhoan_Admin")
const TaiKhoan_KH = require("../models/TaiKhoan_KH")
const TaiKhoan_NV = require("../models/TaiKhoan_NV")
const LoaiSP = require("../models/LoaiSP")
const TheLoaiTrongNgoaiNuoc = require("../models/TheLoaiTrongNgoaiNuoc")

const aqp = require('api-query-params')

// --------------------------------------

module.exports = {    

    menuTypesProduct: async (req, res) => {

        // menu trong nuoc va ngoai nuoc
        let id_trongNgoaiNuoc = req.query.id_trongNgoaiNuoc
        console.log("id_trongNgoaiNuoc: ", id_trongNgoaiNuoc);

        let menuCon = await LoaiSP.find({}).populate({
            path: 'IdTheLoaiTrongNgoaiNuoc',
            match: {_id: id_trongNgoaiNuoc}
        })

        res.render("layouts/allSanPham.ejs", {            
            menuCon: menuCon
        })
    },


}