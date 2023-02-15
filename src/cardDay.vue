<template>
  <div class="card">
    <div class="principal">
      <p class="title">
        {{ formatedDay }}
      </p>
      <div class="icons">
        <vue-feather
          type="plus-circle"
          @click="$emit('addActive', indice)"
        ></vue-feather>
        <vue-feather
          @click="$emit('deleteDay', indice)"
          type="trash-2"
        ></vue-feather>
      </div>
    </div>
    <div class="base">
      <div v-for="(d, i) in day.data" :key="i" class="line">
        <a v-if="d.url" :href="d.url">{{ d.name }}</a>
        <p v-else>{{ d.name }}</p>
        <div class="sub">
          <p class="time">{{ d.value }}</p>
          <vue-feather
            type="edit-2"
            @click="$emit('editHour', indice, i)"
          ></vue-feather>
          <vue-feather
            type="trash-2"
            @click="$emit('deleteHour', indice, i)"
          ></vue-feather>
        </div>
      </div>
    </div>
    <div class="footer">
      <p class="title">Total</p>
      <p class="title">
        {{ total }}/<span class="small">{{ restante }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    day: Object,
    indice: Number,
  },
  computed: {
    formatedDay() {
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
  },
  methods: {
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
};
</script>

<style lang="scss" scoped>
.card {
  background: #252831;
  border-radius: 10px;
  padding: 20px 40px;
  margin-bottom: 20px;
  margin-right: 20px;
}

.card .principal {
  margin-bottom: 30px;
}
.card .principal,
.card .footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.card .principal .icons i {
  cursor: pointer;
}
.card .principal .icons i:first-of-type {
  margin-right: 10px;
}
.card .principal .title {
  font-weight: bold;
  font-size: 20px;
}

.card .base .line,
.card .base .line .sub {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.card .base .line a {
  text-decoration: none;
  color: #5093fe;
}
.card .base .line .sub .time {
  font-size: 20px;
  margin-right: 15px;
}
.card .base .line .sub i {
  cursor: pointer;
}
.card .base .line .sub i:first-of-type {
  margin-right: 10px;
}
.card .footer {
  border-top: 1.5px solid black;
  margin-top: 20px;
  padding-top: 20px;
}
.card .footer .title {
  font-weight: bold;
  font-size: 20px;
}
.card .footer .small {
  font-weight: 400;
  font-size: 15px;
}
</style>
