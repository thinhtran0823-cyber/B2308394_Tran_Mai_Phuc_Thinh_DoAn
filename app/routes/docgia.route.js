const express = require("express");
const docgia = require("../controllers/docgia.controller");

const router = express.Router();

// Nhóm các thao tác không cần ID (Tạo mới, Lấy danh sách)
router.route("/")
    .get(docgia.findAll)
    .post(docgia.create);

// Nhóm các thao tác cần ID cụ thể (Xem chi tiết, Sửa, Xóa)
router.route("/:id")
    .get(docgia.findOne)
    .put(docgia.update)
    .delete(docgia.delete);

module.exports = router;