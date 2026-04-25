const DocGiaService = require("../services/docgia.service");
const NhanVienService = require("../services/nhanvien.service"); 
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const bcrypt = require("bcryptjs");

// Đăng ký cho Độc giả
exports.registerReader = async (req, res, next) => {
    try {
        const docGiaService = new DocGiaService(MongoDB.client);
        const document = await docGiaService.create(req.body);
        return res.send({ message: "Đăng ký tài khoản thành công!" });
    } catch (error) {
        return next(new ApiError(500, "Có lỗi xảy ra khi đăng ký"));
    }
};

// Đăng nhập tổng hợp
exports.login = async (req, res, next) => {
    const { dien_thoai, password } = req.body;

    try {
        // 1. Kiểm tra nếu là ADMIN (Gán cứng)
        if (dien_thoai === "admin123" && password === "12345") {
            return res.send({ 
                message: "Đăng nhập Admin thành công", 
                role: "admin",
                user: { ten: "Quản trị viên" } 
            });
        }

        // 2. Kiểm tra trong bảng Độc giả
        const docGiaService = new DocGiaService(MongoDB.client);
        const reader = await docGiaService.findByPhone(dien_thoai);
        
        if (reader) {
            const isMatch = await bcrypt.compare(password, reader.password);
            if (isMatch) {
                return res.send({ 
                    message: "Đăng nhập Độc giả thành công", 
                    role: "reader",
                    user: reader 
                });
            }
        }
        const nvService = new NhanVienService(MongoDB.client);
        const nv = await nvService.findByPhone(dien_thoai);
        
        if (nv) {
            const isMatch = await bcrypt.compare(password, nv.password);
            if (isMatch) {
                return res.send({ 
                    message: "Đăng nhập Nhân viên thành công", 
                    role: "staff", 
                    user: nv 
                });
            }
        }
        

        return next(new ApiError(401, "Số điện thoại hoặc mật khẩu không đúng"));
    } catch (error) {
        return next(new ApiError(500, "Lỗi đăng nhập hệ thống"));
    }
};