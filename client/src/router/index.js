import { createWebHistory, createRouter } from "vue-router";
import QuanLySach from "@/views/QuanLySach.vue"

const routes = [
        {
        path: "/", // Trang chủ bây giờ là trang xem sách đẹp mắt
        name: "sach.user",
        component: () => import("@/views/SachUser.vue"),
    },
    {
        path: "/quan-ly-kho", // Trang bảng của nhân viên dời vào đây
        name: "quanlysach",
        component: () => import("@/views/QuanLySach.vue"),
        meta: { requiresStaff: true }
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/views/NotFound.vue"),
    },
    {
        path: "/sach/view/:id",
        name: "sach.detail",
        component: () => import("@/views/SachDetail.vue"),
        props: true
    },

    
    {
        path: "/dangky",
        name: "dangky",
        component: () => import("@/views/DangKy.vue"),
        meta: { requiresGuest: true } // Đã đăng nhập thì không cho vào lại trang này
    },
    {
        path: "/dangnhap",
        name: "dangnhap",
        component: () => import("@/views/DangNhap.vue"),
        meta: { requiresGuest: true }
    },

    
    {
        path: "/ho-so",
        name: "profile",
        component: () => import("@/views/ProfileDocGia.vue"),
        meta: { requiresAuth: true } // Phải đăng nhập mới được xem hồ sơ
    },

    
    {
        path: "/sach/add",
        name: "sach.add",
        component: () => import("@/views/SachAdd.vue"),
        meta: { requiresStaff: true }
    },
    {
        path: "/sach/:id",
        name: "sach.edit",
        component: () => import("@/views/SachEdit.vue"),
        props: true,
        meta: { requiresStaff: true }
    },
    {
        path: "/nhaxuatban",
        name: "nhaxuatban",
        component: () => import("@/views/NhaXuatBan.vue"),
        meta: { requiresStaff: true }
    },
    {
        path: "/docgia",
        name: "quanlydocgia",
        component: () => import("@/views/QuanLyDocGia.vue"),
        meta: { requiresStaff: true }
    },
    {
        path: "/quan-ly-muon-sach",
        name: "quanlymuonsach",
        component: () => import("@/views/QuanLyMuonSach.vue"),
        meta: { requiresStaff: true }
    },

    {
        path: "/nhanvien",
        name: "quanlynhanvien",
        component: () => import("@/views/QuanLyNhanVien.vue"),
        meta: { requiresAdmin: true } // CHỈ Admin mới được vào
    },
    {
    path: "/thong-ke",
    name: "thongkekhosach",
    component: () => import("@/views/ThongKeKhoSach.vue"),
    meta: { requiresStaff: true }
    },
    {
        path: "/chinh-sach",
        name: "chinhsach",
        component: () => import("@/views/ChinhSachDocGia.vue"),
        meta: { requiresAuth: true } // Yêu cầu đăng nhập mới xem được
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    // 1. Lấy thông tin user từ LocalStorage
    const userStr = localStorage.getItem("user");
    let currentUser = null;
    let userRole = "";

    if (userStr) {
        const userData = JSON.parse(userStr);
        currentUser = userData.user || userData;
        userRole = (userData.role || "").toLowerCase();
    }

    
    const chucVu = (currentUser?.chuc_vu || "").toLowerCase();
    const isAdmin = userRole === 'admin' || chucVu === 'admin' || chucVu === 'quản trị viên';
    const isNhanVien = !isAdmin && (userRole === 'nhanvien' || userRole === 'nhân viên' || !!currentUser?.ho_ten_nv);
    const isStaff = isAdmin || isNhanVien;

    
    if (to.meta.requiresGuest && currentUser) {
        return next({ name: "quanlysach" });
    }

    if (to.meta.requiresAuth && !currentUser) {
        alert("Vui lòng đăng nhập để xem thông tin này!");
        return next({ name: "dangnhap" });
    }

    if (to.meta.requiresStaff && !isStaff) {
        alert("Cảnh báo: Bạn không có quyền truy cập vào khu vực quản lý!");
        return next({ name: "quanlysach" }); 
    }

    if (to.meta.requiresAdmin && !isAdmin) {
        alert("Truy cập từ chối! Chỉ Quản trị viên (Admin) mới có quyền xem trang Quản lý Nhân viên.");
        return next({ name: "quanlysach" }); 
    }

    next();
});

export default router;