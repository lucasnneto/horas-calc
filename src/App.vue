<template>
  <div>
    <button @click="add">add</button>
    <table>
      <tr>
        <th>Texto</th>
        <th>Duração</th>
        <th>Ação</th>
      </tr>
      <tr v-for="item in list" :key="item.id">
        <td><input type="text" v-model="item.name" /></td>
        <td><input type="time" v-model="item.value" /></td>
        <td><button @click="deleteItem(item.id)">delete</button></td>
      </tr>
      <tr>
        <td>TOTAL</td>
        <td>{{ total }}</td>
        <td>FALTA: {{ restante }}</td>
      </tr>
    </table>
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
    if (!item.length) {
      this.add();
    } else {
      this.list = item;
    }
  },
  beforeUnmount() {
    localStorage.setItem("item", JSON.stringify(this.list));
  },
  beforeUpdate() {
    localStorage.setItem("item", JSON.stringify(this.list));
  },
  methods: {
    add() {
      this.list.push({
        id: (Math.random() + 1).toString(36).substring(7),
        name: "",
        value: "",
      });
    },
    deleteItem(item) {
      const ind = this.list.findIndex((el) => el.id === item);
      if (ind != -1) this.list.splice(ind, 1);
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
  },
  computed: {
    total() {
      const dur = this.list.reduce((acc, item) => {
        if (item.value) return acc.add(moment.duration(item.value));
        return acc;
      }, moment.duration("00:00"));
      return moment.utc(dur.as("milliseconds")).format("HH:mm");
    },
    restante() {
      const rest = moment
        .duration("07:00")
        .subtract(moment.duration(this.total));
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
