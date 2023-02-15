<template>
  <div class="url">
    <div class="title">
      <vue-feather
        @click="$emit('closeModal')"
        size="30"
        type="x"
      ></vue-feather>
      <p>Gerenciar URLs</p>
    </div>
    <div class="adding">
      <div class="pontos">
        <text-field v-model="name" class="input" label="Nome"></text-field>
        <text-field v-model="url" class="input" label="Url"></text-field>
      </div>
      <vue-feather @click="addNew" size="30" type="plus-circle"></vue-feather>
    </div>
    <div class="base">
      <div v-for="(url, i) in list" :key="i" class="line">
        <div>
          <p>{{ url.name }}</p>
          <p class="url">{{ url.url }}</p>
        </div>
        <div class="sub">
          <vue-feather type="trash-2" @click="deleteItem(i)"></vue-feather>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import textField from "./textField.vue";
export default {
  data: () => ({
    list: [],
    name: "",
    url: "",
  }),
  components: {
    textField,
  },
  created() {
    const item = JSON.parse(localStorage.getItem("savedUrls") || "[]");
    this.list = [...item];
  },
  beforeUnmount() {
    localStorage.setItem("savedUrls", JSON.stringify(this.list));
  },
  beforeUpdate() {
    localStorage.setItem("savedUrls", JSON.stringify(this.list));
  },
  methods: {
    addNew() {
      this.list.push({
        name: this.name,
        url: this.url,
      });
      this.name = "";
      this.url = "";
    },
    deleteItem(i) {
      this.list.splice(i, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.url {
  .title {
    display: flex;
    align-content: center;
    margin-bottom: 30px;
    font-weight: bold;
    font-size: 25px;
    i {
      margin-right: 20px;
      cursor: pointer;
    }
  }
  .adding {
    display: flex;
    align-items: center;
    .text-field {
      margin-right: 10px;
      margin-bottom: 10px;
    }
    i {
      cursor: pointer;
    }
  }
  .base {
    margin-top: 30px;
    .line .url {
      font-size: 10px;
    }
  }
  .base .line,
  .base .line .sub {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .base .line a {
    text-decoration: none;
    color: #5093fe;
  }
  .base .line .sub .time {
    font-size: 20px;
    margin-right: 15px;
  }
  .base .line .sub i {
    cursor: pointer;
  }
  .base .line .sub i:first-of-type {
    margin-right: 10px;
  }
}
</style>
