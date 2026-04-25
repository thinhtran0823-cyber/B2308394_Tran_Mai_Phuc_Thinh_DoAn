<template>
    <div class="container-fluid mt-4 mb-5 px-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="text-primary font-weight-bold mb-0">
                <i class="fas fa-chart-pie mr-2"></i>HỆ THỐNG BÁO CÁO CHIẾN LƯỢC
            </h3>
            <button class="btn btn-outline-primary btn-sm" @click="fetchAllData">
                <i class="fas fa-sync-alt"></i> Làm mới dữ liệu
            </button>
        </div>

        <div class="row mb-4">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-primary shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Tổng đầu sách</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ tongDauSach }}</div>
                            </div>
                            <div class="col-auto"><i class="fas fa-book fa-2x text-gray-300"></i></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-success shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Đang cho mượn</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ activeBorrows.length }}</div>
                            </div>
                            <div class="col-auto"><i class="fas fa-hand-holding-heart fa-2x text-gray-300"></i></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-warning shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Chờ xác nhận</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ pendingBorrows.length }}</div>
                            </div>
                            <div class="col-auto"><i class="fas fa-hourglass-half fa-2x text-gray-300"></i></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-danger shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">Quá hạn trả</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">{{ overdueBorrows.length }}</div>
                            </div>
                            <div class="col-auto"><i class="fas fa-calendar-times fa-2x text-gray-300"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-4">
            <div class="col-lg-8 mb-4 mb-lg-0">
                <div class="card shadow border-0 h-100">
                    <div class="card-header py-3 bg-white">
                        <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-chart-line mr-2"></i>Tần suất mượn sách theo tháng</h6>
                    </div>
                    <div class="card-body">
                        <div class="chart-area" style="height: 300px;">
                            <canvas id="monthlyChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card shadow border-0 h-100">
                    <div class="card-header py-3 bg-white">
                        <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-tasks mr-2"></i>Trạng thái Phiếu mượn</h6>
                    </div>
                    <div class="card-body d-flex justify-content-center">
                        <div class="chart-pie" style="height: 300px; width: 100%;">
                            <canvas id="statusPieChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-4">
            <div class="col-lg-8 mb-4 mb-lg-0">
                <div class="card shadow border-0 h-100">
                    <div class="card-header py-3 bg-white">
                        <h6 class="m-0 font-weight-bold text-success"><i class="fas fa-trophy mr-2 text-warning"></i>Top 5 Sách được mượn nhiều nhất</h6>
                    </div>
                    <div class="card-body">
                        <div class="chart-area" style="height: 300px;">
                            <canvas id="trendingBooksChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card shadow border-0 h-100">
                    <div class="card-header py-3 bg-white">
                        <h6 class="m-0 font-weight-bold text-success"><i class="fas fa-chart-pie mr-2"></i>Tỉ trọng Nhà xuất bản</h6>
                    </div>
                    <div class="card-body d-flex justify-content-center">
                        <div class="chart-pie" style="height: 300px; width: 100%;">
                            <canvas id="publisherChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-6 mb-4">
                <div class="card shadow border-0 h-100">
                    <div class="card-header py-3 bg-danger text-white rounded-top">
                        <h6 class="m-0 font-weight-bold"><i class="fas fa-warehouse mr-2"></i>Kho: Cần nhập thêm ngay</h6>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0 small">
                                <thead>
                                    <tr>
                                        <th>Tên sách</th>
                                        <th class="text-center">Tồn kho</th>
                                        <th>NXB</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="sach in sachSapHet" :key="sach._id">
                                        <td class="font-weight-bold">{{ sach.ten_sach }}</td>
                                        <td class="text-center"><span class="badge badge-pill badge-danger">{{ sach.so_quyen }}</span></td>
                                        <td>{{ getNxbName(sach.ma_nxb) }}</td>
                                    </tr>
                                    <tr v-if="sachSapHet.length === 0"><td colspan="3" class="text-center py-4 text-success"><i class="fas fa-check-circle mr-1"></i> Kho ổn định.</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-6 mb-4">
                <div class="card shadow border-0 h-100">
                    <div class="card-header py-3 bg-dark text-white rounded-top">
                        <h6 class="m-0 font-weight-bold"><i class="fas fa-user-clock mr-2"></i>Độc giả: Danh sách quá hạn</h6>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0 small">
                                <thead>
                                    <tr>
                                        <th>Tên Độc giả</th>
                                        <th>Sách mượn</th>
                                        <th>Hạn trả</th>
                                        <th class="text-center">Trễ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="phieu in overdueBorrows" :key="phieu._id">
                                        <td class="font-weight-bold">{{ phieu.chi_tiet_doc_gia?.ten || 'N/A' }}</td>
                                        <td class="text-truncate" style="max-width: 150px;">{{ phieu.chi_tiet_sach?.ten_sach || 'N/A' }}</td>
                                        <td class="text-danger">{{ formatDate(phieu.ngay_tra_du_kien) }}</td>
                                        <td class="text-center font-weight-bold text-danger">{{ calculateDaysOverdue(phieu.ngay_tra_du_kien) }} ngày</td>
                                    </tr>
                                    <tr v-if="overdueBorrows.length === 0"><td colspan="4" class="text-center py-4 text-success"><i class="fas fa-check-circle mr-1"></i> Chưa có độc giả quá hạn.</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';
import SachService from "@/services/sach.service";
import TheoDoiMuonService from "@/services/theodoimuon.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
    data() {
        return {
            danhSachSach: [],
            danhSachNXB: [],
            danhSachPhieu: [],
            charts: {
                line: null,
                pieStatus: null,
                barTrending: null,
                piePublisher: null
            } 
        };
    },
    computed: {
        tongDauSach() { return this.danhSachSach.length; },
        pendingBorrows() { return this.danhSachPhieu.filter(p => p.trang_thai === "Chờ xác nhận"); },
        activeBorrows() { return this.danhSachPhieu.filter(p => p.trang_thai === "Đang mượn"); },
        overdueBorrows() {
            const today = new Date();
            return this.danhSachPhieu.filter(p => 
                p.trang_thai === "Đang mượn" && new Date(p.ngay_tra_du_kien) < today
            );
        },
        sachSapHet() {
            return this.danhSachSach.filter(s => s.so_quyen <= 2).sort((a,b) => a.so_quyen - b.so_quyen);
        }
    },
    methods: {
        async fetchAllData() {
            try {
                const [sachs, nxbs, phieus] = await Promise.all([
                    SachService.getAll(),
                    NhaXuatBanService.getAll(),
                    TheoDoiMuonService.getAll()
                ]);
                this.danhSachSach = sachs;
                this.danhSachNXB = nxbs;
                this.danhSachPhieu = phieus;

                this.renderCharts();
            } catch (error) { console.error("Lỗi tải dữ liệu", error); }
        },
        renderCharts() {
            this.renderMonthlyLineChart();
            this.renderStatusPieChart();
            this.renderTrendingChart();
            this.renderPublisherChart();
        },
        renderMonthlyLineChart() {
            const ctx = document.getElementById('monthlyChart');
            const months = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
            const monthlyCounts = new Array(12).fill(0);
            
            this.danhSachPhieu.forEach(p => {
                const date = new Date(p.ngay_muon);
                if (date.getFullYear() === new Date().getFullYear()) {
                    monthlyCounts[date.getMonth()]++;
                }
            });

            if (this.charts.line) this.charts.line.destroy();
            this.charts.line = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [{
                        label: "Số lượt mượn",
                        data: monthlyCounts,
                        borderColor: "#4e73df",
                        backgroundColor: "rgba(78, 115, 223, 0.1)",
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: { maintainAspectRatio: false }
            });
        },
        renderStatusPieChart() {
            const ctx = document.getElementById('statusPieChart');
            const statusData = {
                "Chờ duyệt": this.pendingBorrows.length,
                "Đang mượn": this.activeBorrows.length - this.overdueBorrows.length,
                "Quá hạn": this.overdueBorrows.length,
                "Hoàn tất/Hủy": this.danhSachPhieu.filter(p => p.trang_thai === "Đã trả" || p.trang_thai === "Đã hủy").length
            };

            if (this.charts.pieStatus) this.charts.pieStatus.destroy();
            this.charts.pieStatus = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(statusData),
                    datasets: [{
                        data: Object.values(statusData),
                        backgroundColor: ['#f6c23e', '#4e73df', '#e74a3b', '#1cc88a'],
                        hoverBorderColor: "rgba(234, 236, 244, 1)",
                    }],
                },
                options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
            });
        },
        renderTrendingChart() {
            const countMap = {};
            this.danhSachPhieu.forEach(p => {
                if (p.trang_thai !== "Đã hủy" && p.ma_sach) {
                    countMap[p.ma_sach] = (countMap[p.ma_sach] || 0) + 1;
                }
            });

            const sortedBooks = Object.keys(countMap)
                .map(ma_sach => {
                    const sach = this.danhSachSach.find(s => s._id === ma_sach);
                    return {
                        ten_sach: sach ? sach.ten_sach : 'Sách không xác định',
                        luot_muon: countMap[ma_sach]
                    };
                })
                .sort((a, b) => b.luot_muon - a.luot_muon)
                .slice(0, 5);

            const labels = sortedBooks.map(b => b.ten_sach.length > 20 ? b.ten_sach.substring(0, 20) + '...' : b.ten_sach);
            const data = sortedBooks.map(b => b.luot_muon);

            const ctx = document.getElementById('trendingBooksChart');
            if (this.charts.barTrending) this.charts.barTrending.destroy();

            this.charts.barTrending = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Lượt mượn',
                        data: data,
                        backgroundColor: '#f6c23e',
                        borderRadius: 4
                    }]
                },
                options: { maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
            });
        },
        renderPublisherChart() {
            const nxbCount = {};
            this.danhSachSach.forEach(sach => {
                const nxb = this.danhSachNXB.find(n => n._id === sach.ma_nxb);
                const tenNxb = nxb ? nxb.ten_nxb : 'Khác';
                nxbCount[tenNxb] = (nxbCount[tenNxb] || 0) + 1;
            });

            const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
            const ctx = document.getElementById('publisherChart');
            if (this.charts.piePublisher) this.charts.piePublisher.destroy();

            this.charts.piePublisher = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(nxbCount),
                    datasets: [{
                        data: Object.values(nxbCount),
                        backgroundColor: colors.slice(0, Object.keys(nxbCount).length),
                    }]
                },
                options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
            });
        },
        getNxbName(id) {
            const nxb = this.danhSachNXB.find(n => n._id === id);
            return nxb ? nxb.ten_nxb : 'N/A';
        },
        formatDate(date) { return new Date(date).toLocaleDateString('vi-VN'); },
        calculateDaysOverdue(date) {
            const diff = new Date() - new Date(date);
            return Math.floor(diff / (1000 * 60 * 60 * 24));
        }
    },
    mounted() { this.fetchAllData(); }
};
</script>

<style scoped>
.border-left-primary { border-left: .25rem solid #4e73df!important; }
.border-left-success { border-left: .25rem solid #1cc88a!important; }
.border-left-warning { border-left: .25rem solid #f6c23e!important; }
.border-left-danger { border-left: .25rem solid #e74a3b!important; }
.text-xs { font-size: .7rem; }
.card { border-radius: 8px; }
</style>