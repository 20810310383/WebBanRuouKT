const express = require('express');
const {
    postCreateSP,
    trangSanPham

} = require("../controllers/homeAPIController")

const {
    dangKyKH,

} = require("../controllers/loginKHController")

const router = express.Router();
//  -------------------------------------------

router.post("/create", postCreateSP)
router.get("/trangSP", trangSanPham)

router.post("/dangkyKH", dangKyKH)

module.exports = router;

