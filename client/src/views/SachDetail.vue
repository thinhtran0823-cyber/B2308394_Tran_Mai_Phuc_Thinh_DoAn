<template>
  <div v-if="sach" class="container mt-4">
    <div class="card shadow border-0">
      <div class="row no-gutters">
        <div class="col-md-4 bg-light d-flex align-items-center justify-content-center p-4">
          <img
            :src="sach.hinh_anh || 'https://via.placeholder.com/300x400?text=No+Image'"
            class="img-fluid rounded shadow-sm"
            alt="Book Cover"
          />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h2 class="card-title text-primary font-weight-bold">{{ sach.ten_sach }}</h2>
            <h5 class="text-muted mb-4">
              Tác giả: <span class="text-dark">{{ sach.tac_gia }}</span>
            </h5>

            <div class="row">
              <div class="col-sm-6">
                <p><strong>Đơn giá:</strong> {{ formatPrice(sach.don_gia) }} VNĐ</p>
                <p><strong>Số quyển:</strong> {{ sach.so_quyen }}</p>
                <p><strong>Năm xuất bản:</strong> {{ sach.nam_xuat_ban }}</p>
              </div>
              <div class="col-sm-6 border-left">
                <h6 class="text-info font-weight-bold">
                  <i class="fas fa-building"></i> Nhà Xuất Bản
                </h6>
                <div v-if="nxb">
                  <p class="mb-1"><strong>Tên:</strong> {{ nxb.ten_nxb }}</p>
                  <p class="mb-1"><strong>Địa chỉ:</strong> {{ nxb.dia_chi }}</p>
                </div>
                <p v-else class="text-muted">Đang tải thông tin NXB...</p>
              </div>
            </div>

            <hr />
            <div class="mt-4">
                <button class="btn btn-secondary mr-2" @click="$router.back()">Quay lại</button>

                <router-link 
                    v-if="isStaff" 
                    :to="{ name: 'sach.edit', params: { id: sach._id } }" 
                    class="btn btn-warning"
                >
                    <i class="fas fa-edit"></i> Hiệu chỉnh sách
                </router-link>

                
            </div>
            
            <div class="mt-4" v-if="sach">
                <button 
                    v-if="sach.so_quyen > 0" 
                    class="btn btn-success btn-lg shadow-sm" 
                    @click="dangKyMuonSach"
                >
                    <i class="fas fa-hand-holding-heart mr-2"></i> Đăng ký mượn sách
                </button>
                
                <div v-else class="alert alert-danger d-inline-block mt-2">
                    <i class="fas fa-times-circle mr-2"></i> Rất tiếc, cuốn sách này hiện đang tạm hết!
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SachService from "@/services/sach.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";
import TheoDoiMuonService from "@/services/theodoimuon.service";

export default {
  props: ["id"],
  data() {
    return {
      sach: null,
      nxb: null,
    };
  },
  computed: {
        isStaff() {
            const userStr = localStorage.getItem("user");
            if (!userStr) return false;
            const userData = JSON.parse(userStr);
            const role = (userData.role || "").toLowerCase();
            const chucVu = (userData.user?.chuc_vu || "").toLowerCase();
            
            const isAdmin = role === 'admin' || chucVu === 'admin' || chucVu === 'quản trị viên';
            const isNhanVien = role === 'nhanvien' || role === 'nhân viên' || !!userData.user?.ho_ten_nv;
            
            return isAdmin || isNhanVien;
        }
    },
  methods: {
    async fetchDetail() {
      try {
        // 1. Lấy thông tin sách
        this.sach = await SachService.get(this.id);
        // 2. Sau khi có sách, lấy thông tin NXB dựa trên ma_nxb trong sách
        if (this.sach.ma_nxb) {
          const allNXB = await NhaXuatBanService.getAll();
          this.nxb = allNXB.find((item) => item._id === this.sach.ma_nxb);
        }
      } catch (error) {
        console.log(error);
      }
    },
    formatPrice(value) {
      return value.toLocaleString();
    },
    async dangKyMuonSach() {
            // 1. Kiểm tra đăng nhập
            const userStr = localStorage.getItem("user");
            if (!userStr) {
                alert("Bạn cần đăng nhập để thực hiện chức năng này!");
                // Điều hướng sang trang đăng nhập, đồng thời có thể lưu lại trang hiện tại để quay về sau khi đăng nhập (tùy chọn)
                this.$router.push({ name: "dangnhap" });
                return;
            }

            const userData = JSON.parse(userStr);

            // 2. Chặn Admin/Nhân viên (Chỉ Độc giả mới có thuộc tính ho_lot)
            if (!userData.user.ho_lot) { 
                alert("Chức năng mượn sách chỉ dành riêng cho tài khoản Độc giả!");
                return;
            }

            // 3. Chuẩn bị dữ liệu gửi lên Backend
            // Ở trang Detail, dữ liệu cuốn sách đang xem được lưu trong biến this.sach
            const payload = {
                ma_doc_gia: userData.user._id,
                ma_sach: this.sach._id,
            };

            // 4. Gọi API
            try {
                if (confirm(`Bạn có chắc chắn muốn đăng ký mượn cuốn "${this.sach.ten_sach}" không?`)) {
                    await TheoDoiMuonService.create(payload);
                    alert("🎉 Đăng ký thành công! Vui lòng đến thư viện nhận sách trong vòng 48h.");
                    
                    // Tùy chọn: Chuyển hướng người dùng về trang chủ hoặc trang cá nhân sau khi mượn xong
                    this.$router.push({ name: "sach.user" }); 
                }
            } catch (error) {
                // ĐOẠN NÀY LÀ QUAN TRỌNG NHẤT ĐỂ HIỆN THÔNG BÁO TỪ BACKEND
                if (error.response && error.response.data && error.response.data.message) {
                    // Nếu Backend gửi kèm message (như lỗi 403, 400), hiện thẳng message đó
                    alert("Cảnh báo: " + error.response.data.message);
                } else {
                    // Nếu lỗi do mất mạng hoặc lỗi khác không có message
                    alert("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.");
                }
            }
        }
  },
  created() {
    this.fetchDetail();
  },
};
</script>

<style scoped>
.card {
  border-radius: 15px;
  overflow: hidden;
}
img {
  max-height: 450px;
  object-fit: cover;
}
</style>
