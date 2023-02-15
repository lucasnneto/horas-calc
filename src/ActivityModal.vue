<template>
  <div class="modal">
    <p class="title">
      {{ formatedDay }}
    </p>
    <text-field v-model="name" label="Nome" class="input"></text-field>
    <time-picker v-model="duration" label="Duração" class="input"></time-picker>
    <b-menu class="input">
      <text-field v-model="url" label="Url"></text-field>
      <template v-slot:menu>
        <div class="list-url">
          <p
            v-for="u in urls"
            :key="u.url"
            @click="url = u.url"
            :class="{ selected: url === u.url }"
          >
            {{ u.name }}
          </p>
        </div>
      </template>
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
  props: ["day", "ind", "dataToEdit"],
  components: {
    textField,
    timePicker,
    bMenu,
  },

  data: () => ({
    name: "",
    duration: "",
    url: "",
    urls: [],
  }),

  created() {
    if (this.isEdit) {
      this.name = this.dataToEdit.name;
      this.duration = this.dataToEdit.value;
      this.url = this.dataToEdit.url;
    }
    const item = JSON.parse(localStorage.getItem("savedUrls") || "[]");
    this.urls = [...item];
  },
  methods: {
    clean() {
      this.name = "";
      this.duration = "";
      this.url = "";
    },
    cleanAndClose() {
      if (this.isEdit) {
        this.$emit(
          "edit",
          this.ind,
          this.name,
          this.duration,
          this.url,
          this.dataToEdit.posHr
        );
      } else {
        this.$emit("save", this.ind, this.name, this.duration, this.url);
      }
      this.clean();
    },
  },
  computed: {
    isEdit() {
      return !!Object.keys(this.dataToEdit).length;
    },
    formatedDay() {
      if (!this.day?.day) return "";
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
  .list-url {
    display: flex;
    flex-direction: column;
    width: 100%;
    p {
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
      &:hover {
        background: #161922;
      }
      .selected {
        background: #161922;
      }
    }
  }
}
</style>
