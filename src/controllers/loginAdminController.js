const TaiKhoan_Admin = require("../models/TaiKhoan_Admin")
const aqp = require('api-query-params')

//  --------------------------------------------

module.exports = {
    homeLoginAdmin: (req, res) => {

        res.render("User_Admin/form_loginAdmin.ejs")
    },

    dangKyAdmin: async (req, res) => {
        try {
            let TenDangNhap = req.body.acc
            let MatKhau = req.body.passw
            let HoTen = req.body.hoten

            console.log("TenDangNhap: ", TenDangNhap);
            console.log("MatKhau: ", MatKhau);
            console.log("HoTen: ", HoTen);
        
            // Check if the username is already taken
            const kt = await TaiKhoan_Admin.findOne({ TenDangNhap:TenDangNhap });
            if (kt) {
                // return res.status(400).json({ message: 'Tài Khoản Đã Tồn Tại' });
                return res.status(400).json({ success: false, message: 'Tài Khoản Đã Tồn Tại' });
                // return res.status(400).send("Tài Khoản Đã Tồn Tại")
            }
        
            if (!MatKhau) {
                return res.status(400).json({ message: 'Invalid password' });
            }
        
            // Create a new user
            let newUser = await TaiKhoan_Admin.create({
                TenDangNhap,
                MatKhau,
                HoTen
            });
        
            return res.status(201).json({ success: true, message: 'Đăng ký tài khoản thành công' });
            // res.status(201).json({ message: 'Đăng ký tài khoản thành công' });
            // return res.status(200).json({                
            //     errCode: 0,
            //     data: newUser
            // })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false,message: 'Internal server error' });
        }        
    },

    dangNhapAdmin: async (req, res) => {
        try {
            let tk = req.body.tk
            let matkhau = req.body.matkhau
      
          // Check if the user exists
            const user = await TaiKhoan_Admin.findOne({ TenDangNhap: tk, MatKhau: matkhau });
            if (!user) {
                return res.status(401).send("sai tài khoản or mật khẩu.");
            }

            req.session.loggedIn = true
			req.session.tk = tk
            sessions=req.session;
            console.log("sessions:",sessions);
            // test
            req.session.ten = "tu mo";

            console.log("user: ", user);    
        
            // Create and sign a JWT token
            //   const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
        
            // return res.status(200).json({ success: true, message: 'Đăng nhập thành công' });
            res.redirect(`/gethomeAdmin`);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    getLogoutAdmin: (req, res) => {
        if (req.session.tk) {
            req.session.destroy();
        }
        // req.logout();
        res.redirect("/loginAdmin");
    },
}