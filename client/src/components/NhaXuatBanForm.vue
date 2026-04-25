<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h4 class="mb-4 text-primary">
        {{ nxb._id ? "Cập Nhật Nhà Xuất Bản" : "Thêm Nhà Xuất Bản Mới" }}
      </h4>
      <form @submit.prevent="submitForm">
        <div class="form-group mb-3 text-left">
          <label class="font-weight-bold">Tên nhà xuất bản:</label>
          <input
            type="text"
            class="form-control custom-input"
            v-model="nxbLocal.ten_nxb"
            required
            placeholder="Nhập tên NXB..."
          />
        </div>
        <div class="form-group mb-4 text-left">
          <label class="font-weight-bold">Địa chỉ:</label>
          <input
            type="text"
            class="form-control custom-input"
            v-model="nxbLocal.dia_chi"
            required
            placeholder="Nhập địa chỉ..."
          />
        </div>
        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-secondary mr-2" @click="$emit('close')">Hủy</button>
          <button type="submit" class="btn btn-primary shadow-sm">
            <i class="fas fa-save mr-1"></i> Lưu lại
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nxb: { type: Object, default: () => ({ ten_nxb: "", dia_chi: "" }) },
  },
  data() {
    return { nxbLocal: { ...this.nxb } };
  },
  methods: {
    submitForm() {
      this.$emit("submit", this.nxbLocal);
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px); /* Làm mờ mọi thứ xung quanh */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
.custom-input {
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 10px;
}
.custom-input:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
