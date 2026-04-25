<template>
    <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="text-info"><i class="fas fa-user-shield mr-2"></i>Quản Lý Nhân Viên</h4>
            <button class="btn btn-success" @click="openAddModal">
                <i class="fas fa-plus"></i> Thêm nhân viên
            </button>
        </div>

        <div class="card shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th>Họ tên</th>
                            <th>Chức vụ</th>
                            <th>Điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="nv in nhanviens" :key="nv._id">
                            <td>{{ nv.ho_ten_nv }}</td>
                            <td><span class="badge badge-info">{{ nv.chuc_vu }}</span></td>
                            <td>{{ nv.so_dien_thoai }}</td>
                            <td>{{ nv.dia_chi }}</td>
                            <td>
                                <button class="btn btn-sm btn-warning mr-2" @click="editNhanVien(nv)">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" @click="deleteNhanVien(nv._id)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="showModal" class="custom-modal">
            <div class="modal-content p-4 shadow-lg">
                <h5>{{ isEdit ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới' }}</h5>
                <form @submit.prevent="saveNhanVien">
                    <div class="form-group">
                        <label>Họ tên nhân viên</label>
                        <input type="text" class="form-control" v-model="currentNV.ho_ten_nv" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label>Số điện thoại</label>
                            <input type="text" class="form-control" v-model="currentNV.so_dien_thoai" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label>Chức vụ</label>
                            <input type="text" class="form-control" v-model="currentNV.chuc_vu" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Mật khẩu {{ isEdit ? '(Để trống nếu không đổi)' : '' }}</label>
                        <input type="password" class="form-control" v-model="currentNV.password" :required="!isEdit">
                    </div>
                    <div class="form-group">
                        <label>Địa chỉ</label>
                        <textarea class="form-control" v-model="currentNV.dia_chi"></textarea>
                    </div>
                    <div class="text-right">
                        <button type="button" class="btn btn-secondary mr-2" @click="showModal = false">Đóng</button>
                        <button type="submit" class="btn btn-primary">Lưu dữ liệu</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import NhanVienService from "@/services/nhanvien.service";

export default {
    data() {
        return {
            nhanviens: [],
            showModal: false,
            isEdit: false,
            currentNV: { ho_ten_nv: "", so_dien_thoai: "", chuc_vu: "", password: "", dia_chi: "" }
        };
    },
    methods: {
        async refreshList() {
            this.nhanviens = await NhanVienService.getAll();
        },
        openAddModal() {
            this.isEdit = false;
            this.currentNV = { ho_ten_nv: "", so_dien_thoai: "", chuc_vu: "", password: "", dia_chi: "" };
            this.showModal = true;
        },
        editNhanVien(nv) {
            this.isEdit = true;
            this.currentNV = { ...nv, password: "" }; // Không hiện mật khẩu cũ
            this.showModal = true;
        },
        async saveNhanVien() {
            try {
                if (this.isEdit) {
                    await NhanVienService.update(this.currentNV._id, this.currentNV);
                } else {
                    await NhanVienService.create(this.currentNV);
                }
                alert("Thao tác thành công!");
                this.showModal = false;
                this.refreshList();
            } catch (error) { 
                console.log(error); // In ra console để sử dụng biến error
                alert("Lỗi khi lưu dữ liệu!");
             }
        },
        async deleteNhanVien(id) {
            if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
                await NhanVienService.delete(id);
                this.refreshList();
            }
        }
    },
    mounted() { this.refreshList(); }
};
</script>

<style scoped>
.custom-modal {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 9999;
}
.modal-content { background: white; width: 500px; border-radius: 10px; }
</style>