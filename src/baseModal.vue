<template>
  <div
    :style="{ display: !modelValue ? 'none' : 'flex' }"
    class="modal-bg"
    ref="baseModal"
    @click.self="closeModal"
  >
    <div class="modal">
      <div class="modal-card" v-if="modelValue">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: Boolean,
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
      this.$emit("update:modelValue", !this.modelValue);
    },
  },
};
</script>

<style>
.modal-bg {
  z-index: 5;
  position: absolute;
  background: #00000062;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-card {
  background: #161922;
  padding: 20px;
  border-radius: 10px;
}
</style>
