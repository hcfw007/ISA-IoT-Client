<template>
  <a-config-provider :locale="locale">
    <a-layout>
      <a-layout-content>
        <Nuxt />
      </a-layout-content>
    </a-layout>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data() {
    return {
      locale: zhCN,
    }
  },
}
</script>
