const { ObjectId } = require("mongodb");

class TheoDoiMuonService {
    constructor(client) {
        this.TheoDoiMuon = client.db().collection("theodoimuonsach");
    }

    // Hàm chuẩn hóa dữ liệu trước khi lưu vào Database
    extractData(payload) {
        const theodoi = {
            // Chuyển chuỗi ID thành chuẩn ObjectId của MongoDB
            ma_doc_gia: ObjectId.isValid(payload.ma_doc_gia) ? new ObjectId(payload.ma_doc_gia) : payload.ma_doc_gia,
            ma_sach: ObjectId.isValid(payload.ma_sach) ? new ObjectId(payload.ma_sach) : payload.ma_sach,
            
            // Ngày mượn: Nếu không truyền lên thì lấy thời gian hiện tại
            ngay_muon: payload.ngay_muon ? new Date(payload.ngay_muon) : new Date(),
            
            // Ngày trả dự kiến: Mặc định cho mượn 14 ngày (14 * 24h * 60m * 60s * 1000ms)
            ngay_tra_du_kien: payload.ngay_tra_du_kien 
                ? new Date(payload.ngay_tra_du_kien) 
                : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                
            // Mới mượn thì chưa có ngày trả thực tế
            ngay_tra_thuc_te: payload.ngay_tra_thuc_te ? new Date(payload.ngay_tra_thuc_te) : null,
            
            // Luồng trạng thái: "Chờ xác nhận" -> "Đang mượn" -> "Đã trả" / "Đã hủy"
            trang_thai: payload.trang_thai || "Chờ xác nhận",
            
            ghi_chu: payload.ghi_chu || ""
        };

        // Dọn dẹp các trường undefined để khỏi rác database
        Object.keys(theodoi).forEach(
            (key) => theodoi[key] === undefined && delete theodoi[key]
        );
        return theodoi;
    }

    // 1. Tạo Phiếu Mượn Mới (Dành cho độc giả bấm đặt sách)
    async create(payload) {
        const theodoi = this.extractData(payload);
        const result = await this.TheoDoiMuon.insertOne(theodoi);
        return result;
    }

    // 2. Lấy danh sách phiếu mượn (Có thể lọc theo ID độc giả hoặc Trạng thái)
    async find(filter) {
        const cursor = await this.TheoDoiMuon.find(filter);
        return await cursor.toArray();
    }

    // 3. Cập nhật phiếu mượn (Dành cho Nhân viên duyệt mượn hoặc xác nhận trả)
    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        
        // Chỉ lấy những trường người dùng muốn cập nhật
        const updateDoc = {};
        if (payload.trang_thai) updateDoc.trang_thai = payload.trang_thai;
        if (payload.ghi_chu) updateDoc.ghi_chu = payload.ghi_chu;
        if (payload.ngay_tra_thuc_te) updateDoc.ngay_tra_thuc_te = new Date(payload.ngay_tra_thuc_te);
        if (payload.ngay_tra_du_kien) updateDoc.ngay_tra_du_kien = new Date(payload.ngay_tra_du_kien);

        const result = await this.TheoDoiMuon.findOneAndUpdate(
            filter,
            { $set: updateDoc },
            { returnDocument: "after" }
        );
        return result;
    }
    
    // 4. Tìm thông tin mượn kèm theo chi tiết Sách và Độc giả (Aggregate)
    // Sẽ rất hữu ích khi hiển thị lên giao diện cho nhân viên nhìn
    async findDetails(filter = {}) {
        const pipeline = [
            { $match: filter },
            {
                $lookup: {
                    from: "sach",
                    localField: "ma_sach",
                    foreignField: "_id",
                    as: "chi_tiet_sach"
                }
            },
            {
                $lookup: {
                    from: "docgia",
                    localField: "ma_doc_gia",
                    foreignField: "_id",
                    as: "chi_tiet_doc_gia"
                }
            },
            { $unwind: { path: "$chi_tiet_sach", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$chi_tiet_doc_gia", preserveNullAndEmptyArrays: true } }
        ];

        const cursor = await this.TheoDoiMuon.aggregate(pipeline);
        return await cursor.toArray();
    }
}

module.exports = TheoDoiMuonService;