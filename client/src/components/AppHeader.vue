<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <a href="/" class="navbar-brand">Tiệm sách Cần Thơ</a>
    
    <div class="mr-auto navbar-nav">
      <li class="nav-item">
        <router-link :to="{ name: 'sach.user' }" class="nav-link">
          Sách <i class="fas fa-book"></i>
        </router-link>
      </li>

      <template v-if="isAdmin || isNhanVien">
        <li class="nav-item">
        <router-link :to="{ name: 'quanlysach' }" class="nav-link">
          Quản lý Sách <i class="fas fa-book"></i>
        </router-link>
      </li>
        <li class="nav-item">
          <router-link :to="{ name: 'nhaxuatban' }" class="nav-link">
            Nhà xuất bản <i class="fas fa-building"></i>
          </router-link>
        </li>
        <li class="nav-item">
            <router-link :to="{ name: 'quanlydocgia' }" class="nav-link">
                Độc Giả <i class="fas fa-users"></i>
            </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'quanlymuonsach' }" class="nav-link">
              Mượn Trả <i class="fas fa-clipboard-check"></i>
          </router-link>
        </li>
        <li class="nav-item">
    <router-link :to="{ name: 'thongkekhosach' }" class="nav-link">
        Thống kê <i class="fas fa-chart-line"></i>
    </router-link>
</li>
      </template>

      <li class="nav-item" v-if="isAdmin">
          <router-link :to="{ name: 'quanlynhanvien' }" class="nav-link">
              Nhân viên <i class="fas fa-user-tie"></i>
          </router-link>
      </li>

      <li class="nav-item" v-if="isDocGia">
        
        <router-link :to="{ name: 'profile' }" class="nav-link text-white font-weight-bold">
            Thông tin cá nhân <i class="fas fa-user-circle"></i>
        </router-link>
      </li>
      <li class="nav-item" v-if="isDocGia">
      <router-link :to="{ name: 'chinhsach' }" class="nav-link">
                Chính sách <i class="fas fa-shield-alt"></i>
        </router-link>
        </li>
    </div>

    <div class="navbar-nav ml-auto">
        <template v-if="currentUser">
            <li class="nav-item d-flex align-items-center mr-3">
                <span class="text-warning font-weight-bold">
                    <i class="fas fa-user-circle mr-1"></i>
                    Xin chào, {{ displayName }}
                </span>
            </li>
            <li class="nav-item">
                <button @click="logout" class="btn btn-outline-danger btn-sm mt-1">
                    Đăng xuất <i class="fas fa-sign-out-alt"></i>
                </button>
            </li>
        </template>

        <template v-else>
            <li class="nav-item">
                <router-link :to="{ name: 'dangky' }" class="nav-link">Đăng ký</router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'dangnhap' }" class="nav-link">Đăng nhập</router-link>
            </li>
        </template>
    </div>
  </nav>
</template>

<script>
export default {
    data() {
        return {
            currentUser: null,
            userRole: "",
        };
    },
    computed: {
        // Tự động định dạng tên hiển thị
        displayName() {
            if (!this.currentUser) return "";
            
            if (this.currentUser.ho_ten_nv) {
                return this.currentUser.ho_ten_nv;
            }
            if (this.currentUser.ho_lot) {
                return `${this.currentUser.ho_lot} ${this.currentUser.ten}`;
            }
            
            return this.currentUser.ten;
        },

        // --- CÁC HÀM KIỂM TRA PHÂN QUYỀN ---
        isAdmin() {
            if (!this.currentUser) return false;
            // Xác định Admin dựa trên chuỗi userRole lưu trong localStorage
            // (Bạn có thể điều chỉnh lại chữ 'admin' cho khớp với Database của bạn)
            const role = this.userRole?.toLowerCase();
            const chucVu = this.currentUser.chuc_vu?.toLowerCase();
            return role === 'admin' || chucVu === 'admin' || chucVu === 'quản trị viên';
        },
        
        isNhanVien() {
            if (!this.currentUser) return false;
            // Admin thì không cần cộng dồn quyền của nhân viên ở đây (đã xử lý logic ở template)
            if (this.isAdmin) return false; 
            
            // Nhân viên thường có trường ho_ten_nv hoặc role là nhanvien
            const role = this.userRole?.toLowerCase();
            return role === 'nhanvien' || role === 'nhân viên' || !!this.currentUser.ho_ten_nv;
        },
        
        isDocGia() {
            if (!this.currentUser) return false;
            // Nếu không phải Admin và cũng không phải Nhân viên, thì chắc chắn là Độc giả
            return !this.isAdmin && !this.isNhanVien;
        }
    },
    methods: {
        checkLoginStatus() {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const userData = JSON.parse(userStr);
                this.currentUser = userData.user;
                this.userRole = userData.role || ""; // Lấy thêm role từ localStorage
            } else {
                this.currentUser = null;
                this.userRole = "";
            }
        },
        logout() {
            localStorage.removeItem("user");
            this.currentUser = null;
            this.userRole = "";
            this.$router.push({ name: "dangnhap" });
        }
    },
    mounted() {
        this.checkLoginStatus();
    },
    watch: {
        // Lắng nghe thay đổi đường dẫn để cập nhật lại menu nếu người dùng chuyển trang
        $route() {
            this.checkLoginStatus();
        }
    }
};
</script>

<style scoped>
.btn-outline-danger {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
}
</style>