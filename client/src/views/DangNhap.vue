<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-5">
                <div class="card shadow-lg border-0 rounded-lg mt-5">
                    <div class="card-header bg-success text-white text-center py-3">
                        <h4 class="mb-0"><i class="fas fa-sign-in-alt mr-2"></i>Đăng Nhập Hệ Thống</h4>
                    </div>
                    <div class="card-body p-4">
                        <form @submit.prevent="submitLogin">
                            <div class="form-group mb-3">
                                <label class="font-weight-bold">Tên đăng nhập (Số điện thoại)</label>
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-phone"></i></span>
                                    </div>
                                    <input type="text" class="form-control" v-model="loginData.dien_thoai" required placeholder="Nhập số điện thoại...">
                                </div>
                            </div>

                            <div class="form-group mb-4">
                                <label class="font-weight-bold">Mật khẩu</label>
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-lock"></i></span>
                                    </div>
                                    <input type="password" class="form-control" v-model="loginData.password" required placeholder="Nhập mật khẩu...">
                                </div>
                            </div>

                            <button type="submit" class="btn btn-success btn-block btn-lg shadow-sm">
                                Đăng Nhập
                            </button>
                        </form>
                    </div>
                    <div class="card-footer text-center py-3">
                        <span class="text-muted">Chưa có tài khoản?</span>
                        <router-link :to="{ name: 'dangky' }" class="text-success font-weight-bold ml-1">Đăng ký ngay</router-link>
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
            loginData: {
                dien_thoai: "",
                password: ""
            }
        };
    },
    methods: {
        async submitLogin() {
            try {
                // Gọi API đăng nhập
                const response = await AuthService.login(this.loginData);
                
                alert(response.message);
                
                // Tạm thời lưu thông tin người dùng vào LocalStorage để các trang khác biết là đã đăng nhập
                localStorage.setItem("user", JSON.stringify(response));
                
                // Đăng nhập thành công thì đẩy về trang chủ (Quản lý sách)
                this.$router.push({ name: "sach.user" });
                
            } catch (error) {
                console.log(error);
                alert("Sai số điện thoại hoặc mật khẩu!");
            }
        }
    }
};
</script>

<style scoped>
.input-group-text {
    background-color: #f8f9fa;
}
</style>