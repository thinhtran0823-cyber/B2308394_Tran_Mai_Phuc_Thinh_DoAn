<template>
    <div class="container mt-4 mb-5 policy-page">
        <div class="text-center mb-5">
            <h2 class="font-weight-bold text-primary text-uppercase">Cẩm Nang Độc Giả</h2>
            <p class="text-muted text-lg">Khám phá các đặc quyền và chính sách hoạt động tại Thư viện PhutThin</p>
            <div class="underline mx-auto"></div>
        </div>

        <h4 class="mb-4 font-weight-bold"><i class="fas fa-crown text-warning mr-2"></i>1. Hệ Thống Cấp Bậc & Đặc Quyền</h4>
        <div class="row mb-5">
            <div class="col-md-4 mb-3">
                <div class="card h-100 border-0 shadow-sm rank-card bronze-card">
                    <div class="card-body text-center text-white">
                        <i class="fas fa-medal fa-3x mb-3 text-bronze"></i>
                        <h4 class="font-weight-bold text-uppercase text-bronze">Hạng Đồng</h4>
                        <p class="small opacity-75">(Dưới 100 điểm uy tín)</p>
                        <hr class="bg-white opacity-25">
                        <ul class="text-left list-unstyled mb-0">
                            <li class="mb-2"><i class="fas fa-check-circle mr-2"></i>Mượn tối đa: <strong>4 cuốn</strong></li>
                            <li class="mb-2"><i class="fas fa-check-circle mr-2"></i>Thời gian mượn: <strong>7 ngày</strong></li>
                            <li><i class="fas fa-check-circle mr-2"></i>Phí đền bù sách: <strong>100%</strong></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="col-md-4 mb-3">
                <div class="card h-100 border-0 shadow-sm rank-card silver-card">
                    <div class="card-body text-center text-white">
                        <i class="fas fa-medal fa-3x mb-3 text-silver"></i>
                        <h4 class="font-weight-bold text-uppercase text-silver">Hạng Bạc</h4>
                        <p class="small opacity-75">(Từ 100 - 499 điểm uy tín)</p>
                        <hr class="bg-white opacity-25">
                        <ul class="text-left list-unstyled mb-0">
                            <li class="mb-2"><i class="fas fa-check-circle mr-2"></i>Mượn tối đa: <strong>7 cuốn</strong></li>
                            <li class="mb-2"><i class="fas fa-check-circle mr-2"></i>Thời gian mượn: <strong>14 ngày</strong></li>
                            <li><i class="fas fa-check-circle mr-2"></i>Phí đền bù sách: <strong>100%</strong></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="col-md-4 mb-3">
                <div class="card h-100 border-0 shadow-sm rank-card gold-card">
                    <div class="card-body text-center text-white">
                        <i class="fas fa-medal fa-3x mb-3 text-gold"></i>
                        <h4 class="font-weight-bold text-uppercase text-gold">Hạng Vàng</h4>
                        <p class="small opacity-75">(Từ 500 điểm uy tín trở lên)</p>
                        <hr class="bg-white opacity-25">
                        <ul class="text-left list-unstyled mb-0">
                            <li class="mb-2"><i class="fas fa-check-circle mr-2"></i>Mượn tối đa: <strong>10 cuốn</strong></li>
                            <li class="mb-2"><i class="fas fa-check-circle mr-2"></i>Thời gian mượn: <strong>30 ngày</strong></li>
                            <li class="text-warning font-weight-bold"><i class="fas fa-star mr-2"></i>Giảm 50% phí đền bù sách</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <h4 class="mb-4 font-weight-bold"><i class="fas fa-balance-scale text-info mr-2"></i>2. Chính Sách Điểm Uy Tín & Kỷ Luật</h4>
        <div class="row">
            <div class="col-lg-6 mb-4">
                <div class="card border-0 shadow-sm h-100 border-left-success">
                    <div class="card-header bg-white font-weight-bold text-success border-0 pt-4 pb-0">
                        <h5 class="mb-0"><i class="fas fa-arrow-up mr-2"></i>Cách Tích Lũy Điểm Uy Tín</h5>
                    </div>
                    <div class="card-body">
                        <p class="text-muted small mb-3">Điểm uy tín giúp bạn nâng hạng thẻ và hưởng nhiều đặc quyền hơn. Bạn sẽ được cộng điểm khi:</p>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item px-0 d-flex justify-content-between align-items-center border-bottom-0">
                                <span><i class="fas fa-check text-success mr-2"></i>Trả sách đúng hạn & nguyên vẹn</span>
                                <span class="badge badge-success badge-pill px-3 py-2">+10 điểm</span>
                            </li>
                            </ul>
                    </div>
                </div>
            </div>

            <div class="col-lg-6 mb-4">
                <div class="card border-0 shadow-sm h-100 border-left-danger">
                    <div class="card-header bg-white font-weight-bold text-danger border-0 pt-4 pb-0">
                        <h5 class="mb-0"><i class="fas fa-arrow-down mr-2"></i>Các Lỗi Bị Phạt Điểm</h5>
                    </div>
                    <div class="card-body">
                        <p class="text-muted small mb-3">Hệ thống sẽ ghi nhận Điểm Phạt nếu bạn vi phạm các quy định sau:</p>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item px-0 d-flex justify-content-between align-items-center">
                                <span><i class="fas fa-times text-danger mr-2"></i>Đăng ký nhưng không đến lấy (Bom sách)</span>
                                <span class="badge badge-danger badge-pill px-3 py-2">-5 điểm</span>
                            </li>
                            <li class="list-group-item px-0 d-flex justify-content-between align-items-center">
                                <span><i class="fas fa-times text-danger mr-2"></i>Trả sách trễ hạn quy định</span>
                                <span class="badge badge-danger badge-pill px-3 py-2">-5 điểm</span>
                            </li>
                            <li class="list-group-item px-0 d-flex justify-content-between align-items-center border-bottom-0">
                                <span><i class="fas fa-times text-danger mr-2"></i>Làm rách, bẩn hoặc mất sách</span>
                                <span class="badge badge-danger badge-pill px-3 py-2">-10 điểm</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="alert alert-danger shadow-sm border-0 d-flex align-items-center mt-3 p-4 rounded-lg" role="alert">
            <i class="fas fa-exclamation-triangle fa-3x mr-4 opacity-75"></i>
            <div>
                <h5 class="alert-heading font-weight-bold mb-1">Cảnh báo khóa tài khoản vĩnh viễn!</h5>
                <p class="mb-0">
                    Nếu tổng <strong>Điểm Phạt</strong> của bạn chạm mốc <strong>10 điểm</strong>, hệ thống sẽ tự động chuyển trạng thái thẻ sang <strong><span class="badge badge-danger">Bị Khóa</span></strong>. Bạn sẽ không thể tiếp tục mượn sách cho đến khi liên hệ với ban quản lý thư viện để nộp phạt và mở khóa thẻ.
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.policy-page {
    line-height: 1.6;
}
.underline {
    width: 80px;
    height: 4px;
    background: #4e73df;
    border-radius: 2px;
    margin-top: 10px;
}
.rank-card {
    transition: transform 0.3s ease;
    border-radius: 15px;
}
.rank-card:hover {
    transform: translateY(-10px);
}
/* Màu nền cho các thẻ Hạng */
.bronze-card { background: linear-gradient(135deg, #4a4a4a 0%, #2b2b2b 100%); }
.silver-card { background: linear-gradient(135deg, #757f9a 0%, #d7dde8 100%); color: #333 !important;}
.silver-card .text-white { color: #2c3e50 !important; }
.silver-card .bg-white { background-color: #2c3e50 !important; }
.gold-card { background: linear-gradient(135deg, #2c3e50 0%, #000000 100%); }

/* Màu chữ cho huy chương */
.text-bronze { color: #cd7f32; }
.text-silver { color: #333; }
.text-gold { color: #f1c40f; }

/* Viền thẻ điểm */
.border-left-success { border-left: 5px solid #1cc88a !important; }
.border-left-danger { border-left: 5px solid #e74a3b !important; }

.opacity-75 { opacity: 0.75; }
.opacity-25 { opacity: 0.25; }
</style>