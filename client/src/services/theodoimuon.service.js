import createApiClient from "./api.service";

class TheoDoiMuonService {
    constructor(baseUrl = "/api/theodoimuon") {
        this.api = createApiClient(baseUrl);
    }

    // Độc giả tạo phiếu mượn
    async create(data) {
        return (await this.api.post("/", data)).data;
    }

    // Lấy tất cả phiếu mượn (Cho Admin/Nhân viên)
    async getAll() {
        return (await this.api.get("/")).data;
    }

    // Lấy lịch sử mượn của 1 độc giả
    async getByDocGia(id) {
        return (await this.api.get(`/docgia/${id}`)).data;
    }

    // Cập nhật trạng thái phiếu mượn (Duyệt, Trả, Hủy)
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
}

export default new TheoDoiMuonService();