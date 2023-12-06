const path = require('path');
const aqp = require('api-query-params')
const SanPham = require("../models/SanPham")
const LoaiSP = require("../models/LoaiSP")

module.exports = {
    createSanPhamService: async (spData) => {

        try{

            let kq = await SanPham.create({
                TenSP: spData.TenSP,
                IdLoaiSP: spData.IdLoaiSP,
                GiaBan: spData.GiaBan,
                GiaCu: spData.GiaCu,
                MoTa: spData.MoTa,
                Sale_New: spData.Sale_New,
                SoLuongTon: spData.SoLuongTon,
                SoLuongBan: spData.SoLuongBan,
                Image: spData.Image   
            })
    
            return kq
    
        } catch(error) {
             console.log("er: ", error);
             return null
        } 

    },

    updateSanPhamService: async (id, TenSP, GiaBan, GiaCu, MoTa, Sale_New, SoLuongTon, SoLuongBan, Image, IdLoaiSP) => {

        try{
    
            let sp = await SanPham.updateOne({ _id: id }, { TenSP, GiaBan, GiaCu, MoTa, Sale_New, SoLuongTon, SoLuongBan, Image, IdLoaiSP });
            return sp
    
        } catch(error) {
            console.log("er >>> ", error);
            return null
        } 
    },

    searchSanPhamService: async (tensp) => {

        try{

            let kq = await SanPham.findOne({ TenSP: tensp }).exec()
    
            return kq
    
        } catch(error) {
             console.log("er: ", error);
             return null
        } 
    },
}

