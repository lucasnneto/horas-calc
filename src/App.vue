<template>
  <div>
    <base-modal v-model="modal">
      <dateSelect v-if="multiple" multiple v-model="datas" />
      <dateSelect v-else v-model="dataUnica" />
      <div class="header-modal">
        <div
          class="button"
          @click="
            dataUnica = '';
            datas = [];
            modal = false;
          "
        >
          <p>Cancelar</p>
        </div>
        <div class="button" @click="salveData">
          <p>Salvar</p>
        </div>
      </div>
    </base-modal>
    <base-modal v-model="modal2">
      <activityModal
        :day="list[day]"
        :ind="day"
        :dataToEdit="dataToEdit"
        @cancel="
          modal2 = false;
          dataToEdit = {};
        "
        @save="saveNewdata"
        @edit="editData"
      />
    </base-modal>
    <base-modal v-model="modal3"
      ><savesURLs @closeModal="modal3 = false"></savesURLs>
    </base-modal>
    <div class="main">
      <div class="header">
        <div class="dias">
          <div class="button" @click="newWeek">
            <p>Nova semana</p>
            <vue-feather type="plus-circle"></vue-feather>
          </div>
          <div class="button" @click="addDay">
            <p>Novo dia</p>
            <vue-feather type="plus-circle"></vue-feather>
          </div>
        </div>
        <div class="button" @click="editUrl">
          <p>Gerência Urls</p>
          <vue-feather type="plus-circle"></vue-feather>
        </div>
      </div>

      <div
        style="
          overflow: auto;
          max-height: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
        "
      >
        <card-day
          v-for="(day, index) in list"
          :key="index"
          :day="day"
          :indice="index"
          @delete-day="deleteDay"
          @add-active="addActive"
          @delete-hour="deleteHour"
          @edit-hour="editHour"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import cardDay from "./cardDay";
import baseModal from "./baseModal";
import dateSelect from "./dateSelect.vue";
import activityModal from "./ActivityModal.vue";
import savesURLs from "./savesURLs.vue";
export default {
  name: "App",
  components: {
    cardDay,
    baseModal,
    dateSelect,
    activityModal,
    savesURLs,
  },
  created() {
    const item = JSON.parse(localStorage.getItem("item") || "[]");
    this.list = [...item];
  },
  beforeUnmount() {
    localStorage.setItem("item", JSON.stringify(this.list));
  },
  beforeUpdate() {
    localStorage.setItem("item", JSON.stringify(this.list));
  },
  data: () => ({
    modal: false,
    modal2: false,
    modal3: false,
    day: 0,
    datas: [],
    list: [],
    multiple: false,
    dataUnica: "",
    dataToEdit: {},
  }),
  methods: {
    editData(ind, name, value, url, indexHr) {
      this.dataToEdit = {};
      this.list[ind].data.splice(indexHr, 1, {
        name,
        value,
        url,
      });
      this.modal2 = false;
    },
    editHour(index, indexHr) {
      this.dataToEdit = {
        ...this.list[index].data[indexHr],
        posDia: index,
        posHr: indexHr,
      };
      this.day = index;
      this.modal2 = true;
    },
    deleteHour(index, indexHr) {
      this.list[index].data.splice(indexHr, 1);
    },
    addActive(ind) {
      this.dataToEdit = {};
      this.day = ind;
      this.modal2 = true;
    },
    saveNewdata(ind, name, value, url) {
      this.list[ind].data.push({
        name,
        value,
        url,
      });
      this.modal2 = false;
    },
    newWeek() {
      this.multiple = true;
      this.modal = true;
    },
    editUrl() {
      this.modal3 = true;
    },
    salveData() {
      if (this.multiple) {
        if (this.datas.length !== 2) return;
        if (moment(this.datas[0]).isSameOrAfter(moment(this.datas[1]))) {
          this.datas.reverse();
        }
        let lastDay = moment(this.datas[0]);
        const listDays = [lastDay.format()];
        while (lastDay.format("D") !== moment(this.datas[1]).format("D")) {
          lastDay = lastDay.add(1, "days");
          listDays.push(lastDay.format());
        }
        this.list = listDays.map((dt) => ({
          day: dt,
          data: [],
          duration: "07:00",
        }));
      } else {
        this.list.push({
          day: moment(this.dataUnica).format(),
          data: [],
          duration: "07:00",
        });
      }
      this.modal = false;
    },
    addDay() {
      this.multiple = false;
      this.modal = true;
    },
    deleteDay(index) {
      this.list.splice(index, 1);
    },
  },
};
</script>

<style lang="scss">
.main {
  max-height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 16px;
  position: relative;
  > .header {
    background: #5093fe;
    margin-left: -16px;
    margin-right: -16px;
    margin-top: -16px;
    margin-bottom: 16px;
    padding: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .dias {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .button {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-weight: 600;
      cursor: pointer;
      margin-right: 20px;
    }
    .button i {
      margin-left: 10px;
    }
  }
}
.header-modal {
  display: flex;
  div {
    margin-right: 10px;
    cursor: pointer;
    &:first-child {
      color: red;
    }
  }
}
</style>
