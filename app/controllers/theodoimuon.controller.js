const TheoDoiMuonService = require("../services/theodoimuon.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const DocGiaService = require("../services/docgia.service");
const SachService = require("../services/sach.service");

// KHAI BÁO OBJECTID Ở TRÊN CÙNG
const { ObjectId } = require("mongodb");

// ==========================================
// 1. TẠO PHIẾU MƯỢN SÁCH
// ==========================================
exports.create = async (req, res, next) => {
    if (!req.body.ma_doc_gia || !req.body.ma_sach) {
        return next(new ApiError(400, "Thông tin không được để trống"));
    }
    try {
        const theodoiService = new TheoDoiMuonService(MongoDB.client);
        const docGiaService = new DocGiaService(MongoDB.client);
        const sachService = new SachService(MongoDB.client);
        
        const docGia = await docGiaService.findById(req.body.ma_doc_gia);
        if (!docGia) return next(new ApiError(404, "Không tìm thấy độc giả"));
        
        const sach = await sachService.findById(req.body.ma_sach);
        if (!sach) return res.status(404).json({ message: "Không tìm thấy sách." });
        if (sach.so_quyen < 1) return res.status(400).json({ message: "Sách đã hết." });
        
        if (docGia.trang_thai === "Bị Khóa" || (docGia.diem_phat && docGia.diem_phat >= 10)) {
            return res.status(403).json({ message: "Tài khoản đã bị khóa do điểm phạt cao." });
        }
        
        let maxSach = 4; let soNgayMuon = 7;
        const diemUyTin = docGia.diem_uy_tin || 0;
        if (diemUyTin >= 500) { maxSach = 10; soNgayMuon = 30; } 
        else if (diemUyTin >= 100) { maxSach = 7; soNgayMuon = 14; }

        const phieuDangMuon = await theodoiService.find({
            ma_doc_gia: new ObjectId(req.body.ma_doc_gia), 
            trang_thai: { $in: ["Chờ xác nhận", "Đang mượn"] }
        });

        if (phieuDangMuon && phieuDangMuon.length >= maxSach) {
            return res.status(400).json({ message: `Đã đạt giới hạn tối đa (${maxSach} cuốn).` });
        }

        req.body.ngay_tra_du_kien = new Date(Date.now() + soNgayMuon * 24 * 60 * 60 * 1000);
        await sachService.update(req.body.ma_sach, { so_quyen: sach.so_quyen - 1 });
        const document = await theodoiService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi tạo phiếu mượn"));
    }
};

// ==========================================
// 2. CẬP NHẬT TRẠNG THÁI (TRẢ SÁCH, HỦY, LÀM MẤT SÁCH)
// ==========================================
exports.update = async (req, res, next) => {
    try {
        const theodoiService = new TheoDoiMuonService(MongoDB.client);
        const docGiaService = new DocGiaService(MongoDB.client);
        const sachService = new SachService(MongoDB.client);

        const condition = { 
            _id: ObjectId.isValid(req.params.id) ? new ObjectId(req.params.id) : null 
        };
        const phieuCuResult = await theodoiService.find(condition);
        const phieuCu = Array.isArray(phieuCuResult) ? phieuCuResult[0] : phieuCuResult;
        
        if (!phieuCu) return next(new ApiError(404, "Không tìm thấy phiếu mượn"));

        // A. XỬ LÝ HOÀN KHO SÁCH (Chỉ hoàn kho nếu Đã trả sách)
        if (req.body.trang_thai === "Đã trả" && phieuCu.trang_thai !== "Đã trả") {
            const sach = await sachService.findById(phieuCu.ma_sach);
            if (sach) {
                await sachService.update(phieuCu.ma_sach, { so_quyen: sach.so_quyen + 1 });
            }
        }
        // Nếu là "Làm mất sách", code sẽ lướt qua đoạn này -> Kho không được cộng sách.

        // B. XỬ LÝ ĐIỂM UY TÍN / ĐIỂM PHẠT
        if ((req.body.trang_thai === "Đã trả" || req.body.trang_thai === "Làm mất sách") && req.body.diem_thay_doi) {
            const ma_doc_gia = phieuCu.ma_doc_gia.toString();
            const docGia = await docGiaService.findById(ma_doc_gia);
            
            if (docGia) {
                let diemUyTinMoi = docGia.diem_uy_tin || 0;
                let diemPhatMoi = docGia.diem_phat || 0;
                let trangThaiMoi = docGia.trang_thai || "Hoạt động";

                const diemThayDoi = parseInt(req.body.diem_thay_doi);
                
                if (diemThayDoi > 0) {
                    diemUyTinMoi += diemThayDoi; // Cộng điểm (Ví dụ: +10)
                } else {
                    diemPhatMoi += Math.abs(diemThayDoi); // Trừ điểm (Ví dụ: -5, -10)
                    
                    // Khóa thẻ lập tức nếu chọn "Làm mất sách" HOẶC tổng điểm phạt chạm mốc 10
                    if (req.body.trang_thai === "Làm mất sách" || diemPhatMoi >= 10) {
                        trangThaiMoi = "Bị Khóa";
                    }
                }

                await docGiaService.update(ma_doc_gia, {
                    diem_uy_tin: diemUyTinMoi,
                    diem_phat: diemPhatMoi,
                    trang_thai: trangThaiMoi
                });
            }
            delete req.body.diem_thay_doi; // Xóa để không lưu thừa vào bảng Phiếu mượn
        }

        const document = await theodoiService.update(req.params.id, req.body);
        return res.send({ message: "Cập nhật thành công" });
        
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, `Lỗi khi cập nhật phiếu`));
    }
};

// ==========================================
// 3. LẤY TOÀN BỘ DANH SÁCH (Cho Admin)
// ==========================================
exports.findAll = async (req, res, next) => {
    try {
        const theodoiService = new TheoDoiMuonService(MongoDB.client);
        const documents = await theodoiService.findDetails({});
        return res.send(documents);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi truy xuất danh sách"));
    }
};

// ==========================================
// 4. LẤY DANH SÁCH THEO ĐỘC GIẢ (Cho User)
// ==========================================
exports.findAllByDocGia = async (req, res, next) => {
    try {
        const theodoiService = new TheoDoiMuonService(MongoDB.client);
        const filter = { ma_doc_gia: new ObjectId(req.params.id) };
        const documents = await theodoiService.findDetails(filter);
        return res.send(documents);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi truy xuất lịch sử mượn"));
    }
};