<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-dark">
        <i class="fas fa-building text-primary mr-2"></i>Danh Sách Nhà Xuất Bản
      </h2>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-body p-0">
        <table class="table table-hover mb-0">
          <thead class="bg-light">
            <tr>
              <th class="pl-4">Tên Nhà Xuất Bản</th>
              <th>Địa chỉ</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="nxb in nhaxuatbans" :key="nxb._id">
              <td class="pl-4 font-weight-bold">{{ nxb.ten_nxb }}</td>
              <td>{{ nxb.dia_chi }}</td>
              <td class="text-center">
                <button class="btn btn-outline-primary btn-sm mr-2" @click="editNXB(nxb)">
                  <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-outline-danger btn-sm" @click="deleteNXB(nxb._id)">
                  <i class="fas fa-trash"></i> Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="text-center mt-4">
      <button class="btn btn-success btn-lg shadow" @click="showAddForm = true">
        <i class="fas fa-plus-circle mr-2"></i>Tạo Nhà Xuất Bản
      </button>
    </div>

    <NhaXuatBanForm
      v-if="showAddForm || editingNXB"
      :nxb="editingNXB || {}"
      @close="closeForm"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script>
import NhaXuatBanService from "@/services/nhaxuatban.service";
import NhaXuatBanForm from "@/components/NhaXuatBanForm.vue";

export default {
  components: { NhaXuatBanForm },
  data() {
    return {
      nhaxuatbans: [],
      showAddForm: false,
      editingNXB: null,
    };
  },
  methods: {
    async retrieveNXBs() {
      try {
        this.nhaxuatbans = await NhaXuatBanService.getAll();
      } catch (e) {
        console.log(e);
      }
    },
    async deleteNXB(id) {
      if (confirm("Xác nhận xóa nhà xuất bản này?")) {
        await NhaXuatBanService.delete(id);
        this.retrieveNXBs();
      }
    },
    editNXB(nxb) {
      this.editingNXB = nxb;
    },
    closeForm() {
      this.showAddForm = false;
      this.editingNXB = null;
    },
    async handleFormSubmit(data) {
      try {
        if (data._id) {
          await NhaXuatBanService.update(data._id, data);
          alert("Cập nhật thành công!");
        } else {
          await NhaXuatBanService.create(data);
          alert("Thêm mới thành công!");
        }
        this.closeForm();
        this.retrieveNXBs();
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.retrieveNXBs();
  },
};
</script>
