<script>
export default {
  props: {
    sachs: { type: Array, default: () => [] },
    activeIndex: { type: Number, default: -1 },
  },
  emits: ["update:activeIndex"],
  methods: {
    updateActiveIndex(index) {
      this.$emit("update:activeIndex", index);
    },
  },
};
</script>
<template>
  <ul class="list-group">
    <li
      class="list-group-item d-flex justify-content-between align-items-center"
      v-for="(sach, index) in sachs"
      :key="sach._id"
      :class="{ active: index === activeIndex }"
      @click="updateActiveIndex(index)"
    >
      <div><i class="fas fa-book mr-2"></i> {{ sach.ten_sach }}</div>

      <router-link :to="{ name: 'sach.detail', params: { id: sach._id } }">
        <button class="btn btn-sm btn-outline-info">Xem chi tiết <i class="fas fa-eye"></i></button>
      </router-link>
    </li>
  </ul>
</template>
