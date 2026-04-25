const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class DocGiaService {
    constructor(client) {
        this.DocGia = client.db().collection("docgia");
    }

    extractDocGiaData(payload) {
        const docGia = {
            ho_lot: payload.ho_lot,
            ten: payload.ten,
            ngay_sinh: payload.ngay_sinh,
            phai: payload.phai,
            dia_chi: payload.dia_chi,
            dien_thoai: payload.dien_thoai, // Đây là tên đăng nhập
            password: payload.password, 
            diem_uy_tin: payload.diem_uy_tin !== undefined ? payload.diem_uy_tin : 0,
            diem_phat: payload.diem_phat !== undefined ? payload.diem_phat : 0,
            trang_thai: payload.trang_thai || "Hoạt động",
        };
        // Xóa các trường undefined
        Object.keys(docGia).forEach(
            (key) => docGia[key] === undefined && delete docGia[key]
        );
        return docGia;
    }

    async create(payload) {
        const docGia = this.extractDocGiaData(payload);
        // Mã hóa mật khẩu trước khi lưu
        const salt = await bcrypt.genSalt(10);
        docGia.password = await bcrypt.hash(docGia.password, salt);
        
        const result = await this.DocGia.findOneAndUpdate(
            { dien_thoai: docGia.dien_thoai }, // Tránh trùng số điện thoại
            { $set: docGia },
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async findByPhone(phone) {
        return await this.DocGia.findOne({ dien_thoai: phone });
    }
    async find(filter) {
        const cursor = await this.DocGia.find(filter);
        return await cursor.toArray();
    }
    async findById(id) {
        const { ObjectId } = require("mongodb");
        return await this.DocGia.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    async findAll() {
        return await this.DocGia.find({}).toArray();
    }

    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractDocGiaData(payload);
        // Nếu có cập nhật mật khẩu thì phải mã hóa lại
        if (update.password) {
            const salt = await bcrypt.genSalt(10);
            update.password = await bcrypt.hash(update.password, salt);
        }
        const result = await this.DocGia.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }
}

module.exports = DocGiaService;