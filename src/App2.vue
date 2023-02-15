<template>
  <div>
    <button @click="addTable" style="margin-bottom: 10px">add Dia</button>
    <div v-for="(table, ind) in list" :key="table.id">
      <hr style="margin-bottom: 20px; margin-top: 20px" />
      <button @click="deleteDia(ind)">delete Dia</button>
      <p>
        Dia - <input type="number" v-model="table.day" style="width: 50px" />
      </p>
      <p>
        Duração -
        <select v-model="table.duration">
          <option value="06:00" selected>06:00</option>
          <option value="07:00">07:00</option>
        </select>
      </p>

      <button @click="add(ind)">add hora</button>
      <table>
        <tr>
          <th>Texto</th>
          <th>Duração</th>
          <th>Ação</th>
        </tr>
        <tr v-for="item in table.data" :key="item.id">
          <td><input type="text" v-model="item.name" /></td>
          <td><input type="time" v-model="item.value" /></td>
          <td><button @click="deleteItem(ind, item.id)">delete</button></td>
        </tr>
        <tr>
          <td>TOTAL</td>
          <td>{{ total(ind) }}</td>
          <td>FALTA: {{ restante(ind) }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "App",
  data: () => ({
    list: [],
  }),
  created() {
    const item = JSON.parse(localStorage.getItem("item") || "[]");
    // if (!item.length) {
    //   this.add();
    // } else {
    //   this.list = item;
    //   }
    this.list = [...item];
  },
  beforeUnmount() {
    localStorage.setItem("item", JSON.stringify(this.list));
  },
  beforeUpdate() {
    localStorage.setItem("item", JSON.stringify(this.list));
  },
  methods: {
    addTable() {
      this.list.push({
        id: (Math.random() + 1).toString(36).substring(7),
        day: Number(moment().format("D")),
        data: [],
        duration: "06:00",
      });
    },
    deleteDia(index) {
      this.list.splice(index, 1);
    },
    add(index) {
      this.list[index].data.push({
        id: (Math.random() + 1).toString(36).substring(7),
        name: "",
        value: "",
      });
    },
    deleteItem(indexTb, item) {
      console.log(this.list[indexTb]);
      const ind = this.list[indexTb].data.findIndex((el) => el.id === item);
      if (ind != -1) this.list[indexTb].data.splice(ind, 1);
    },
    convertDate(value, hasNeg = false) {
      let val = "";
      if (hasNeg && value <= 0) {
        val = "-";
      }
      const newValue = value.toString().replace("-", "");

      val = val + (newValue.length == 1 ? "0" + newValue : newValue);

      return val;
    },
    total(ind) {
      const dur = this.list[ind].data.reduce((acc, item) => {
        if (item.value) return acc.add(moment.duration(item.value));
        return acc;
      }, moment.duration("00:00"));
      return moment.utc(dur.as("milliseconds")).format("HH:mm");
    },
    restante(ind) {
      const rest = moment
        .duration(this.list[ind].duration)
        .subtract(moment.duration(this.total(ind)));
      return `${this.convertDate(
        rest.hours(),
        !!rest.minutes()
      )}:${this.convertDate(rest.minutes())}`;
    },
  },
};
</script>

<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
