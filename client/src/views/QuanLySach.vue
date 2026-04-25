<template>
  <div class="container mt-4">
    <div class="row mb-4 align-items-center bg-light p-3 rounded shadow-sm">
      <div class="col-md-5">
        <h3 class="text-primary font-weight-bold mb-0">
          <i class="fas fa-book-open mr-2"></i> Quản Lý Kho Sách
        </h3>
      </div>
      <div class="col-md-7">
        <div class="input-group">
          <input
            type="text"
            class="form-control border-primary"
            placeholder="Nhập tên cuốn sách bạn muốn tìm..."
            v-model="searchText"
          />
          <div class="input-group-append">
            <button class="btn btn-primary" type="button">
              <i class="fas fa-search"></i> Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <div>
          <button class="btn btn-outline-secondary shadow-sm mr-2" @click="refreshList()">
            <i class="fas fa-sync-alt"></i> Làm mới
          </button>
          <router-link :to="{ name: 'sach.add' }">
            <button class="btn btn-success shadow-sm">
              <i class="fas fa-plus-circle"></i> Thêm sách mới
            </button>
          </router-link>
        </div>
        <button class="btn btn-danger shadow-sm" @click="removeAllSachs">
          <i class="fas fa-trash-alt"></i> Xóa tất cả
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div v-if="filteredSachsCount > 0">
          <SachList :sachs="filteredSachs" v-model:activeIndex="activeIndex" />
        </div>
        <div v-else class="text-center mt-5 text-muted">
          <i class="fas fa-box-open fa-4x mb-3 text-warning"></i>
          <h5 class="font-weight-light">Chưa có cuốn sách nào hoặc không tìm thấy sách.</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SachList from "@/components/SachList.vue";
import SachService from "@/services/sach.service";

export default {
  components: {
    SachList,
  },
  data() {
    return {
      sachs: [],
      activeIndex: -1,
      searchText: "",
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
    },
  },
  computed: {
    // Chuyển các object sách thành chuỗi để tìm kiếm
    sachStrings() {
      return this.sachs.map((sach) => {
        const { ten_sach, tac_gia, nam_xuat_ban } = sach;
        return [ten_sach, tac_gia, nam_xuat_ban].join("");
      });
    },
    // Lọc sách theo từ khóa tìm kiếm
    filteredSachs() {
      if (!this.searchText) return this.sachs;
      const searchTextLower = this.searchText.toLowerCase();
      return this.sachs.filter((_sach, index) =>
        this.sachStrings[index].toLowerCase().includes(searchTextLower),
      );
    },

    filteredSachsCount() {
      return this.filteredSachs.length;
    },
  },
  methods: {
    async retrieveSachs() {
      try {
        this.sachs = await SachService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    refreshList() {
      this.retrieveSachs();
      this.searchText = "";
      this.activeIndex = -1;
    },
    async removeAllSachs() {
      if (confirm("Bạn có chắc muốn xóa TẤT CẢ sách trong thư viện không?")) {
        try {
          await SachService.deleteAll();
          this.refreshList();
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.container {
  max-width: 1100px;
}
.input-group .form-control:focus {
  box-shadow: none;
}
</style>
