<template>
    <div class="container mt-4">
        <h4 class="mb-4 text-primary"><i class="fas fa-users mr-2"></i>Quản Lý Độc Giả</h4>
        
        <div class="card shadow-sm">
            <div class="card-body">
                <table class="table table-hover">
                    <thead class="thead-light">
                        <tr>
                            <th>STT</th>
                            <th>Họ lót</th>
                            <th>Tên</th>
                            <th>Ngày sinh</th>
                            <th>Phái</th>
                            <th>Điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(docgia, index) in docgias" :key="docgia._id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ docgia.ho_lot }}</td>
                            <td>{{ docgia.ten }}</td>
                            <td>{{ formatDate(docgia.ngay_sinh) }}</td>
                            <td>{{ docgia.phai }}</td>
                            <td>{{ docgia.dien_thoai }}</td>
                            <td>{{ docgia.dia_chi }}</td>
                            <td>
                                <button class="btn btn-sm btn-warning" @click="editDocGia(docgia)">
                                    <i class="fas fa-edit"></i> Cập nhật
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="selectedDocGia" class="modal-backdrop">
            <div class="modal-content p-4 shadow-lg">
                <h5 class="text-success mb-3">Cập nhật thông tin độc giả</h5>
                <form @submit.prevent="updateDocGia">
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label>Họ lót</label>
                            <input type="text" class="form-control" v-model="selectedDocGia.ho_lot" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label>Tên</label>
                            <input type="text" class="form-control" v-model="selectedDocGia.ten" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label>Ngày sinh</label>
                            <input type="date" class="form-control" v-model="selectedDocGia.ngay_sinh" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label>Phái</label>
                            <select class="form-control" v-model="selectedDocGia.phai">
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Địa chỉ</label>
                        <input type="text" class="form-control" v-model="selectedDocGia.dia_chi" required>
                    </div>
                    <div class="form-group">
                        <label>Điện thoại</label>
                        <input type="text" class="form-control" v-model="selectedDocGia.dien_thoai" required>
                    </div>
                    
                    <div class="text-right mt-3">
                        <button type="button" class="btn btn-secondary mr-2" @click="selectedDocGia = null">Hủy</button>
                        <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import DocGiaService from "@/services/docgia.service";

export default {
    data() {
        return {
            docgias: [],
            selectedDocGia: null, // Lưu độc giả đang được chọn để sửa
        };
    },
    methods: {
        async refreshList() {
            try {
                this.docgias = await DocGiaService.getAll();
            } catch (error) {
                console.log(error);
            }
        },
        editDocGia(docgia) {
            // Tạo bản sao để tránh chỉnh sửa trực tiếp vào danh sách khi chưa nhấn Lưu
            this.selectedDocGia = { ...docgia };
        },
        async updateDocGia() {
            try {
                // Lưu ý: Chúng ta gửi data lên nhưng Backend (Service) đã được thiết lập 
                // chỉ cập nhật các trường thông tin cơ bản, không đụng đến password.
                await DocGiaService.update(this.selectedDocGia._id, this.selectedDocGia);
                alert("Cập nhật thông tin thành công!");
                this.selectedDocGia = null;
                this.refreshList();
            } catch (error) {
                console.log(error);
                alert("Có lỗi xảy ra khi cập nhật.");
            }
        },
        formatDate(dateStr) {
            if (!dateStr) return "";
            const date = new Date(dateStr);
            return date.toLocaleDateString("vi-VN");
        }
    },
    mounted() {
        this.refreshList();
    }
};
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex; justify-content: center; align-items: center;
    z-index: 1000;
}
.modal-content {
    background: white;
    width: 500px;
    border-radius: 8px;
}
</style>