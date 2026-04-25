const NhaXuatBanService = require("../services/nhaxuatban.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// [POST] Thêm một nhà xuất bản mới
exports.create = async (req, res, next) => {
    if (!req.body?.ten_nxb) {
        return next(new ApiError(400, "Tên nhà xuất bản không được để trống"));
    }
    try {
        const nxbService = new NhaXuatBanService(MongoDB.client);
        const document = await nxbService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi tạo nhà xuất bản"));
    }
};

// [GET] Lấy danh sách tất cả nhà xuất bản (hoặc tìm theo tên)
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const nxbService = new NhaXuatBanService(MongoDB.client);
        const { ten_nxb } = req.query;
        if (ten_nxb) {
            documents = await nxbService.find({
                ten_nxb: { $regex: new RegExp(ten_nxb), $options: "i" },
            });
        } else {
            documents = await nxbService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi truy xuất danh sách Nhà xuất bản"));
    }
    return res.send(documents);
};

// [GET] Lấy chi tiết 1 nhà xuất bản theo ID
exports.findOne = async (req, res, next) => {
    try {
        const nxbService = new NhaXuatBanService(MongoDB.client);
        // Lưu ý: Bạn cần viết hàm findById trong file nhaxuatban.service.js giống như file contact mẫu
        const document = await nxbService.findById(req.params.id); 
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy Nhà xuất bản"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi lấy thông tin NXB với id=${req.params.id}`));
    }
};

// [PUT] Cập nhật thông tin nhà xuất bản theo ID
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }
    try {
        const nxbService = new NhaXuatBanService(MongoDB.client);
        // Lưu ý: Bạn cần viết hàm update trong file nhaxuatban.service.js
        const document = await nxbService.update(req.params.id, req.body); 
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy Nhà xuất bản"));
        }
        return res.send({ message: "Nhà xuất bản đã được cập nhật thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật NXB với id=${req.params.id}`));
    }
};

// [DELETE] Xóa 1 nhà xuất bản
exports.delete = async (req, res, next) => {
    try {
        const nxbService = new NhaXuatBanService(MongoDB.client);
        // Lưu ý: Bạn cần viết hàm delete trong file nhaxuatban.service.js
        const document = await nxbService.delete(req.params.id); 
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy Nhà xuất bản"));
        }
        return res.send({ message: "Nhà xuất bản đã được xóa thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi xóa NXB với id=${req.params.id}`));
    }
};