const express = require("express");
const nxb = require("../controllers/nhaxuatban.controller");

const router = express.Router();

// Nhóm các thao tác không cần ID (Tạo mới, Lấy danh sách)
router.route("/")
    .get(nxb.findAll)
    .post(nxb.create);

// Nhóm các thao tác cần ID cụ thể (Xem chi tiết, Sửa, Xóa)
router.route("/:id")
    .get(nxb.findOne)
    .put(nxb.update)
    .delete(nxb.delete);

module.exports = router;