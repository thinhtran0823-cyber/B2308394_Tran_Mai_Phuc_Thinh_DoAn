const SachService = require("../services/sach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// [POST] Thêm một cuốn sách mới
exports.create = async (req, res, next) => {
    if (!req.body?.ten_sach) {
        return next(new ApiError(400, "Tên sách không được để trống"));
    }
    try {
        const sachService = new SachService(MongoDB.client);
        const document = await sachService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi tạo sách"));
    }
};

// [GET] Lấy danh sách tất cả các cuốn sách (hoặc tìm theo tên)
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const sachService = new SachService(MongoDB.client);
        const { ten_sach } = req.query;
        if (ten_sach) {
            documents = await sachService.find({
                ten_sach: { $regex: new RegExp(ten_sach), $options: "i" },
            });
        } else {
            documents = await sachService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi truy xuất danh sách Sách"));
    }
    return res.send(documents);
};

// [GET] Lấy chi tiết 1 cuốn sách theo ID
exports.findOne = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const document = await sachService.findById(req.params.id); // Bạn nhớ viết hàm findById trong service nhé
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy Sách"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi lấy thông tin sách với id=${req.params.id}`));
    }
};

// [PUT] Cập nhật thông tin sách theo ID
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }
    try {
        const sachService = new SachService(MongoDB.client);
        const document = await sachService.update(req.params.id, req.body); // Bạn nhớ viết hàm update trong service
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy Sách"));
        }
        return res.send({ message: "Sách đã được cập nhật thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật sách với id=${req.params.id}`));
    }
};

// [DELETE] Xóa 1 cuốn sách
exports.delete = async (req, res, next) => {
    try {
        const sachService = new SachService(MongoDB.client);
        const document = await sachService.delete(req.params.id); // Bạn nhớ viết hàm delete trong service
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy Sách"));
        }
        return res.send({ message: "Sách đã được xóa thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi xóa sách với id=${req.params.id}`));
    }
};