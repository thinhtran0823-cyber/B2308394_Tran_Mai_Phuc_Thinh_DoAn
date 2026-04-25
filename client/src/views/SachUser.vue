<template>
    <div class="container mt-4">
        <div class="header-section text-center mb-5">
            <h2 class="text-uppercase font-weight-bold text-primary">Thư Viện Sách PhutThin</h2>
            <p class="text-muted">Khám phá hàng ngàn cuốn sách hấp dẫn dành cho bạn</p>
            <div class="underline mx-auto"></div>
        </div>

        <div class="row mb-4 justify-content-center">
            <div class="col-md-6">
                <div class="input-group shadow-sm">
                    <input type="text" class="form-control border-0" v-model="searchText" placeholder="Tìm tên sách bạn muốn mượn...">
                    <div class="input-group-append">
                        <span class="input-group-text bg-white border-0"><i class="fas fa-search text-primary"></i></span>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-6 col-md-4 col-lg-3 mb-4" v-for="sach in filteredSachs" :key="sach._id">
                <div class="card h-100 border-0 shadow-sm book-card">
                    <div class="position-relative overflow-hidden">
                        <img :src="sach.hinh_anh || 'https://via.placeholder.com/200x300?text=No+Image'" 
                             class="card-img-top book-image" :alt="sach.ten_sach">
                        
                        <div class="status-badge" :class="sach.so_quyen > 0 ? 'bg-success' : 'bg-danger'">
                            {{ sach.so_quyen > 0 ? 'Còn sách' : 'Hết sách' }}
                        </div>
                    </div>
                    
                    <div class="card-body d-flex flex-column p-3">
                        <h6 class="card-title font-weight-bold text-dark text-truncate-2">{{ sach.ten_sach }}</h6>
                        <p class="card-text text-muted small mb-2">Giá: <span class="text-danger font-weight-bold">{{ formatPrice(sach.don_gia) }}đ</span></p>
                        
                        <div class="mt-auto">
                            <router-link :to="{ name: 'sach.detail', params: { id: sach._id } }" 
                                         class="btn btn-outline-primary btn-block btn-sm rounded-pill">
                                <i class="fas fa-info-circle mr-1"></i> Xem chi tiết
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="filteredSachs.length === 0" class="text-center mt-5">
            <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" style="width: 100px; opacity: 0.5;">
            <p class="mt-3 text-muted">Rất tiếc, không tìm thấy cuốn sách nào phù hợp!</p>
        </div>
    </div>
</template>

<script>
import SachService from "@/services/sach.service";

export default {
    data() {
        return {
            sachs: [],
            searchText: "",
        };
    },
    computed: {
        filteredSachs() {
            if (!this.searchText) return this.sachs;
            return this.sachs.filter(s => 
                s.ten_sach.toLowerCase().includes(this.searchText.toLowerCase())
            );
        }
    },
    methods: {
        async retrieveSachs() {
            try {
                this.sachs = await SachService.getAll();
            } catch (error) {
                console.log(error);
            }
        },
        formatPrice(value) {
            return new Intl.NumberFormat('vi-VN').format(value);
        }
    },
    mounted() {
        this.retrieveSachs();
    }
};
</script>

<style scoped>
.book-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 12px;
}
.book-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.12) !important;
}
.book-image {
    height: 280px;
    object-fit: cover;
    transition: transform 0.5s ease;
}
.book-card:hover .book-image {
    transform: scale(1.05);
}
.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 2.8rem;
}
.underline {
    width: 60px;
    height: 4px;
    background: #007bff;
    border-radius: 2px;
}
.status-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: bold;
}
.rounded-pill { border-radius: 50px; }
</style>