<template>
  <div class="b-menu" ref="menuBase">
    <div class="component" ref="comp" @click="showMenu = !showMenu">
      <slot></slot>
    </div>

    <div
      class="menu"
      :class="{ 'show-modal': showMenu }"
      ref="timerPicker"
      @focusout="showMenu = false"
      tabindex="1"
    >
      <slot name="menu"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["show"],
  data: () => ({
    showMenu: false,
    function: new Function(),
  }),
  beforeMount() {
    this.function = (e) => {
      if (!this.$refs.menuBase.contains(e.target)) {
        this.closeMenu();
      }
    };
    window.addEventListener("click", this.function);
  },
  beforeUnmount() {
    window.removeEventListener("click", this.function);
  },
  watch: {
    show: {
      handler(val) {
        this.showMenu = val;
      },
      immediate: true,
    },
    showMenu: {
      handler(val) {
        this.$emit("update:show", val);
      },
      immediate: true,
    },
  },
  methods: {
    closeMenu() {
      this.showMenu = false;
    },
  },
};
</script>

<style lang="scss">
.b-menu {
  position: relative;
  height: 100%;

  .menu {
    display: none;
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    z-index: 5;

    &.show-modal {
      display: flex;
    }
    margin-top: 2px;
    background: #252831;
    border-radius: 20px;
    box-shadow: 0px 7.60456px 19.0114px rgba(0, 0, 0, 0.25);
    padding: 15px;
  }
}
</style>
