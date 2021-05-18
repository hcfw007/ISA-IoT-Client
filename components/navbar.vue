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
          <span class="pointer">欢迎，{{ user.name }}</span>
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
import { logout, gotoLogin, getUserInfo } from '~/assets/api/ajax'

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
    async getUser() {
      let {result, payload} = await getUserInfo(this)
      let user = payload
      if (!user) {
        user = {}
        gotoLogin(this)
      }
      this.user = user
      localStorage.setItem('userInfo', JSON.stringify(user))
      if (user.verified === 3) {
        this.$toast('请先进行实名认证，方能使用系统功能', {
          customCss: {
            'background-color': '#E6A23C',
            color: '#fff',
          },
        })
        this.$router.push('/user/identification')
      }
      if (user.verified === 0) {
        this.$toast('实名认证审核中，请耐心等待', {
          customCss: {
            'background-color': '#E6A23C',
            color: '#fff',
          },
        })
        this.$router.push('/user/result')
      }
      if (user.verified === 2) {
        this.$toast('实名认证审核失败，请查看原因', {
          customCss: {
            'background-color': '#E6A23C',
            color: '#fff',
          },
        })
        this.$router.push('/user/result')
      }
    },
    logout() {
      logout()
      localStorage.removeItem('userInfo')
      gotoLogin(this, '登出成功')
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
