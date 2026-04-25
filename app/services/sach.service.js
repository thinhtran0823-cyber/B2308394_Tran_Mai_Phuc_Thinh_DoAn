const { ObjectId } = require("mongodb");

class SachService {
    constructor(client) {
       
        this.Sach = client.db().collection("sach");
    }

    extractSachData(payload) {
        const sach = {
            ten_sach: payload.ten_sach,
            don_gia: payload.don_gia,
            so_quyen: payload.so_quyen,
            nam_xuat_ban: payload.nam_xuat_ban,
            tac_gia: payload.tac_gia,
            hinh_anh: payload.hinh_anh,
            // Dòng ép kiểu cực kỳ quan trọng:
            ma_nxb: payload.ma_nxb && ObjectId.isValid(payload.ma_nxb) 
                    ? new ObjectId(payload.ma_nxb) 
                    : null,
        };

        // Dọn dẹp các trường không có dữ liệu
        Object.keys(sach).forEach(
            (key) => sach[key] === undefined && delete sach[key]
        );
        return sach;
    }
    async create(payload) {
        const sach = this.extractSachData(payload);
        const result = await this.Sach.insertOne(sach);
        return result;
    }

    async find(filter) {
        // Bắt buộc phải dùng aggregate và $lookup để JOIN bảng
        return await this.Sach.aggregate([
            { $match: filter },
            {
                $lookup: {
                    from: "nha_xuat_ban",       // Tên bảng muốn nối tới (phải viết đúng y hệt trong MongoDB Compass)
                    localField: "ma_nxb",       // Tên trường chứa khóa ngoại ở bảng Sách
                    foreignField: "_id",        // Khóa chính ở bảng Nhà Xuất Bản
                    as: "chi_tiet_nxb"          // Tên mảng dữ liệu sẽ hiện ra
                }
            }
        ]).toArray();
    }
    async findById(id) {
        // Đảm bảo chữ "this.Sach" được viết đúng giống như lúc bạn khai báo ở constructor
        return await this.Sach.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractSachData(payload); // Hàm này chúng ta đã thêm hinh_anh ở bước trước
        const result = await this.Sach.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }
}

module.exports = SachService;