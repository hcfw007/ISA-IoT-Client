<template>
  <div class="device-management">
    <a-row class="page-title-row">
      <a-col :span="24">
        <h4 class="page-title">设备管理</h4>
      </a-col>
    </a-row>
    <div class="main-content">
      <a-row class="block-normal no-horizontal-padding">
        <a-col :span="24" class="device-info-container">
          <div class="device-info-block">
            <div class="device-info-label">
              <span class="device-info-dot dot-color-1">●</span>
              设备总数
            </div>
            <div class="device-info-value">
              2000
            </div>
          </div>
          <div class="device-info-block">
            <div class="device-info-label">
              <span class="device-info-dot dot-color-2">●</span>
              已激活设备数
            </div>
            <div class="device-info-value">
              1000
            </div>
          </div>
          <div class="device-info-block">
            <div class="device-info-label">
              <span class="device-info-dot dot-color-3">●</span>
              在线设备数
            </div>
            <div class="device-info-value">
              20
            </div>
          </div>
          <div class="device-info-block">
            <div class="device-info-label">
              <span class="device-info-dot dot-color-4">●</span>
              离线设备数
            </div>
            <div class="device-info-value">
              980
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row class="block-normal block-white">
        <a-col :span="16">
          <a-select default-value="all" class="regular-input">
            <a-select-option value="all">
              全部
            </a-select-option>
          </a-select>
          <a-select default-value="all" class="regular-input">
            <a-select-option value="all">
              全部
            </a-select-option>
          </a-select>
          <a-select default-value="all" class="regular-input">
            <a-select-option value="all">
              全部
            </a-select-option>
          </a-select>
          <a-input placeholder="请输入完整设备标识或后缀搜索" class="regular-input" />
          <a-input placeholder="请输入设备名称搜索" class="regular-input" />
        </a-col>
        <a-col :span="8" class="text-right">
          <a-button type="primary">查询</a-button>
          <a-button>重置</a-button>
        </a-col>
      </a-row>
      <a-row class="block-normal block-white">
        <a-col :span="24">
          <a-row class="block-control-row">
            <a-col :span="8">
              <h5 class="block-title">
                设备列表
              </h5>
            </a-col>
            <a-col class="text-right" :span="16">
              <a-button>批量删除</a-button>
              <a-button>导出设备</a-button>
              <a-button>批量导入设备</a-button>
              <a-button type="primary">添加单个设备</a-button>
            </a-col>
          </a-row>
          <a-row class="block-content-row">
            <a-col :span="24">
              <a-table :columns="config.deviceListTable" :data-source="remoteData.deviceList" bordered :row-selection="contentControl.deviceListSelection" />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { deviceListTable } from '@/assets/tables'

export default {
  data() {
    return {
      config: {
        deviceListTable,
      },
      remoteData: {
        deviceList: [
        ],
      },
      contentControl: {
        deviceListSelection: {},
      },
    }
  },
}
</script>

<style lang="stylus">
dot-color-1 = #58A3F7
dot-color-2 = #FFA94C
dot-color-3 = #4BCED0
dot-color-4 = #FB6260

.device-management
  .device-info-container
    display: flex
    flex-direction: row
    justify-content: flex-start

    .device-info-block
      width: 170px
      padding: 25px
      background-color: #fff
      border: solid 1px #eee
      text-align: center

      for i in (1..5)
        .dot-color-{i}
          color: dot-color- + i

      &:not(:first-child)
        margin-left: 30px

    .device-info-label
      font-size: 14px
      color: #999

    .device-info-value
      font-size: 28px
</style>
