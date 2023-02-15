<template>
  <div class="date">
    <template v-if="modeScreen === 'DAY'">
      <div class="card day">
        <div class="header">
          <p class="title" @click="changeMode">
            {{ months[atualMonth] }} {{ atualYear }}
          </p>
          <div class="icons">
            <vue-feather
              size="20"
              @click="backMonth"
              type="chevron-left"
            ></vue-feather>
            <vue-feather
              size="20"
              @click="nextMonth"
              type="chevron-right"
            ></vue-feather>
          </div>
        </div>
        <div class="body">
          <div class="weeks">
            <p v-for="week in weeks" :key="week">
              {{ week[0] }}
            </p>
          </div>
          <div>
            <div v-for="(weekDays, ind) in monthDays" :key="ind" class="days">
              <p
                @click="selectDay(day)"
                v-for="(day, ind2) in weekDays"
                :key="ind2 + '' + day"
                :class="{
                  otherMonth: day.month != atualMonth || day.year != atualYear,
                  today:
                    matchDate(day, today) && !matchDate(day, selected, true),
                  selected: matchDate(day, selected, true),
                  interdates: interdates(day) && ind2 !== 6,
                  'left-interdates':
                    ind2 === 5 && !matchDate(weekDays[6], selected, true),
                  'small-interdates': diffInDays === 1 && ind2 !== 6,
                }"
              >
                <span>
                  {{ day.day }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="modeScreen === 'MONTH'">
      <div class="card month">
        <div class="header">
          <p class="title" @click="changeMode">
            {{ atualYear }}
          </p>
          <div class="icons">
            <vue-feather
              size="20"
              @click="atualYear--"
              type="chevron-left"
            ></vue-feather>
            <vue-feather
              size="20"
              @click="atualYear++"
              type="chevron-right"
            ></vue-feather>
          </div>
        </div>
        <div class="body">
          <div v-for="(line, ind) in monthsYear" :key="ind" class="months">
            <p
              v-for="mt in line"
              :key="mt"
              @click="(atualMonth = mt), (modeScreen = 'DAY')"
              :class="{
                selected: matchDate(
                  { month: mt, year: atualYear, day: 1 },
                  { ...selected[0], day: 1 }
                ),
              }"
            >
              {{ months[mt].substr(0, 3) }}
            </p>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="modeScreen === 'YEAR'">
      <div class="card year">
        <div class="header">
          <p class="title" @click="changeMode">
            {{ showYears[0] }} - {{ showYears[11] }}
          </p>
          <div class="icons">
            <vue-feather
              size="20"
              @click="backYear"
              type="chevron-left"
            ></vue-feather>
            <vue-feather
              size="20"
              @click="nextYear"
              type="chevron-right"
            ></vue-feather>
          </div>
        </div>
        <div class="body">
          <div v-for="(line, ind) in listYears" :key="ind" class="year">
            <p
              v-for="yr in line"
              :key="yr"
              @click="(atualYear = yr), (modeScreen = 'MONTH')"
              :class="{
                selected: selected.year === yr,
              }"
            >
              {{ yr }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const months = {
  1: "janeiro",
  2: "fevereiro",
  3: "março",
  4: "abril",
  5: "maio",
  6: "junho",
  7: "julho",
  8: "agosto",
  9: "setembro",
  10: "outubro",
  11: "novembro",
  12: "dezembro",
};
const weeks = [
  "segunda",
  "terça",
  "quarta",
  "quinta",
  "sexta",
  "sábado",
  "domingo",
];
export default {
  props: {
    multiple: Boolean,
    mode: {
      type: String,
      default: "DAY",
      validator(val) {
        return ["DAY", "MONTH", "YEAR"].includes(val);
      },
    },
    modelValue: {
      type: [String, Array],
      default: "",
    },
  },
  watch: {
    modeScreen(val) {
      this.$emit("update:mode", val);
    },
    mode(val) {
      this.modeScreen = val;
    },
    modelValue: {
      immediate: true,
      handler() {
        if (this.multiple) {
          if (this.selected.length === 1) {
            this.selected[0] = {
              day: this.day,
              month: this.month,
              year: this.year,
            };
          } else if (this.selected.length === 0) {
            this.selected = [];
          } else {
            this.selected = [
              {
                day: this.day,
                month: this.month,
                year: this.year,
              },
              {
                day: this.day2,
                month: this.month2,
                year: this.year2,
              },
            ];
          }
        } else {
          this.selected = [
            { day: this.day, month: this.month, year: this.year },
          ];
        }
        this.atualMonth = this.month || this.today.month;
        this.atualYear = this.year || this.today.year;
        this.showYears = Object.keys(new Array(12).fill(null)).map(
          (el) => Number(el) + this.atualYear
        );
      },
    },
  },
  created() {
    this.modeScreen = this.mode;
  },
  data: () => ({
    showYears: [],
    modeScreen: "",
    selected: [],
    atualMonth: 0,
    atualYear: 0,
    months,
    weeks,
  }),
  methods: {
    changeMode() {
      if (this.modeScreen === "DAY") {
        this.modeScreen = "MONTH";
      } else {
        this.modeScreen = "YEAR";
      }
    },
    orderListDate(dateList) {
      const newList = [...dateList].map(
        (dt) => new Date(this.formateToSend(dt) + "T00:00")
      );
      if (newList[0] > newList[1]) {
        return newList.reverse();
      }
      return newList;
    },
    interdates(date) {
      if (this.multiple && this.selected.length === 2) {
        const selects = this.orderListDate(this.selected);
        const dateParse = new Date(this.formateToSend(date) + "T00:00");
        if (selects[0] - dateParse <= 0 && selects[1] - dateParse > 0) {
          return true;
        }
      }
      return false;
    },
    matchDate(date1, date2, multiple = false) {
      if (multiple) {
        return (
          (date1.day === date2?.[0]?.day &&
            date1.month === date2?.[0]?.month &&
            date1.year === date2?.[0]?.year) ||
          (date1.day === date2?.[1]?.day &&
            date1.month === date2?.[1]?.month &&
            date1.year === date2?.[1]?.year)
        );
      }
      return (
        date1.day === date2.day &&
        date1.month === date2.month &&
        date1.year === date2.year
      );
    },
    nextYear() {
      const last = this.showYears[11];
      this.showYears = Object.keys(new Array(12).fill(null)).map(
        (el) => Number(el) + last + 1
      );
    },
    backYear() {
      const last = this.showYears[0];
      const list = Object.keys(new Array(12).fill(null)).map(
        (el) => -Number(el) + last - 1
      );
      list.reverse();
      this.showYears = list;
    },
    nextMonth() {
      this.atualYear =
        this.atualMonth == 12 ? this.atualYear + 1 : this.atualYear;
      this.atualMonth = this.atualMonth == 12 ? 1 : this.atualMonth + 1;
    },
    backMonth() {
      this.atualYear =
        this.atualMonth == 1 ? this.atualYear - 1 : this.atualYear;
      this.atualMonth = this.atualMonth == 1 ? 12 : this.atualMonth - 1;
    },
    selectDay(data) {
      if (this.multiple) {
        if (this.selected.length === 0) {
          this.selected[0] = data;
        } else if (this.selected.length === 1) {
          this.selected[1] = data;
        } else if (this.selected.length === 2) {
          this.selected = [data];
        }
      } else {
        this.selected = data;
      }

      this.$emit(
        "update:modelValue",
        this.multiple
          ? [...this.selected.map((e) => this.formateToSend(e))]
          : this.formateToSend(data)
      );
    },
    formateToSend(data) {
      const mou = data.month < 10 ? `0${data.month}` : `${data.month}`;
      const day = data.day < 10 ? `0${data.day}` : `${data.day}`;
      return data.year + "-" + mou + "-" + day;
    },
    separarArray(arr, tamanho) {
      var novoArray = [];
      var i = 0;
      while (i < arr.length) {
        novoArray.push(arr.slice(i, i + tamanho));
        i += tamanho;
      }
      return novoArray;
    },
  },
  computed: {
    day() {
      return !this.multiple
        ? Number(this.modelValue?.split("-")[2] || 0)
        : Number(this.modelValue?.[0]?.split("-")[2] || 0);
    },
    month() {
      return !this.multiple
        ? Number(this.modelValue?.split("-")[1])
        : Number(this.modelValue?.[0]?.split("-")[1]);
    },
    year() {
      return !this.multiple
        ? Number(this.modelValue?.split("-")[0])
        : Number(this.modelValue?.[0]?.split("-")[0]);
    },
    day2() {
      return this.multiple ? Number(this.modelValue?.[1]?.split("-")[2]) : null;
    },
    month2() {
      return this.multiple ? Number(this.modelValue?.[1]?.split("-")[1]) : null;
    },
    year2() {
      return this.multiple ? Number(this.modelValue?.[1]?.split("-")[0]) : null;
    },
    today() {
      return {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      };
    },
    date() {
      return { day: this.day, month: this.month, year: this.year };
    },
    date2() {
      return { day: this.day2, month: this.month2, year: this.year2 };
    },
    diffInDays() {
      if (this.selected.length !== 2) return 0;
      const listOrder = this.orderListDate(this.selected);
      const diffTime = Math.abs(listOrder[1] - listOrder[0]);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },
    listYears() {
      return this.separarArray(this.showYears, 3);
    },
    monthsYear() {
      const all = Object.keys(new Array(12).fill(null)).map(
        (el) => Number(el) + 1
      );
      return this.separarArray(all, 3);
    },
    monthDays() {
      const atualMonth = this.atualMonth - 1;
      const atualYear = this.atualYear;
      const fistDayMonth = new Date(atualYear, atualMonth, 1).getDay();
      const daysInMonth = new Date(atualYear, atualMonth + 1, 0).getDate();
      const allDays = Object.keys(new Array(daysInMonth).fill(null)).map(
        (el) => ({
          day: Number(el) + 1,
          month: this.atualMonth,
          year: atualYear,
        })
      );
      if (fistDayMonth > 0) {
        let daysInMonth = new Date(atualYear, atualMonth, 0).getDate();
        const completeDays = Object.values(
          new Array(fistDayMonth).fill("0")
        ).map(() => ({
          day: daysInMonth--,
          month: this.atualMonth === 1 ? 12 : this.atualMonth - 1,
          year: this.atualMonth === 1 ? atualYear - 1 : atualYear,
        }));
        completeDays.reverse();
        allDays.unshift(...completeDays);
      }
      if (allDays.length < 42) {
        const complete = 42 - allDays.length;
        const completeDays = Object.keys(new Array(complete).fill(null)).map(
          (el) => ({
            day: Number(el) + 1,
            month: this.atualMonth === 12 ? 1 : this.atualMonth + 1,
            year: this.atualMonth === 12 ? atualYear + 1 : atualYear,
          })
        );
        allDays.push(...completeDays);
      }
      return this.separarArray(allDays, allDays.length / 6);
    },
  },
};
</script>

<style lang="scss">
@mixin header {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 8px;
    margin-right: 8px;
    margin-top: 8px;
    .icons i {
      cursor: pointer;
    }
    .title {
      font-weight: bold;
      text-transform: capitalize;
      cursor: pointer;
    }
  }
}
.date {
  .card {
    height: 280px;
    width: 320px;
    background: #252831;
    padding: 12px;
    border-radius: 8px;
    &.month,
    &.year {
      display: flex;
      flex-direction: column;
    }
    &.day {
      @include header;
      .body {
        margin-top: 20px;
        .weeks {
          display: flex;
          justify-content: space-between;
          p {
            text-transform: uppercase;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6c6c6c;
            height: 32px;
            width: 32px;
          }
        }
        .days p.selected.interdates::before {
          margin-left: 20px;
        }
        .days {
          display: flex;
          justify-content: space-between;
          align-items: center;
          p {
            text-transform: uppercase;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 50%;
            font-weight: 600;
            height: 32px;
            width: 32px;
            span {
              text-transform: uppercase;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              position: absolute;
              z-index: 2;
              height: 32px;
              width: 32px;
            }
            &.otherMonth span {
              color: #6c6c6c;
            }
            &.today span {
              color: #5093fe;
              background: #ffffff;
            }
            &.selected span {
              background: #5093fe;
            }

            &.interdates {
              position: relative;

              &::before {
                content: "";
                background: #161922;
                border-radius: 0px;
                height: 100%;
                width: 200%;
                position: absolute;
                z-index: 1;
                left: 0;
              }
            }
            &.small-interdates::before {
              width: 150%;
            }
            &.left-interdates::before {
              margin-left: 15px;
            }
          }
        }
      }
    }

    &.month {
      @include header;
      .body {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        .months {
          display: flex;
          justify-content: space-between;
          p {
            text-transform: capitalize;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 15px;
            font-weight: 600;
            font-size: 20px;
            height: 37px;
            width: 70px;
            &.selected {
              background: #5093fe;
            }
          }
        }
      }
    }

    &.year {
      @include header;
      .body {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        .year {
          display: flex;
          justify-content: space-between;
          p {
            text-transform: capitalize;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 15px;
            font-weight: 600;
            font-size: 20px;
            height: 37px;
            width: 70px;
            &.selected {
              background: #5093fe;
            }
          }
        }
      }
    }
  }
}
</style>
