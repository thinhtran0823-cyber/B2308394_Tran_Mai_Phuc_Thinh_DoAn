const express = require("express");
const theodoimuon = require("../controllers/theodoimuon.controller");

const router = express.Router();

router.route("/")
    .get(theodoimuon.findAll)    // Phục vụ cho Nhân viên xem tất cả
    .post(theodoimuon.create);   // Phục vụ cho Độc giả tạo phiếu mới

// Đường dẫn riêng để lấy lịch sử mượn sách của 1 Độc giả cụ thể
router.route("/docgia/:id")
    .get(theodoimuon.findAllByDocGia);

router.route("/:id")
    .put(theodoimuon.update);    // Cập nhật trạng thái phiếu mượn

module.exports = router;