<template>
    <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="text-primary"><i class="fas fa-clipboard-list mr-2"></i>Quản Lý Phiếu Mượn</h4>
            <button class="btn btn-success" @click="openCreateModal">
                <i class="fas fa-plus mr-1"></i> Tạo phiếu mượn (Tại quầy)
            </button>
                <button class="btn btn-outline-warning ml-2" @click="filterStatus = 'Chờ xác nhận'">
        <i class="fas fa-filter mr-1"></i> Đơn chờ duyệt
    </button>
    <button class="btn btn-link btn-sm" v-if="filterStatus !== 'Tất cả'" @click="filterStatus = 'Tất cả'">Xóa lọc</button>
        </div>

        <div class="card shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th>Mã Phiếu</th>
                            <th>Độc giả</th>
                            <th>Tên sách</th>
                            <th>Ngày mượn</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="phieu in filteredList" :key="phieu._id">
                            <td>{{ phieu._id.slice(-6).toUpperCase() }}</td>
                            <td>{{ phieu.chi_tiet_doc_gia?.ten || 'N/A' }}</td>
                            <td>
                                <span class="text-truncate d-inline-block" style="max-width: 200px;">
                                    {{ phieu.chi_tiet_sach?.ten_sach || 'N/A' }}
                                </span>
                            </td>
                            <td>{{ formatDated(phieu.ngay_muon) }}</td>
                            <td :class="{'text-danger font-weight-bold': isNearDueDate(phieu.ngay_tra_du_kien) && phieu.trang_thai === 'Đang mượn'}">
                                {{ formatDated(phieu.ngay_tra_du_kien) }}
                                <i v-if="isNearDueDate(phieu.ngay_tra_du_kien) && phieu.trang_thai === 'Đang mượn'" 
                                class="fas fa-exclamation-triangle ml-1" title="Sắp đến hạn hoặc quá hạn"></i>
                            </td>
                            <td>
                                <span :class="badgeColor(phieu.trang_thai)">{{ phieu.trang_thai }}</span>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-info" @click="openEditModal(phieu)">
                                    <i class="fas fa-eye"></i> Chi tiết / Xử lý
                                </button>
                            </td>
                        </tr>
                        <tr v-if="phieuMuons.length === 0">
                            <td colspan="6" class="text-center text-muted">Chưa có phiếu mượn nào</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="showEditModal" class="custom-modal">
            <div class="modal-content p-4 shadow-lg">
                <h5 class="text-info border-bottom pb-2 mb-3">Chi tiết phiếu mượn</h5>
                
                <div class="row mb-3 text-muted" style="font-size: 0.9rem;">
                    <div class="col-6">
                        <strong>Độc giả:</strong> {{ currentPhieu.chi_tiet_doc_gia?.ho_lot }} {{ currentPhieu.chi_tiet_doc_gia?.ten }} <br>
                        <strong>SĐT:</strong> {{ currentPhieu.chi_tiet_doc_gia?.dien_thoai }}
                    </div>
                    <div class="col-6">
                        <strong>Sách:</strong> {{ currentPhieu.chi_tiet_sach?.ten_sach }} <br>
                        <strong>Ngày mượn:</strong> {{ formatDate(currentPhieu.ngay_muon) }} <br>
                        <strong>Hạn trả:</strong> <span class="text-danger">{{ formatDate(currentPhieu.ngay_tra_du_kien) }}</span>
                    </div>
                </div>

                <form @submit.prevent="updatePhieu">
                    <div class="form-group">
                        <label class="font-weight-bold">Trạng thái đơn</label>
                        <select class="form-control" v-model="editData.trang_thai">
                            <option value="Chờ xác nhận">Chờ xác nhận</option>
                            <option value="Đang mượn">Duyệt - Đang mượn</option>
                            <option value="Đã trả">Đã trả sách</option>
                            <option value="Đã hủy">Hủy phiếu</option>
                            <option value="Làm mất sách">Làm mất sách (Trừ điểm + Khóa thẻ)</option>
                        </select>
                    </div>

                    <div v-if="editData.trang_thai === 'Đã trả'" class="form-group bg-light p-2 border rounded">
                        <label class="text-success font-weight-bold">Cập nhật điểm thành viên</label>
                        <select class="form-control mb-2" v-model="diemTuDong">
                            <option value="10">Trả đúng hạn, sách nguyên vẹn (+10 điểm)</option>
                            <option value="-5">Trả trễ hạn (-5 điểm)</option>
                            <option value="-10">Sách hư hỏng/Rách (-10 điểm)</option>
                            
                        </select>
                        <small class="text-muted">Hệ thống sẽ tự động cập nhật điểm cho độc giả này.</small>
                    </div>

                    <div class="form-group">
                        <label class="font-weight-bold">Ghi chú của nhân viên</label>
                        <textarea class="form-control" v-model="editData.ghi_chu" rows="2" placeholder="Ví dụ: Khách làm rách bìa, trễ 2 ngày..."></textarea>
                    </div>

                    <div class="text-right mt-3">
                        <button type="button" class="btn btn-secondary mr-2" @click="showEditModal = false">Đóng</button>
                        <button type="submit" class="btn btn-primary">Lưu cập nhật</button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="showCreateModal" class="custom-modal">
            <div class="modal-content p-4 shadow-lg" style="width: 600px;">
                <h5 class="text-success border-bottom pb-2 mb-3">Tạo phiếu mượn tại quầy</h5>
                
                <form @submit.prevent="createPhieu">
                    <div class="form-group position-relative">
                        <label class="font-weight-bold">Tìm Độc giả</label>
                        <input type="text" class="form-control" v-model="searchDocGia" @focus="focusDocGia = true" placeholder="Nhập tên hoặc số điện thoại...">
                        <ul v-if="focusDocGia && filteredDocGias.length" class="search-dropdown">
                            <li v-for="dg in filteredDocGias" :key="dg._id" @click="selectDocGia(dg)">
                                {{ dg.ho_lot }} {{ dg.ten }} - SĐT: {{ dg.dien_thoai }}
                            </li>
                        </ul>
                        
                        <div v-if="newData.docGiaSelected" class="mt-2">
                            <div v-if="newData.docGiaSelected.trang_thai === 'Bị Khóa' || newData.docGiaSelected.diem_phat >= 10" class="text-danger small font-weight-bold">
                                <i class="fas fa-exclamation-triangle"></i> Cảnh báo: Tài khoản này đang bị khóa do điểm phạt cao. Không thể tạo phiếu!
                            </div>
                            <div v-else class="text-success small">
                                <i class="fas fa-check-circle"></i> Đã chọn: {{ newData.docGiaSelected.ho_lot }} {{ newData.docGiaSelected.ten }} 
                                (Uy tín: <span class="font-weight-bold">{{ newData.docGiaSelected.diem_uy_tin || 0 }}</span>)
                            </div>
                        </div>
                    </div>

                    <div class="form-group position-relative">
                        <label class="font-weight-bold">Tìm Sách</label>
                        <input type="text" class="form-control" v-model="searchSach" @focus="focusSach = true" placeholder="Nhập tên sách...">
                        <ul v-if="focusSach && filteredSachs.length" class="search-dropdown">
                            <li v-for="sach in filteredSachs" :key="sach._id" @click="selectSach(sach)">
                                {{ sach.ten_sach }} (Còn: {{ sach.so_quyen }})
                            </li>
                        </ul>
                        <div v-if="newData.sachSelected" class="mt-1 text-success small">
                            <i class="fas fa-check-circle"></i> Đã chọn: {{ newData.sachSelected.ten_sach }}
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-6 form-group">
                            <label>Ngày mượn (Hôm nay)</label>
                            <input type="text" class="form-control" :value="formatDate(newData.ngay_muon)" disabled>
                        </div>
                        <div class="col-6 form-group">
                            <label>Hạn trả (+14 ngày)</label>
                            <input type="text" class="form-control" :value="formatDate(newData.ngay_tra_du_kien)" disabled>
                        </div>
                    </div>

                    <div class="text-right mt-3">
                        <button type="button" class="btn btn-secondary mr-2" @click="showCreateModal = false">Hủy</button>
                       <button type="submit" class="btn btn-success" 
                                :disabled="!newData.docGiaSelected || !newData.sachSelected || newData.docGiaSelected.trang_thai === 'Bị Khóa' || newData.docGiaSelected.diem_phat >= 10">
                            Tạo phiếu ngay
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import TheoDoiMuonService from "@/services/theodoimuon.service";
import SachService from "@/services/sach.service";
import DocGiaService from "@/services/docgia.service";

export default {
    data() {
        return {
            phieuMuons: [],
            
            // Dữ liệu cho Modal Edit
            showEditModal: false,
            currentPhieu: {},
            editData: { trang_thai: "", ghi_chu: "" },
            diemTuDong: "10",
            filterStatus: "Tất cả",
            // Dữ liệu cho Modal Create
            showCreateModal: false,
            listSach: [],
            listDocGia: [],
            searchSach: "",
            searchDocGia: "",
            focusSach: false,
            focusDocGia: false,
            newData: {
                docGiaSelected: null,
                sachSelected: null,
                ngay_muon: new Date(),
                ngay_tra_du_kien: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            }
        };
    },
    computed: {
        // Lọc danh sách Độc giả theo Text
        filteredDocGias() {
            if (!this.searchDocGia) return [];
            const query = this.searchDocGia.toLowerCase();
            return this.listDocGia.filter(dg => 
                (dg.ten && dg.ten.toLowerCase().includes(query)) || 
                (dg.dien_thoai && dg.dien_thoai.includes(query))
            );
        },
        // Lọc danh sách Sách theo Text
        filteredSachs() {
            if (!this.searchSach) return [];
            const query = this.searchSach.toLowerCase();
            return this.listSach.filter(s => 
                s.ten_sach && s.ten_sach.toLowerCase().includes(query) && s.so_quyen > 0
            );
        },
        filteredList() {
                if (this.filterStatus === "Tất cả") return this.phieuMuons;
                return this.phieuMuons.filter(p => p.trang_thai === this.filterStatus);
            }
        },
    methods: {
        formatDated(dateString) {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    },

    // 2. Hàm kiểm tra xem có "Gần ngày đến hạn" không (Ví dụ: Còn 2 ngày hoặc đã quá hạn)
    isNearDueDate(dueDateString) {
        if (!dueDateString) return false;
        
        const today = new Date();
        const dueDate = new Date(dueDateString);
        
        // Tính khoảng cách thời gian (miliseconds)
        const diffTime = dueDate - today;
        // Chuyển sang số ngày (1 ngày = 24*60*60*1000 ms)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Trả về true nếu: Đã quá hạn (diffDays < 0) HOẶC sắp đến hạn trong vòng 2 ngày (diffDays <= 2)
        return diffDays <= 2;
    }, 
        async refreshList() {
            try {
                this.phieuMuons = await TheoDoiMuonService.getAll();
                // Tải sẵn danh sách sách và độc giả để dùng cho thanh tìm kiếm
                this.listSach = await SachService.getAll();
                this.listDocGia = await DocGiaService.getAll();
            } catch (error) { console.log(error); }
        },
        
        // ---- CÁC HÀM XỬ LÝ FORMAT VÀ UI ----
        formatDate(dateStr) {
            if (!dateStr) return "";
            return new Date(dateStr).toLocaleDateString("vi-VN");
        },
        badgeColor(status) {
            if (status === 'Chờ xác nhận') return 'badge badge-warning';
            if (status === 'Đang mượn') return 'badge badge-primary';
            if (status === 'Đã trả') return 'badge badge-success';
            if (status === 'Đã hủy') return 'badge badge-danger';
            return 'badge badge-secondary';
        },

        // ---- CÁC HÀM CHO MODAL CẬP NHẬT ----
        openEditModal(phieu) {
            this.currentPhieu = phieu;
            this.editData = {
                trang_thai: phieu.trang_thai,
                ghi_chu: phieu.ghi_chu || ""
            };
            this.diemTuDong = "10";
            this.showEditModal = true;
        },
        async updatePhieu() {
            try {
                const payload = { ...this.editData };
                
                // Gửi kèm điểm thay đổi nếu là "Đã trả"
                if (payload.trang_thai === "Đã trả" && this.currentPhieu.trang_thai !== "Đã trả") {
                    payload.ngay_tra_thuc_te = new Date();
                    payload.diem_thay_doi = parseInt(this.diemTuDong); // Giá trị từ thẻ <select>
                }
                else if (payload.trang_thai === "Làm mất sách" && this.currentPhieu.trang_thai !== "Làm mất sách") {
                    payload.diem_thay_doi = -10; // Phạt thẳng 10 điểm
                }

                await TheoDoiMuonService.update(this.currentPhieu._id, payload);
                alert("Cập nhật phiếu mượn và Điểm thành viên thành công!");
                this.showEditModal = false;
                this.refreshList();
            } catch (error) { console.log(error); alert("Lỗi khi cập nhật!"); }
        },

        // ---- CÁC HÀM CHO MODAL TẠO MỚI TẠI QUẦY ----
        openCreateModal() {
            this.searchSach = "";
            this.searchDocGia = "";
            this.newData.sachSelected = null;
            this.newData.docGiaSelected = null;
            this.newData.ngay_muon = new Date();
            this.newData.ngay_tra_du_kien = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
            this.showCreateModal = true;
        },
        selectDocGia(dg) {
            this.newData.docGiaSelected = dg;
            this.searchDocGia = dg.ten; // Điền tên vào ô input
            this.focusDocGia = false; // Ẩn dropdown
        },
        selectSach(sach) {
            this.newData.sachSelected = sach;
            this.searchSach = sach.ten_sach;
            this.focusSach = false;
        },
        async createPhieu() {
            try {
                const payload = {
                    ma_doc_gia: this.newData.docGiaSelected._id,
                    ma_sach: this.newData.sachSelected._id,
                    trang_thai: "Đang mượn" 
                };
                await TheoDoiMuonService.create(payload);
                alert("Tạo phiếu mượn thành công!");
                this.showCreateModal = false;
                this.refreshList();
            } catch (error) { 
                // In ra thông báo lỗi chi tiết từ Backend (nếu có)
                if (error.response && error.response.data && error.response.data.message) {
                    alert("Từ chối: " + error.response.data.message);
                } else {
                    alert("Lỗi khi tạo phiếu!"); 
                }
            }
        }
    },
    mounted() {
        this.refreshList();
    }
};
</script>

<style scoped>
.custom-modal {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 9999;
}
.modal-content { background: white; width: 600px; border-radius: 10px; max-height: 90vh; overflow-y: auto; }

/* CSS cho thanh dropdown tìm kiếm */
.search-dropdown {
    position: absolute;
    top: 100%; left: 0; right: 0;
    background: white; border: 1px solid #ddd;
    border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    max-height: 200px; overflow-y: auto;
    list-style: none; padding: 0; margin: 0; z-index: 10;
}
.search-dropdown li {
    padding: 8px 12px; border-bottom: 1px solid #eee; cursor: pointer;
}
.search-dropdown li:hover { background: #f8f9fa; color: #007bff; }
</style> 