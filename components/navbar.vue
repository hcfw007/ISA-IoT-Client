<template>
  <div class="navbar">
    <a-breadcrumb>
      <a-breadcrumb-item>首页</a-breadcrumb-item>
      <a-breadcrumb-item v-for="(item, index) in path" :key="'breadcrumb' + String(index)">{{ item.title }}</a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script>
import { menuStructure } from '~/assets/config'

export default {
  data() {
    return {
      path: []
    }
  },
  watch: {
    $route(to, from) {
      this.getPath(to.path)
    }
  },
  created() {
    this.getPath(this.$route.path)
  },
  methods: {
    getPath(url) {
      let paths = url.split('/')
      let currentMenu = menuStructure

      let currentPath = []
      // lv1
      for (let item of paths) {
        if (item.length === 0) {
          continue
        }
        for (let index in currentMenu) {
          let menu = currentMenu[index]
          if (menu.id === item) {
            currentPath.push({
              title: menu.title,
              available: menu.available
            })
            currentMenu = menu.children

            if (!currentMenu) {
              break
            }
          }
        }
      }
      this.path = currentPath
    }
  }
}
</script>

<style lang="stylus">
navbarHeight = 70px // height of navbar content

.navbar
  background: var(--color-3)
  height: navbarHeight // - 2 for border width
  padding: 0 40px
  color: #fff

  .el-breadcrumb__inner
    color: #fff !important

  .nav-row
    height: 100%

  span, div
    vertical-align: baseline

  .el-avatar
    vertical-align: middle
img
  display: inline-block
</style>
