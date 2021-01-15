<template>
  <el-container class="frame-container">
    <el-main class="content">
      <Nuxt />
    </el-main>
  </el-container>
</template>

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

  .content
    position: relative
</style>
