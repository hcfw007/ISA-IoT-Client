<template>
  <div class="sidebar">
    <img src="@/static/images/logo.png" alt="" class="logo">
    <a-menu
      mode="inline"
      theme="dark"
      :default-selected-keys="[index1]"
      :default-open-keys="[index0]"
    >
      <div :is="menu.children ? 'a-sub-menu' : 'a-menu-item'" v-for="(menu, index) in menuStructure" :key="'menu' + String(index)" @click="menuClick(menu)">
        <span v-if="menu.children" slot="title">{{ menu.title }}</span>
        <span v-else>{{ menu.title }}</span>
        <a-menu-item v-for="(submenu, subindex) in menu.children" :key="'menu' + String(index) + '-' + String(subindex)" @click="menuClick(submenu)">
          {{ submenu.title }}
        </a-menu-item>
      </div>
    </a-menu>
  </div>
</template>

<script>
import { menuStructure } from '@/assets/config'

export default {
  data() {
    return {
      menuStructure,
      index0: 'menu0',
      index1: 'menu0',
    }
  },
  watch: {
    $route(to) {
      this.setupMenu(to.path)
    },
  },
  beforeMount() {
    this.setupMenu(this.$route.path)
  },
  methods: {
    setupMenu(url) {
      let paths = url.split('/')
      let currentMenu = menuStructure

      let currentPath = 'menu'
      let level = 0
      // lv1
      for (let item of paths) {
        if (item.length === 0) {
          continue
        }
        for (let index in currentMenu) {
          let menu = currentMenu[index]
          if (menu.id === item) {
            if (currentPath.length > 4) {
              currentPath += '-'
            }
            currentPath += String(index)
            currentMenu = menu.children

            this['index' + String(level)] = currentPath
            if (!currentMenu) {
              break
            }
          }
        }
        level += 1
      }
    },
    menuClick(menu) {
      if (menu.available) {
        this.$router.push(menu.addr)
      }
    },
  },
}
</script>

<style lang="stylus">
.sidebar
  background: var(--color-1)
  height: 100%
  padding-top: 20px

  .logo
    text-align: center
    margin: 20px auto
    display: block

</style>
