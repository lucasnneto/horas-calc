<template>
  <div class="text-field">
    <p v-if="label">{{ label }}</p>
    <input
      :type="type"
      :disabled="disabled"
      @input="(e) => $emit('update:modelValue', e.target.value)"
      :value="modelValue"
    />
  </div>
</template>

<script>
export default {
  props: {
    modelValue: undefined,
    disabled: Boolean,
    label: String,
    type: {
      default: "text",
    },
  },
};
</script>

<style lang="scss">
.text-field {
  p {
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 20px;
  }

  input {
    border: none;
    background: #252831;
    border-radius: 8px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 15px;
    padding-right: 15px;
    caret-color: #5093fe;
    font-weight: 400;
    color: white;
    &:focus-visible,
    &:hover {
      outline: 2px solid #5093fe;
    }

    font-size: 24px;
    min-width: 300px;
    width: 300px;
  }
}
</style>
