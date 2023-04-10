<template>
  <div class="modal">
    <div class="header">
      <p class="title">
        {{ formatedDay }}
      </p>
      <p class="temp-rest">
        Tempo restante <br />
        <span
          class="select-time"
          :class="{ previa: previa !== restante }"
          @click="selectTime"
        >
          {{ previa }}
        </span>
      </p>
    </div>

    <text-field v-model="name" label="Nome" class="input"></text-field>
    <time-picker
      v-model="duration"
      label="Duração"
      class="input"
      :step="5"
    ></time-picker>
    <text-field
      class="input"
      v-model="url"
      label="Url"
      v-if="urls.length === 0"
    ></text-field>
    <b-menu class="input" v-else>
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
    selectTime() {
      this.duration = this.restante;
    },
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
    convertDate(value) {
      let val = "";

      const newValue = value.toString().replace("-", "");

      val = val + (newValue.length == 1 ? "0" + newValue : newValue);

      return val;
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
    total() {
      const dur = this.day.data.reduce((acc, item) => {
        if (item.value) return acc.add(moment.duration(item.value));
        return acc;
      }, moment.duration("00:00"));
      return moment.utc(dur.as("milliseconds")).format("HH:mm");
    },
    restante() {
      const rest = moment
        .duration(this.day.duration)
        .subtract(moment.duration(this.total));
      return `${this.convertDate(
        rest.hours(),
        !!rest.minutes()
      )}:${this.convertDate(rest.minutes())}`;
    },
    previa() {
      if (!this.duration) {
        return this.restante;
      }
      const rest = moment
        .duration(this.restante)
        .subtract(moment.duration(this.duration));
      return `${
        rest.hours() < 0 || rest.minutes() < 0 ? "-" : ""
      }${this.convertDate(rest.hours())}:${this.convertDate(rest.minutes())}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  .header {
    display: flex;
    justify-content: space-between;
  }
  .temp-rest {
    font-size: 12px;
    text-align: center;
    .select-time {
      cursor: pointer;
    }
    .previa {
      color: rgb(255, 128, 82);
    }
  }
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
