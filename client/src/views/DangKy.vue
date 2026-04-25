<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <div class="card shadow-lg border-0 rounded-lg">
                    <div class="card-header bg-primary text-white text-center py-3">
                        <h4 class="mb-0"><i class="fas fa-user-plus mr-2"></i>Đăng Ký Tài Khoản Độc Giả</h4>
                    </div>
                    <div class="card-body p-4">
                        <form @submit.prevent="submitRegister">
                            <div class="form-row">
                                <div class="form-group col-md-7">
                                    <label class="font-weight-bold">Họ lót</label>
                                    <input type="text" class="form-control" v-model="docgia.ho_lot" required placeholder="Nguyễn Văn">
                                </div>
                                <div class="form-group col-md-5">
                                    <label class="font-weight-bold">Tên</label>
                                    <input type="text" class="form-control" v-model="docgia.ten" required placeholder="A">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label class="font-weight-bold">Ngày sinh</label>
                                    <input type="date" class="form-control" v-model="docgia.ngay_sinh" required>
                                </div>
                                <div class="form-group col-md-6">
                                    <label class="font-weight-bold">Phái</label>
                                    <select class="form-control" v-model="docgia.phai" required>
                                        <option disabled value="">Chọn giới tính...</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label class="font-weight-bold">Số điện thoại (Tên đăng nhập)</label>
                                    <input type="tel" class="form-control" v-model="docgia.dien_thoai" required placeholder="09xxxxxxx" pattern="[0-9]{10,11}">
                                </div>
                                <div class="form-group col-md-6">
                                    <label class="font-weight-bold">Mật khẩu</label>
                                    <input type="password" class="form-control" v-model="docgia.password" required placeholder="Nhập mật khẩu...">
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="font-weight-bold">Địa chỉ</label>
                                <textarea class="form-control" v-model="docgia.dia_chi" rows="2" required placeholder="Nhập địa chỉ của bạn..."></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary btn-block btn-lg mt-4 shadow-sm">
                                Đăng ký ngay
                            </button>
                        </form>
                    </div>
                    <div class="card-footer text-center py-3">
                        <span class="text-muted">Đã có tài khoản?</span>
                        <router-link :to="{ name: 'dangnhap' }" class="text-primary font-weight-bold ml-1">Đăng nhập tại đây</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
    data() {
        return {
            docgia: {
                ho_lot: "",
                ten: "",
                ngay_sinh: "",
                phai: "",
                dia_chi: "",
                dien_thoai: "",
                password: ""
            }
        };
    },
    methods: {
        async submitRegister() {
            try {
                // Gọi API đăng ký
                const response = await AuthService.register(this.docgia);
                
                // Thông báo thành công
                alert(response.message || "Đăng ký tài khoản thành công!");
                
                // Chuyển hướng người dùng sang trang Đăng nhập
                this.$router.push({ name: "dangnhap" });
                
            } catch (error) {
                console.log(error);
                alert("Đăng ký thất bại! Số điện thoại này có thể đã được sử dụng.");
            }
        }
    }
};
</script>

<style scoped>
.form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>