<template>
  <div class="device-log">
    <a-row class="page-title-row">
      <a-col :span="24">
        <h4 class="page-title">设备日志</h4>
      </a-col>
    </a-row>
    <div class="main-content">
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
          <a-range-picker />
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
                <a-icon type="info-circle" />系统默认展示近15分钟最新产品的数据，修改筛选条件后请点击“<span style="color: rgb(0, 121, 254)">查询</span>”按钮
              </h5>
            </a-col>
            <a-col class="text-right" :span="16">
              <a-button type="primary">申请设备标识</a-button>
            </a-col>
          </a-row>
          <a-row class="block-content-row">
            <a-col :span="24">
              <a-table :columns="config.deviceLogListTable" :data-source="remoteData.deviceLogList" bordered :row-selection="contentControl.deviceLogListSelection" />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { deviceLogListTable } from '@/assets/tables'

export default {
  data() {
    return {
      config: {
        deviceLogListTable,
      },
      remoteData: {
        deviceLogList: [
        ],
      },
      contentControl: {
        deviceLogListSelection: {},
      },
    }
  },
}
</script>

<style lang="stylus">
.device-log
  .block-title
    color: #E98B25
</style>
