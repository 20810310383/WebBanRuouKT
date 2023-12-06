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

// --------------------------------------

module.exports = {
    home: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/home?page=${req.query.page}`)
        }
        res.redirect(`/home`)
    },

    getHomePage: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.taikhoan
        let loggedIn = sessions.loggedIn
        let ten = sessions.ten
        
        console.log(sessions);
        console.log(taikhoan);
        console.log(loggedIn);
        console.log(ten);

        let page = 1
        const limit = 8
        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }
        
        let skip = (page - 1) * limit
        const all = await SanPham.find({}).skip(skip).limit(limit).exec()

        // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
        let numPage = parseInt((await SanPham.find({})).length) / limit

        // kiểm tra xem phần thập phân của numPage có bằng 0 hay không
        // Nếu bằng 0, nghĩa là numPage là một số nguyên, không cần phải thêm một trang nữa
        // Ngược lại, nếu có phần thập phân, nó thêm một trang nữa để đảm bảo rằng tất cả các sản phẩm được hiển thị.
        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1

        // Hàm để định dạng số tiền thành chuỗi có ký tự VND
        function formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        }

        // edit file img
        function getRelativeImagePath(absolutePath) {
            const rootPath = '<%= rootPath.replace(/\\/g, "\\\\") %>';
            const relativePath = absolutePath ? absolutePath.replace(rootPath, '').replace(/\\/g, '/').replace(/^\/?images\/upload\//, '') : '';
            return relativePath;
        }
        

        res.render("home.ejs", {
            soTrang: numPage, 
            curPage: page, 
            allSP: all, 
            logIn: loggedIn, 
            taikhoan, 
            formatCurrency: formatCurrency, 
            rootPath: '/', 
            getRelativeImagePath: getRelativeImagePath 
        })
    },

    chiTietSP: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.taikhoan
        let loggedIn = sessions.loggedIn
        let ten = sessions.ten
        
        console.log(sessions);
        console.log(taikhoan);
        console.log(loggedIn);
        console.log(ten);

        let id = req.query.idCTSP

        let ctsp = await SanPham.findById({_id: id}).exec();

        // Hàm để định dạng số tiền thành chuỗi có ký tự VND
        function formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        }

        // edit file img
        function getRelativeImagePath(absolutePath) {
            const rootPath = '<%= rootPath.replace(/\\/g, "\\\\") %>';
            const relativePath = absolutePath ? absolutePath.replace(rootPath, '').replace(/\\/g, '/').replace(/^\/?images\/upload\//, '') : '';
            return relativePath;
        }

        res.render("layouts/chiTietSP.ejs", {
            CTSP: ctsp, 
            formatCurrency: formatCurrency, 
            rootPath: '/', 
            getRelativeImagePath: getRelativeImagePath,
            logIn: loggedIn, 
            taikhoan, 
        })
        
    },

    homeSearch: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/search-sp?page=${req.query.page}`)
        }
        res.redirect(`/search-sp`)
    },

    trangSanPham: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.taikhoan
        let loggedIn = sessions.loggedIn
        let ten = sessions.ten
        
        console.log(sessions);
        console.log(taikhoan);
        console.log(loggedIn);
        console.log(ten);

        let loaiSP = await LoaiSP.find({}).exec();
        console.log("cac loai sp: ", loaiSP);

        let page = 1
        const limit = 9
        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }
        
        let skip = (page - 1) * limit
        let tenSPSearch = req.query.searchSP
        console.log("ten loai sp can tim req.query.searchSP:",tenSPSearch);
        let tenSP = req.body.searchSP
        console.log("ten loai sp can tim req.body.searchSP:",tenSP);

        // //----------------
        // const iDLoaiSP = await LoaiSP.findOne({ TenLoaiSP: tenSP }).exec();

        // let sp = await SanPham.find({}).populate({
        //     path: 'IdLoaiSP',
        //     select: '_id', // Optional: Only select the _id field of the referenced document
        //     match: { TenLoaiSP: tenSP }
        // });


        // Tìm kiếm IdLoaiSP dựa trên TenLoaiSP
        // const iDLoaiSP = await LoaiSP.findOne({ TenLoaiSP: tenSP }).exec();

        // if (!iDLoaiSP) {
        //     // Nếu không tìm thấy loại sản phẩm
        //     return res.status(404).send("Không tìm thấy loại sản phẩm.");
        // }

        // const sp = await SanPham.find({ IdLoaiSP: iDLoaiSP._id }).exec();

        // // Tính toán tổng số trang cần hiển thị
        // const numPage = Math.ceil(totalSanPham / limit);

        // // Tìm kiếm các sản phẩm liên quan dựa trên IdLoaiSP với phân trang
        // const sanPham = await SanPham.find({ IdLoaiSP: loaiSP._id })
        //     .skip((page - 1) * limit)
        //     .limit(limit)
        //     .exec();

        // if (!sanPham) {
        //     // Nếu không tìm thấy sản phẩm
        //     return res.status(404).send("Không tìm thấy sản phẩm.");
        // }
        // //-----------------

        // // Thực hiện tìm kiếm sản phẩm gần đúng
        
        const timKiemSP = await SanPham.find({ TenSP: { $regex: new RegExp(tenSPSearch, 'i') } }).skip(skip).limit(limit).exec();

        if (!timKiemSP) {
            // Nếu không tìm thấy sản phẩm
            return res.status(404).send("Không tìm thấy sản phẩm.");
        }

        // console.log("kq tim kiem: ", timKiemSP);

        // tính toán tổng số trang cần hiển thị bằng cách: CHIA (tổng số sản phẩm) cho (số lượng sản phẩm trên mỗi trang)
        let numPage = parseInt((await SanPham.find({ TenSP: { $regex: new RegExp(tenSPSearch, 'i') } })).length) / limit

        
        // kiểm tra xem phần thập phân của numPage có bằng 0 hay không
        // Nếu bằng 0, nghĩa là numPage là một số nguyên, không cần phải thêm một trang nữa
        // Ngược lại, nếu có phần thập phân, nó thêm một trang nữa để đảm bảo rằng tất cả các sản phẩm được hiển thị.
        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1
        console.log("tổng số trang cần hiển thị: ", numPage);

        // Hàm để định dạng số tiền thành chuỗi có ký tự VND
        function formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        }

        // edit file img
        function getRelativeImagePath(absolutePath) {
            const rootPath = '<%= rootPath.replace(/\\/g, "\\\\") %>';
            const relativePath = absolutePath ? absolutePath.replace(rootPath, '').replace(/\\/g, '/').replace(/^\/?images\/upload\//, '') : '';
            return relativePath;
        }

        // đoạn này chưa làm xong
        // menu trong nuoc va ngoai nuoc
        let menuCha = await TheLoaiTrongNgoaiNuoc.find({}).exec();
        
        let id_trongNgoaiNuoc = req.params.id_trongNgoaiNuoc

        if (menuCha.TenTheLoaiTrongNgoaiNuoc === "Trong Nước") {

        }
        let menuCon = [];
        if (id_trongNgoaiNuoc) {
            menuCon = await LoaiSP.find({ IdTheLoaiTrongNgoaiNuoc: id_trongNgoaiNuoc }).exec();
        }

        // console.log("id_trongNgoaiNuoc: ", id_trongNgoaiNuoc);
        // console.log("menuCon: ", menuCon);
        // console.log("menuCon.TenTheLoaiTrongNgoaiNuoc: ", menuCon.TenTheLoaiTrongNgoaiNuoc);
        // --------------------------------------------------------------------------------------------


        res.render("layouts/allSanPham.ejs", {
            soTrang: numPage, 
            curPage: page, 
            allSP: timKiemSP, 
            formatCurrency: formatCurrency, 
            rootPath: '/', 
            getRelativeImagePath: getRelativeImagePath,
            menuCha: menuCha,
            menuCon: menuCon,
            loaiSP: loaiSP,
            logIn: loggedIn, 
            taikhoan
        })
    },

    // test
    trangSanPham_search: async (req, res) => {

        const tenLoaiSP = req.query.searchSPP;
        const page = req.query.page || 1; // Trang mặc định là 1
        const limit = 9;
        console.log("tenLoaiSP: ",tenLoaiSP);

        // Tìm kiếm IdLoaiSP dựa trên TenLoaiSP
        const loaiSP = await LoaiSP.findOne({ TenLoaiSP: tenLoaiSP }).exec();

        if (!loaiSP) {
            // Nếu không tìm thấy loại sản phẩm
            return res.status(404).send("Không tìm thấy loại sản phẩm.");
        }

        // Tính tổng số sản phẩm
        const totalSanPham = await SanPham.countDocuments({ IdLoaiSP: loaiSP._id }).exec();

        // Tính toán tổng số trang cần hiển thị
        const numPage = Math.ceil(totalSanPham / limit);

        // Tìm kiếm các sản phẩm liên quan dựa trên IdLoaiSP với phân trang
        const sanPham = await SanPham.find({ IdLoaiSP: loaiSP._id })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        if (!sanPham) {
            // Nếu không tìm thấy sản phẩm
            return res.status(404).send("Không tìm thấy sản phẩm.");
        }

        // Hàm để định dạng số tiền thành chuỗi có ký tự VND
        function formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        }

        // edit file img
        function getRelativeImagePath(absolutePath) {
            const rootPath = '<%= rootPath.replace(/\\/g, "\\\\") %>';
            const relativePath = absolutePath ? absolutePath.replace(rootPath, '').replace(/\\/g, '/').replace(/^\/?images\/upload\//, '') : '';
            return relativePath;
        }

        res.render("layouts/allSanPham.ejs", {
            soTrang: numPage,
            curPage: page,
            allSP: sanPham,
            formatCurrency: formatCurrency, 
            rootPath: '/', 
            getRelativeImagePath: getRelativeImagePath, 

    
        });
    },

}