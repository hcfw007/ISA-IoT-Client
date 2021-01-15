<template>
  <div class="main-content platform-overview">
    <a-row class="block-normal no-horizontal-padding">
      <a-col :span="24" class="platform-info-container">
        <div class="platform-info-block info-color-1">
          <div class="platform-info-value">
            22
          </div>
          <div class="platform-info-label">
            产品总数
          </div>
        </div>
        <div class="platform-info-block info-color-2">
          <div class="platform-info-value">
            22
          </div>
          <div class="platform-info-label">
            产品总数
          </div>
        </div>
        <div class="platform-info-block info-color-3">
          <div class="platform-info-value">
            22
          </div>
          <div class="platform-info-label">
            产品总数
          </div>
        </div>
        <div class="platform-info-block info-color-4">
          <div class="platform-info-value">
            22
          </div>
          <div class="platform-info-label">
            产品总数
          </div>
        </div>
        <div class="platform-info-block info-color-5">
          <div class="platform-info-value">
            22
          </div>
          <div class="platform-info-label">
            产品总数
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row class="block-white block-normal">
      <a-col :span="24">
        <a-row>
          <a-col :span="24">
            <h4 class="block-title">常用功能</h4>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="24" class="function-container">
            <div class="function-block">
              <img src="@/static/images/index/add-product.svg" alt="" class="function-img">
              <div class="function-title">
                添加产品
              </div>
            </div>
            <div class="function-block">
              <img src="@/static/images/index/add-product.svg" alt="" class="function-img">
              <div class="function-title">
                添加产品
              </div>
            </div>
            <div class="function-block">
              <img src="@/static/images/index/add-device.svg" alt="" class="function-img">
              <div class="function-title">
                添加设备
              </div>
            </div>
            <div class="function-block">
              <img src="@/static/images/index/device-identification.svg" alt="" class="function-img">
              <div class="function-title">
                设备标识申请
              </div>
            </div>
            <div class="function-block">
              <img src="@/static/images/index/device-debug.svg" alt="" class="function-img">
              <div class="function-title">
                设备调试
              </div>
            </div>
            <div class="function-block">
              <img src="@/static/images/index/device-log.svg" alt="" class="function-img">
              <div class="function-title">
                设备日志
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="block-white block-normal">
      <a-col :span="24">
        <a-row>
          <a-col :span="24">
            <h4 class="block-title">流程指南</h4>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-steps :current="current" @change="onStepChange($event)">
              <a-step description="添加产品" />
              <a-step description="定义物模型" />
              <a-step description="下载SDK" />
              <a-step description="申请设备标识" />
              <a-step description="下载设备标识" />
              <a-step description="添加设备" />
              <a-step description="设备调试" />
              <a-step description="完成" />
            </a-steps>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: 0
    }
  },
  methods: {
    onStepChange(current) {
      this.current = current
    }
  }
}
</script>

<style lang="stylus">
info-color-1 = rgba(129, 103, 245, 1)
info-color-2 = rgba(88, 163, 247, 1)
info-color-3 = rgba(245, 154, 35, 1)
info-color-4 = rgba(3, 182, 21, 1)
info-color-5 = rgba(251, 98, 96, 1)

.platform-overview
  .platform-info-container
    display: flex
    flex-direction: row
    justify-content: space-between

    .platform-info-block
      width: calc(20% - 20px)
      border-radius: 15px
      color: #fff
      padding: 25px

      for i in (1..5)
        &.info-color-{i}
          background-color: info-color- + i

    .platform-info-value
      font-size: 28px
      font-weight: 700

  .function-container
    display: flex
    flex-direction: row
    justify-content: flex-start

    .function-block
      width: 120px
      height: 160px
      border: solid 1px transparent
      text-align: center
      padding: 30px 0
      cursor: pointer

      &:hover
        background-color: #f9f9f9
        border-color: #e4e4e4

        .function-title
          color: 333

      .function-img
        margin: auto
        height: 50px
        width: 50px

      .function-title
        font-size: 14px
        font-weight: 400
        color: #666
        margin-top: 30px
</style>
