const express = require("express");
const nhanvien = require("../controllers/nhanvien.controller");

const router = express.Router();

// Nhóm các thao tác không cần ID (Tạo mới, Lấy danh sách)
router.route("/")
    .get(nhanvien.findAll)
    .post(nhanvien.create);

// Nhóm các thao tác cần ID cụ thể (Xem chi tiết, Sửa, Xóa)
router.route("/:id")
    .get(nhanvien.findOne)
    .put(nhanvien.update)
    .delete(nhanvien.delete);

module.exports = router;