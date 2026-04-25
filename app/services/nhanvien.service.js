const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class NhanVienService {
    constructor(client) {
        this.NhanVien = client.db().collection("nhanvien");
    }

    async extractData(payload) {
        const nv = {
            ho_ten_nv: payload.ho_ten_nv,
            password: payload.password,
            chuc_vu: payload.chuc_vu,
            dia_chi: payload.dia_chi,
            so_dien_thoai: payload.so_dien_thoai,
        };
        
        // Chỉ mã hóa mật khẩu nếu có dữ liệu password mới
        if (nv.password) {
            const salt = await bcrypt.genSalt(10);
            nv.password = await bcrypt.hash(nv.password, salt);
        } else {
            delete nv.password; // Không ghi đè mật khẩu cũ nếu để trống
        }

        Object.keys(nv).forEach(key => nv[key] === undefined && delete nv[key]);
        return nv;
    }

    async create(payload) {
        const nv = await this.extractData(payload);
        const result = await this.NhanVien.findOneAndUpdate(
            { so_dien_thoai: nv.so_dien_thoai },
            { $set: nv },
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.NhanVien.find(filter);
        return await cursor.toArray();
    }

    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = await this.extractData(payload);
        const result = await this.NhanVien.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.NhanVien.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    async findByPhone(phone) {
        return await this.NhanVien.findOne({ so_dien_thoai: phone });
    }
}

module.exports = NhanVienService;