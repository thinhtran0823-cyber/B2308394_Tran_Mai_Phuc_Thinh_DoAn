<template>
  <Form @submit="submitSach" :validation-schema="sachFormSchema">
    <div class="form-group">
      <label for="ten_sach">Tên sách</label>
      <Field name="ten_sach" type="text" class="form-control" v-model="sachLocal.ten_sach" />
      <ErrorMessage name="ten_sach" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="tac_gia">Tác giả</label>
      <Field name="tac_gia" type="text" class="form-control" v-model="sachLocal.tac_gia" />
      <ErrorMessage name="tac_gia" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="don_gia">Đơn giá (VNĐ)</label>
      <Field name="don_gia" type="number" class="form-control" v-model="sachLocal.don_gia" />
      <ErrorMessage name="don_gia" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="so_quyen">Số quyển</label>
      <Field name="so_quyen" type="number" class="form-control" v-model="sachLocal.so_quyen" />
      <ErrorMessage name="so_quyen" class="error-feedback" />
    </div>

    <div class="form-group">
      <label for="nam_xuat_ban">Năm xuất bản</label>
      <Field
        name="nam_xuat_ban"
        type="number"
        class="form-control"
        v-model="sachLocal.nam_xuat_ban"
      />
      <ErrorMessage name="nam_xuat_ban" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="hinh_anh">Link hình ảnh sách</label>
      <Field
        name="hinh_anh"
        type="text"
        class="form-control"
        v-model="sachLocal.hinh_anh"
        placeholder="Dán link ảnh tại đây..."
      />
      <div v-if="sachLocal.hinh_anh" class="mt-2 text-center">
        <img
          :src="sachLocal.hinh_anh"
          alt="Preview"
          style="max-height: 150px; border-radius: 5px"
        />
      </div>
    </div>
    <div class="form-group">
      <label for="ma_nxb">Nhà Xuất Bản</label>
      <Field name="ma_nxb" as="select" class="form-control" v-model="sachLocal.ma_nxb">
        <option value="" disabled>-- Chọn Nhà Xuất Bản --</option>
        <option v-for="nxb in nhaxuatbans" :key="nxb._id" :value="nxb._id">
          {{ nxb.ten_nxb }}
        </option>
      </Field>
      <ErrorMessage name="ma_nxb" class="error-feedback" />
    </div>

    <div class="form-group mt-3">
      <button class="btn btn-primary"><i class="fas fa-save"></i> Lưu</button>
      <button v-if="sachLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteSach">
        <i class="fas fa-trash"></i> Xóa
      </button>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Field, ErrorMessage } from "vee-validate";
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
  components: { Field, ErrorMessage },
  emits: ["submit:sach", "delete:sach"],
  props: {
    sach: { type: Object, required: true },
  },
  data() {
    const sachFormSchema = yup.object().shape({
      ten_sach: yup.string().required("Tên sách phải có giá trị."),
      tac_gia: yup.string().required("Tác giả phải có giá trị."),
      don_gia: yup.number().typeError("Đơn giá phải là số.").min(0, "Đơn giá không được âm."),
      so_quyen: yup.number().typeError("Số lượng phải là số.").min(0, "Số lượng không được âm."),
      nam_xuat_ban: yup.number().typeError("Năm xuất bản phải là số."),
      ma_nxb: yup.string().required("Vui lòng chọn Nhà Xuất Bản."),
    });
    return {
      sachLocal: { ...this.sach },
      sachFormSchema,
      nhaxuatbans: [], // Biến lưu danh sách NXB
    };
  },
  methods: {
    submitSach() {
      this.$emit("submit:sach", this.sachLocal);
    },
    deleteSach() {
      this.$emit("delete:sach", this.sachLocal._id);
    },
    // Hàm gọi API lấy danh sách NXB
    async getDanhSachNXB() {
      try {
        this.nhaxuatbans = await NhaXuatBanService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    // Gọi hàm ngay khi Form vừa hiện lên
    this.getDanhSachNXB();
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
.error-feedback {
  color: red;
  font-size: 0.9em;
}
</style>
