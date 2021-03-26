<template>
  <div class="navbar">
    <a-row>
      <a-col :span="18">
        <a-breadcrumb>
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item v-for="(item, index) in path" :key="'breadcrumb' + String(index)">{{ item.title }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
      <a-col :span="6" class="text-right" style="line-height: 1.5">
        <a-dropdown :trigger="['click']">
          <span class="pointer">欢迎，{{ user.userName }}</span>
          <a-menu slot="overlay">
            <a-menu-item class="text-center" @click="logout">
              登出
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-col>
    </a-row>

  </div>
</template>

<script>
import { menuStructure } from '~/assets/config'
import { logout, gotoLogin } from '~/assets/api/ajax'

export default {
  data() {
    return {
      path: [],
      user: {},
    }
  },
  watch: {
    $route(to) {
      this.getPath(to.path)
    },
  },
  created() {
    this.getPath(this.$route.path)
    this.getUser()
  },
  methods: {
    getUser() {
      let user = JSON.parse(localStorage.getItem('userInfo'))
      this.user = user
    },
    logout() {
      logout()
      gotoLogin(this)
    },
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
              available: menu.available,
            })
            currentMenu = menu.children

            if (!currentMenu) {
              break
            }
          }
        }
      }
      this.path = currentPath
    },
  },
}
</script>

<style lang="stylus">
navbarHeight = 64px // height of navbar content

.navbar
  background: var(--color-3)
  height: navbarHeight // - 2 for border width
  padding: 20px
  color: #fff

  .ant-breadcrumb-link, .ant-breadcrumb-separator
    color: #fff

  .nav-row
    height: 100%

  span, div
    vertical-align: baseline

  .el-avatar
    vertical-align: middle
img
  display: inline-block
</style>
