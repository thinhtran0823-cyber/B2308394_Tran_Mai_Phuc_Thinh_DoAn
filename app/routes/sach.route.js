const express = require("express");
const sach = require("../controllers/sach.controller");

const router = express.Router();

// Nhóm các thao tác không cần ID cụ thể (Tạo mới, Lấy danh sách)
router.route("/")
    .get(sach.findAll)
    .post(sach.create);

// Nhóm các thao tác tác động lên 1 ID cụ thể (Xem chi tiết, Sửa, Xóa)
router.route("/:id")
    .get(sach.findOne)
    .put(sach.update)
    .delete(sach.delete);

module.exports = router;