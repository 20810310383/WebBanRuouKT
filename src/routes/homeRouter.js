const express = require('express');
const {
    getHomePage,
    home,
    chiTietSP,
    homeSearch,
    trangSanPham,
    trangSanPham_search

} = require("../controllers/homeController")

const {
    menuTypesProduct,


} = require("../controllers/typesProductController")

const {
    homeLoginKH,
    dangKyKH,
    dangNhapKH,
    getLogoutKH

} = require("../controllers/loginKHController")

const {
    homeLoginAdmin,
    dangKyAdmin,
    dangNhapAdmin,
    getLogoutAdmin

} = require("../controllers/loginAdminController")

const {
    getHomeAdmin,
    getHomeQLSP,
    getHomePhanTrang,
    getSearchQLSP,
    gethomeSearchQLSP,
    removeSP,
    hienThiFormCreateSP,
    postCreateSP,
    hienThiFormUpdateSP,
    postUpdateSP

} = require("../controllers/homeAdminQLSPController")

const {
    addToCart,
    getCartInfo

} = require("../controllers/addToCartController")

const router = express.Router();
//  -------------------------------------------

// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/", home)
router.get("/home", getHomePage)


// ctiet SP
router.get("/ctsp", chiTietSP)
// search san pham
// form tim kiem 
router.get("/search-sp", trangSanPham)
// router.get("/search-sp", trangSanPham_search)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/search-sp", homeSearch)


// form login/dk KH
router.get("/loginKH", homeLoginKH)
// dang ky tk kh
router.post("/dang-ky", dangKyKH)
// dang nhap tk kh
router.post("/dang-nhap", dangNhapKH)
// dang xuat tk
router.get("/dang-xuat-kh", getLogoutKH)


// form login/dk Admin
router.get("/loginAdmin", homeLoginAdmin)
// dang ky tk kh
router.post("/dang-ky-admin", dangKyAdmin)
// dang nhap tk kh
router.post("/dang-nhap-admin", dangNhapAdmin)
// dang xuat tk
router.get("/dang-xuat-admin", getLogoutAdmin)


// get home admin
router.get("/gethomeAdmin", getHomeAdmin)


// qlsp
router.get("/home-qlsp", getHomeQLSP)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/home-qlsp", getHomePhanTrang)
// form search qlsp
router.get("/searchQlsp", getSearchQLSP)
// khi bấm vào trang khác thì chuyển hướng sao cho đúng logic ...
router.get("/searchQlsp", gethomeSearchQLSP)


// xoa san pham
router.post("/delete-sp", removeSP)


// hien thi form create sp
router.get("/create-sp", hienThiFormCreateSP)
// insert san pham
router.post("/create-sp", postCreateSP)


// hien thi form update sp
router.get("/update-sp", hienThiFormUpdateSP)
// update san pham
router.post("/update-sp", postUpdateSP)


// them sp vao gio hang
router.post("/addtocart", addToCart)
// Lấy thông tin giỏ hàng (tổng số lượng và tổng tiền)
router.get('/cart-info', getCartInfo);


module.exports = router;

