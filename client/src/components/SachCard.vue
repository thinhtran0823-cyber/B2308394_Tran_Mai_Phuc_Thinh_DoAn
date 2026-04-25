<script>
export default {
  props: {
    sach: { type: Object, required: true },
  },
};
</script>
<template>
  <div>
    <div class="p-1"><strong>Tên sách:</strong> {{ sach.ten_sach }}</div>
    <div class="p-1"><strong>Tác giả:</strong> {{ sach.tac_gia }}</div>
    <div class="p-1"><strong>Đơn giá:</strong> {{ sach.don_gia }} VNĐ</div>
    <div class="p-1"><strong>Số lượng:</strong> {{ sach.so_quyen }} quyển</div>
    <div class="p-1"><strong>Năm xuất bản:</strong> {{ sach.nam_xuat_ban }}</div>
  </div>
</template>
