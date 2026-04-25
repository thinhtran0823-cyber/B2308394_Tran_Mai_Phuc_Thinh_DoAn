const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// [POST] Thêm một nhân viên mới
exports.create = async (req, res, next) => {
    // Kiểm tra ràng buộc: Tên nhân viên không được để trống
    if (!req.body?.ho_ten_nv) {
        return next(new ApiError(400, "Họ tên nhân viên không được để trống"));
    }
    try {
        const nhanvienService = new NhanVienService(MongoDB.client);
        const document = await nhanvienService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi tạo thông tin nhân viên"));
    }
};

// [GET] Lấy danh sách tất cả nhân viên (hoặc tìm theo tên)
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const nhanvienService = new NhanVienService(MongoDB.client);
        const { ho_ten_nv } = req.query;
        if (ho_ten_nv) {
            documents = await nhanvienService.find({
                ho_ten_nv: { $regex: new RegExp(ho_ten_nv), $options: "i" },
            });
        } else {
            documents = await nhanvienService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi truy xuất danh sách Nhân viên"));
    }
    return res.send(documents);
};

// [GET] Lấy chi tiết 1 nhân viên theo ID
exports.findOne = async (req, res, next) => {
    try {
        const nhanvienService = new NhanVienService(MongoDB.client);
        const document = await nhanvienService.findById(req.params.id); 
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy Nhân viên"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi lấy thông tin nhân viên với id=${req.params.id}`));
    }
};

// [PUT] Cập nhật thông tin nhân viên theo ID
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }
    try {
        const nhanvienService = new NhanVienService(MongoDB.client);
        const document = await nhanvienService.update(req.params.id, req.body); 
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy Nhân viên"));
        }
        return res.send({ message: "Thông tin nhân viên đã được cập nhật thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật nhân viên với id=${req.params.id}`));
    }
};

// [DELETE] Xóa 1 nhân viên
exports.delete = async (req, res, next) => {
    try {
        const nhanvienService = new NhanVienService(MongoDB.client);
        const document = await nhanvienService.delete(req.params.id); 
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy Nhân viên"));
        }
        return res.send({ message: "Nhân viên đã được xóa thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi xóa nhân viên với id=${req.params.id}`));
    }
};