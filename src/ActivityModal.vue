<template>
  <div class="modal">
    <p class="title">
      {{ formatedDay }}
    </p>
    <text-field v-model="name" label="Nome" class="input"></text-field>
    <time-picker v-model="duration" label="Duração" class="input"></time-picker>
    <b-menu class="input">
      <text-field v-model="url" label="Url"></text-field>
      <template v-slot:menu> teste </template>
    </b-menu>
    <div class="header-modal">
      <div
        class="button"
        @click="
          clean();
          $emit('cancel');
        "
      >
        <p>Cancelar</p>
      </div>
      <div class="button" @click="cleanAndClose">
        <p>Salvar</p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import textField from "./textField.vue";
import timePicker from "./timePicker.vue";
import bMenu from "./b-menu.vue";
export default {
  props: ["day", "ind"],
  components: {
    textField,
    timePicker,
    bMenu,
  },

  data: () => ({
    name: "",
    duration: "",
    url: "",
  }),
  methods: {
    clean() {
      this.name = "";
      this.duration = "";
      this.url = "";
    },
    cleanAndClose() {
      this.$emit("save", this.ind, this.name, this.duration, this.url);
      this.clean();
    },
  },
  computed: {
    formatedDay() {
      return moment(this.day.day).format("ddd - DD/MM");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  .title {
    margin-bottom: 30px;
    font-weight: bold;
    font-size: 25px;
  }
  .input {
    margin-bottom: 20px;
  }
}
</style>
