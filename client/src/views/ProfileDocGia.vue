<template>
    <div class="profile-page">
        
        <div class="container mt-4" v-if="user">
            <div class="row">
                <div class="col-md-4">
                    <div :class="['card shadow card-member', rankClass]">
                        <div class="card-body text-white text-center">
                            <div class="rank-badge mb-2">{{ rankName }}</div>
                            <h3 class="mb-0">{{ user.ho_lot }} {{ user.ten }}</h3>
                            <p class="small mb-3">Thành viên từ: {{ formatDate(user.createdAt) || 'Nhiều năm' }}</p>
                            
                            <div class="d-flex justify-content-around bg-white text-dark rounded py-2 shadow-sm">
                                <div>
                                    <div class="font-weight-bold text-success">{{ user.diem_uy_tin || 0 }}</div>
                                    <div class="x-small">Uy Tín</div>
                                </div>
                                <div class="border-left"></div>
                                <div>
                                    <div class="font-weight-bold text-danger">{{ user.diem_phat || 0 }}</div>
                                    <div class="x-small">Điểm Phạt</div>
                                </div>
                            </div>

                            <div class="mt-3 text-left small">
                                <p class="mb-1"><i class="fas fa-phone mr-2"></i> {{ user.dien_thoai }}</p>
                                <p class="mb-1"><i class="fas fa-map-marker-alt mr-2"></i> {{ user.dia_chi }}</p>
                                <p class="mb-0">
                                    <i class="fas fa-info-circle mr-2"></i> 
                                    Trạng thái: <span class="badge badge-light text-dark">{{ user.trang_thai || 'Hoạt động' }}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="card mt-3 shadow-sm border-0">
                        <div class="card-body">
                            <h6 class="font-weight-bold text-secondary border-bottom pb-2">ĐẶC QUYỀN {{ rankName.toUpperCase() }}</h6>
                            <ul class="list-unstyled mb-0 mt-2" style="font-size: 0.9rem;">
                                <li class="mb-2"><i class="fas fa-check text-success mr-2"></i> Mượn tối đa: <strong>{{ privileges.maxSach }} cuốn</strong></li>
                                <li class="mb-2"><i class="fas fa-check text-success mr-2"></i> Thời gian giữ: <strong>{{ privileges.days }} ngày</strong></li>
                                <li v-if="privileges.discount" class="text-primary font-weight-bold">
                                    <i class="fas fa-star mr-2"></i> Giảm 50% phí đền bù
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="col-md-8">
                    <div class="card shadow-sm border-0 h-100">
                        <div class="card-header bg-white font-weight-bold py-3">
                            <i class="fas fa-history mr-2 text-primary"></i> Lịch Sử Mượn Sách
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="bg-light">
                                        <tr>
                                            <th>Sách</th>
                                            <th>Ngày mượn</th>
                                            <th>Hạn trả</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="phieu in lichSu" :key="phieu._id">
                                            <td>
                                                <div class="font-weight-bold">{{ phieu.chi_tiet_sach?.ten_sach || 'Sách không xác định' }}</div>
                                                <small class="text-muted">Mã: {{ phieu._id.slice(-6).toUpperCase() }}</small>
                                            </td>
                                            <td>{{ formatDate(phieu.ngay_muon) }}</td>
                                            <td>{{ formatDate(phieu.ngay_tra_du_kien) }}</td>
                                            <td>
                                                <span :class="badgeColor(phieu.trang_thai)">{{ phieu.trang_thai }}</span>
                                            </td>
                                        </tr>
                                        <tr v-if="lichSu.length === 0">
                                            <td colspan="4" class="text-center py-5 text-muted">
                                                <i class="fas fa-book-open fa-3x mb-3 text-light"></i><br>
                                                Bạn chưa mượn cuốn sách nào.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container mt-5 text-center" v-else>
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Đang tải...</span>
            </div>
            <p class="mt-2 text-muted">Đang tải thông tin hồ sơ của bạn...</p>
        </div>

    </div>
</template>

<script>
import TheoDoiMuonService from "@/services/theodoimuon.service";
import DocGiaService from "@/services/docgia.service";

export default {
    data() {
        return {
            user: null,
            lichSu: []
        };
    },
    computed: {
        rankName() {
            const diem = this.user?.diem_uy_tin || 0;
            if (diem >= 500) return "Hạng Vàng";
            if (diem >= 100) return "Hạng Bạc";
            return "Hạng Đồng";
        },
        rankClass() {
            const diem = this.user?.diem_uy_tin || 0;
            if (diem >= 500) return "bg-gold";
            if (diem >= 100) return "bg-silver";
            return "bg-bronze";
        },
        privileges() {
            const diem = this.user?.diem_uy_tin || 0;
            if (diem >= 500) return { maxSach: 10, days: 30, discount: true };
            if (diem >= 100) return { maxSach: 7, days: 14, discount: false };
            return { maxSach: 4, days: 7, discount: false };
        }
    },
    methods: {
        async retrieveUserData() {
            try {
                // Lấy thông tin user đăng nhập từ localStorage
                const storedData = localStorage.getItem("user");
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    // Dựa vào cấu trúc object trả về, ID thường nằm ở parsedData.user._id hoặc parsedData._id
                    const userId = parsedData.user ? parsedData.user._id : parsedData._id;
                    
                    if (userId) {
                        // Lấy dữ liệu mới nhất từ DB
                        this.user = await DocGiaService.get(userId);
                        // Lấy lịch sử mượn
                        this.lichSu = await TheoDoiMuonService.getByDocGia(userId);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải hồ sơ:", error);
                alert("Không thể tải thông tin hồ sơ. Vui lòng đăng nhập lại.");
            }
        },
        formatDate(date) {
            if (!date) return "";
            return new Date(date).toLocaleDateString("vi-VN");
        },
        badgeColor(status) {
            if (status === 'Chờ xác nhận') return 'badge badge-warning';
            if (status === 'Đang mượn') return 'badge badge-primary';
            if (status === 'Đã trả') return 'badge badge-success';
            return 'badge badge-danger';
        }
    },
    mounted() {
        this.retrieveUserData();
    }
};
</script>

<style scoped>
.profile-page { min-height: 80vh; }
.card-member { border: none; border-radius: 15px; overflow: hidden; }
.bg-bronze { background: linear-gradient(135deg, #a17fe0 0%, #5d26c1 100%); }
.bg-silver { background: linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%); }
.bg-gold { background: linear-gradient(135deg, #f1c40f 0%, #e67e22 100%); }

.rank-badge {
    display: inline-block; padding: 2px 12px; background: rgba(255,255,255,0.2);
    border-radius: 20px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase;
}
.x-small { font-size: 0.7rem; color: #666; }
</style>