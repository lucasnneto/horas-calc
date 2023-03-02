<template>
  <div class="time-picker">
    <b-menu class="time-picker" v-model:show="show" :closeOnClick="false">
      <div class="time-pick-textfield">
        <p v-if="label">{{ label }}</p>
        <div class="time-pick-input" :class="{ selected: show }">
          <span>
            {{ horaFinal.hora }}
            <span v-if="horaFinal.hora && horaFinal.min" class="dot">:</span>
            {{ horaFinal.min }}
          </span>
          <vue-feather stroke="#5093fe" size="30" type="clock"></vue-feather>
        </div>
      </div>
      <template v-slot:menu>
        <div class="menu-timer" role="menu">
          <div class="time-scroll" ref="hora">
            <div
              v-for="hr in 24"
              :key="hr"
              @click="selectHr(hr - 1)"
              class="time"
              :class="[
                { select: hora === hr - 1 },
                'hr-' + paddingNumber(hr - 1),
              ]"
            >
              {{ paddingNumber(hr - 1) }}
            </div>
          </div>
          <div class="divider"></div>
          <div ref="min" class="time-scroll left">
            <div
              v-for="hr in 60"
              :key="hr"
              @click="selectMin(hr - 1)"
              class="time"
              :class="[
                { select: min === hr - 1 },
                'min-' + paddingNumber(hr - 1),
              ]"
            >
              {{ paddingNumber(hr - 1) }}
            </div>
          </div>
        </div>
      </template>
    </b-menu>
  </div>
</template>

<script>
import bMenu from "./b-menu.vue";

export default {
  props: {
    label: String,
    modelValue: String,
  },
  components: {
    bMenu,
  },
  data: () => ({
    hora: -1,
    min: -1,
    show: false,
    initial: true,
  }),
  mounted() {
    if (this.modelValue) {
      const times = this.modelValue.split(":");
      this.hora = Number(times[0]);

      this.min = Number(times[1]);
    }
  },
  watch: {
    show(val) {
      if (val && this.modelValue) {
        setTimeout(() => {
          const times = this.modelValue.split(":");

          const hrComp = document.querySelector(".hr-" + times[0]);
          const y = hrComp.offsetTop - hrComp.clientHeight * 1.5;
          this.$refs.hora.scrollTop = y;
          // hrComp.scrollIntoView({ block: "center" });

          const minComp = document.querySelector(".min-" + times[1]);
          // minComp.scrollIntoView({ block: "center" });
          const y2 = minComp.offsetTop - minComp.clientHeight * 1.5;
          this.$refs.min.scrollTop = y2;
        }, 20);
      }
    },
  },
  computed: {
    horaFinal() {
      if (this.hora === -1 && this.min === -1) return { hora: "", min: "" };
      const parseHr =
        this.hora !== -1 ? this.hora.toString().padStart(2, "0") : "--";
      const parseMin =
        this.min !== -1 ? this.min.toString().padStart(2, "0") : "--";
      this.$emit("update:modelValue", parseHr + ":" + parseMin);
      return { hora: parseHr, min: parseMin };
    },
  },
  methods: {
    centerMin(value) {
      const minComp = document.querySelector(".min-" + value);
      const y2 = minComp.offsetTop - minComp.clientHeight * 1.5;
      this.$refs.min.scrollTo({ top: y2, behavior: "smooth" });
    },
    centerHr(value) {
      const hrComp = document.querySelector(".hr-" + value);
      const y = hrComp.offsetTop - hrComp.clientHeight * 1.5;
      this.$refs.hora.scrollTo({ top: y, behavior: "smooth" });
    },
    paddingNumber(hr) {
      return hr.toString().padStart(2, "0");
    },
    selectHr(hr) {
      this.hora = hr;
      this.centerHr(this.paddingNumber(hr));
    },
    selectMin(min) {
      this.min = min;
      this.centerMin(this.paddingNumber(min));
    },
  },
};
</script>

<style lang="scss">
.time-picker {
  position: relative;
  height: 100%;
  .time-pick-textfield {
    p {
      margin-bottom: 5px;
      font-weight: bold;
      font-size: 20px;
    }
    .time-pick-input {
      border: none;
      background: #252831;
      border-radius: 8px;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 15px;
      padding-right: 15px;
      font-weight: 400;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .dot {
        color: #5093fe;
      }
      height: 32px;
      color: white;
      font-size: 24px;
      min-width: 300px;
      width: 300px;
      &:focus-visible,
      &:hover,
      &.selected {
        outline: 2px solid #5093fe;
      }
    }
  }
  .menu-timer {
    display: flex;
    margin-top: 2px;
    border-radius: 20px;
    width: 100%;
    height: 150px;
    padding-top: 20px;
    padding-bottom: 20px;

    .divider {
      height: 100%;
      border: 2px solid #5093fe;
    }
    .time-scroll {
      color: #6c6c6c;
      cursor: pointer;
      font-weight: 500;
      font-size: 35px;
      height: 100%;
      overflow: auto;
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: end;
      padding-right: 30px;
      &::-webkit-scrollbar {
        display: none;
      }
      &.left {
        align-items: flex-start;
        padding-right: 0px;
        padding-left: 30px;
      }
      .select {
        color: white;
      }
      .time {
        width: 45px;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
