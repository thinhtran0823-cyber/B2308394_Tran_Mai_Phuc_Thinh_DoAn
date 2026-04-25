const DocGiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// [POST] Thêm một độc giả mới
exports.create = async (req, res, next) => {
    // Kiểm tra ràng buộc: Tên độc giả không được để trống
    if (!req.body?.ten) {
        return next(new ApiError(400, "Tên độc giả không được để trống"));
    }
    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const document = await docgiaService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi tạo thông tin độc giả"));
    }
};

// [GET] Lấy danh sách tất cả độc giả (hoặc tìm theo tên)
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const { ten } = req.query;
        if (ten) {
            // Tìm kiếm theo tên (không phân biệt hoa thường)
            documents = await docgiaService.find({
                ten: { $regex: new RegExp(ten), $options: "i" },
            });
        } else {
            documents = await docgiaService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi truy xuất danh sách Độc giả"));
    }
    return res.send(documents);
};

// [GET] Lấy chi tiết 1 độc giả theo ID
exports.findOne = async (req, res, next) => {
    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const document = await docgiaService.findById(req.params.id); 
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy Độc giả"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi lấy thông tin độc giả với id=${req.params.id}`));
    }
};

// [PUT] Cập nhật thông tin độc giả theo ID
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }
    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const document = await docgiaService.update(req.params.id, req.body); 
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy Độc giả"));
        }
        return res.send({ message: "Thông tin độc giả đã được cập nhật thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật độc giả với id=${req.params.id}`));
    }
};

// [DELETE] Xóa 1 độc giả
exports.delete = async (req, res, next) => {
    try {
        const docgiaService = new DocGiaService(MongoDB.client);
        const document = await docgiaService.delete(req.params.id); 
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy Độc giả"));
        }
        return res.send({ message: "Độc giả đã được xóa thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi xóa độc giả với id=${req.params.id}`));
    }
};

