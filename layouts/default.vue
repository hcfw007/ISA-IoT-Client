<template>
  <a-config-provider :locale="locale">
    <a-layout class="frame-container">
      <a-layout-sider width="250px">
        <sidebar />
      </a-layout-sider>
      <a-layout>
        <a-layout-header height="70px" style="padding: 0">
          <navbar />
        </a-layout-header>
        <a-layout-content>
          <Nuxt />
        </a-layout-content>
      </a-layout>
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

<style lang="stylus">
.frame-container
  width: 100vw
  height: 100vh

  h3.page-title
    display: inline-block
    font-size: 24px

  .page-title-link
    margin-left: 10px
    font-size: 14px
    color: rgb(63, 144, 247)
    cursor: pointer

  .pange-title-hint
    margin-left: 10px
    font-size: 12px
    color: #666

  .main-content
    .el-row:not(:first-child)
      margin-top: 20px
</style>
