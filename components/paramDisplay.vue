<template>
  <div class="param-display">
    <a-row v-for="(item, index) of value" :key="`param${index}`" class="param-row">
      <a-col :span="18">
        {{ item.name }}
      </a-col>
      <a-col :span="6" class="text-right">
        <span class="clickable" @click=editParam(index)>编辑</span>
        <span class="clickable" @click=deleteParam(index)>删除</span>
      </a-col>
    </a-row>
    <a-row class="add-param-row">
      <a-col :span="24">
        <span class="clickable" @click="addParam">
          +添加输出参数
        </span>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      // default: () => [],
    },
  },
  methods: {
    addParam() {
      this.$emit('addParam')
    },
    deleteParam(index) {
      this.$emit('deleteParam', index)
    },
    editParam(index) {
      this.$emit('editParam', index)
    },
  },
}
</script>

<style lang="stylus">
.param-display
  .param-row
    background-color: #eee
    padding: 0 10px
    &:not(:first-child)
      margin-top: 5px !important
</style>
