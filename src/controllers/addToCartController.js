const SanPham = require("../models/SanPham")
const TaiKhoan_Admin = require("../models/TaiKhoan_Admin")
const TaiKhoan_KH = require("../models/TaiKhoan_KH")
const TaiKhoan_NV = require("../models/TaiKhoan_NV")
const GioHang_SanPham = require("../models/GioHang_SanPham")
const Cart = require("../models/Cart")

require('rootpath')();

const {uploadSingleFile} = require('../services/fileService')

const aqp = require('api-query-params')

// --------------------------------------

module.exports = {
    addToCart1: async (req, res) => {
        try {
            const productId = req.query.productId;
            const quantity = parseInt(req.body.quantity);
                        
            // Kiểm tra sản phẩm có tồn tại không
            const product = await SanPham.findById(productId);
            
            
            if (isNaN(quantity) || isNaN(product.GiaBan)) {
                // return res.status(400).json({ message: 'Số lượng hoặc giá bán không hợp lệ' });
                console.log("soluong:", quantity, "--- giaban: ",product.GiaBan);
            }


            if (!product) {
                return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
            }
    
            // Kiểm tra giỏ hàng của khách hàng
            let cart = await GioHang_SanPham.findOne({ MaGH: req.session.cartId });

            if (!cart) {
                // Nếu giỏ hàng chưa tồn tại, tạo mới
                cart = new GioHang_SanPham({
                    MaGH: req.session.cartId,
                    SoLuong: 0,
                    TongTien: 0,
                    SanPham: []  // Thêm mảng để chứa thông tin sản phẩm trong giỏ hàng
                });
            }
            // Kiểm tra và khởi tạo SanPham là một mảng trống nếu nó là undefined
            cart.SanPham = cart.SanPham || [];

            // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
            const cartItemIndex = cart && cart.SanPham ? cart.SanPham.findIndex(item => item.MaSP.toString() === productId) : -1;

            if (cartItemIndex !== -1) {
                // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
                cart.SanPham[cartItemIndex].SoLuong += quantity;
                cart.SanPham[cartItemIndex].TongTien += quantity * product.GiaBan;
            } else {
                // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
                cart.SanPham.push({
                    MaSP: productId,
                    SoLuong: quantity,
                    TongTien: quantity * product.GiaBan
                });
            }
    
            // Cập nhật tổng số lượng và tổng tiền của giỏ hàng
            // cart.SoLuong = 0;
            // cart.TongTien = 0;
            // cart.SanPham.forEach(item => {
            //     cart.SoLuong += item.SoLuong;
            //     cart.TongTien += item.TongTien;
            // });

            // Update total quantity and total price in the cart
            cart.SoLuong = cart.SanPham.reduce((total, item) => total + item.SoLuong, 0);
            cart.TongTien = cart.SanPham.reduce((total, item) => total + item.TongTien, 0);
    
            // Lưu giỏ hàng vào CSDL
            await cart.save();
    
            res.status(200).json({ message: 'Sản phẩm đã được thêm vào giỏ hàng' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm vào giỏ hàng' });
        }
    },

    addToCart2: async (req, res) => {
        try {
            const productId = req.query.productId;
            const qtyy = parseInt(req.body.quantity);
            const qty = !isNaN(qtyy) && qtyy > 0 ? qtyy : 1;

            // Lấy thông tin đăng nhập của khách hàng từ request
            const customerAccountId = req.user ? req.user._id : null;

            // Kiểm tra xem sản phẩm có tồn tại không
            const product = await SanPham.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
            }
        
            // Kiểm tra xem giỏ hàng đã tồn tại chưa, nếu chưa thì tạo mới
            let cart = await Cart.findOne({ 'cart.MaTKKH': customerAccountId });
            if (!cart) {
                cart = new Cart({
                cart: {
                    items: [],
                    totalPrice: 0,
                    totalQuaty: 0,
                    MaTKKH: customerAccountId,
                },
                
                });
            }
        
            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const existingItem = cart.cart.items.find((item) =>
                item.productId.equals(productId)
            );
        
            if (existingItem) {
                // Nếu đã có sản phẩm trong giỏ hàng, cập nhật số lượng
                existingItem.qty += qty;
                // existingItem.totalPrice += qty * product.GiaBan;
            } else {
                // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
                cart.cart.items.push({
                    productId: product._id,
                    qty: qty,
                    //   totalPrice: qty * product.GiaBan
                });
            }
        
            // Cập nhật tổng số lượng và tổng tiền
            cart.cart.totalQuaty += qty;
            cart.cart.totalPrice += product.GiaBan * qty;
        
            // Lưu giỏ hàng vào cơ sở dữ liệu
            await cart.save();
        
            return res.status(200).json({ message: 'Đã thêm sản phẩm vào giỏ hàng' });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    },

    addToCart: async (req, res) => {
        try {
            const productId = req.query.productId;
            const qtyy = parseInt(req.body.quantity);
            const qty = !isNaN(qtyy) && qtyy > 0 ? qtyy : 1;
    
            // Lấy thông tin đăng nhập của khách hàng từ request
            const customerAccountId = req.user ? req.user._id : null;
    
            // Kiểm tra xem sản phẩm có tồn tại không
            const product = await SanPham.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
            }
    
            // Kiểm tra xem giỏ hàng đã tồn tại chưa, nếu chưa thì tạo mới
            let cart;
    
            // Nếu đăng nhập, sử dụng MaTKKH để liên kết với người dùng
            if (customerAccountId) {
                cart = await Cart.findOne({ 'cart.MaTKKH': customerAccountId });
                if (!cart) {
                    cart = new Cart({
                        cart: {
                            items: [],
                            totalPrice: 0,
                            totalQuaty: 0,
                        },
                        MaTKKH: customerAccountId,
                    });
                }
            } else {
                // Nếu không đăng nhập, kiểm tra xem có giỏ hàng trong session hay không
                if (req.session.cartId) {
                    // Nếu có giỏ hàng, lấy giỏ hàng từ cơ sở dữ liệu
                    cart = await Cart.findById(req.session.cartId);
                }
    
                // Nếu không có giỏ hàng trong session hoặc database, tạo giỏ hàng mới
                if (!cart) {
                    cart = new Cart({
                        cart: {
                            items: [],
                            totalPrice: 0,
                            totalQuaty: 0,
                        },
                        MaTKKH: null,
                    });
                }
            }
    
            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const existingItem = cart.cart.items.find((item) => item.productId.equals(productId));
    
            if (existingItem) {
                // Nếu đã có sản phẩm trong giỏ hàng, cập nhật số lượng
                existingItem.qty += qty;
            } else {
                // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
                cart.cart.items.push({
                    productId: product._id,
                    qty: qty,
                });
            }
    
            // Cập nhật tổng số lượng và tổng tiền
            cart.cart.totalQuaty += qty;
            cart.cart.totalPrice += product.GiaBan * qty;
    
            // Lưu giỏ hàng vào cơ sở dữ liệu hoặc session
            await cart.save();
    
            // Lưu cartId vào session nếu user không đăng nhập
            if (!customerAccountId) {
                req.session.cartId = cart._id;
            }
    
            return res.status(200).json({ message: 'Đã thêm sản phẩm vào giỏ hàng' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    },    

    // Lấy thông tin giỏ hàng (tổng số lượng và tổng tiền)
    getCartInfo: async (req, res) => {
        try {
            const cart = await Cart.findOne();
            if (!cart) {
                return res.status(200).json({ totalQuaty: 0, totalPrice: 0 });
            }

            // console.log("cart.cart.items[1]",cart.cart.items[1]);
        
            return res.status(200).json({
                totalQuaty: cart.cart.totalQuaty,
                totalPrice: cart.cart.totalPrice,
                // soLuong: cart.cart.items[1]
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    },

    getCTCart: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.taikhoan
        let loggedIn = sessions.loggedIn

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


        


        res.render("layouts/chiTietCart.ejs", {
            formatCurrency: formatCurrency, 
            rootPath: '/', 
            getRelativeImagePath: getRelativeImagePath,
            logIn: loggedIn, 
            taikhoan, 
        })
    },
}
