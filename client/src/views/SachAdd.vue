<template>
  <div class="page">
    <h4>Thêm Sách Mới</h4>
    <SachForm :sach="newSach" @submit:sach="addSach" />
    <p>{{ message }}</p>
  </div>
</template>

<script>
import SachForm from "@/components/SachForm.vue";
import SachService from "@/services/sach.service";

export default {
  components: { SachForm },
  data() {
    return {
      newSach: {
        ten_sach: "",
        tac_gia: "",
        don_gia: 0,
        so_quyen: 0,
        nam_xuat_ban: new Date().getFullYear(),
        ma_nxb: "",
      },
      message: "",
    };
  },
  methods: {
    async addSach(data) {
      try {
        await SachService.create(data);
        this.message = "Sách được thêm thành công!";
        this.$router.push({ name: "quanlysach" });
      } catch (error) {
        console.log(error);
        this.message = "Có lỗi xảy ra. Vui lòng thử lại.";
      }
    },
  },
};
</script>
