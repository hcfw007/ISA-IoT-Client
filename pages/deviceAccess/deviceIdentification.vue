<template>
  <div class="device-identification">
    <a-row class="page-title-row">
      <a-col :span="24">
        <h4 class="page-title">设备标识申请</h4>
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
          <a-range-picker />
          <a-select default-value="all" class="regular-input">
            <a-select-option value="all">
              全部
            </a-select-option>
          </a-select>
          <a-input placeholder="请输入产品名称搜索" class="regular-input" />
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
                设备标识申请列表
              </h5>
            </a-col>
            <a-col class="text-right" :span="16">
              <a-button type="primary">申请设备标识</a-button>
            </a-col>
          </a-row>
          <a-row class="block-content-row">
            <a-col :span="24">
              <a-table :columns="config.deviceIdentificationListTable" :data-source="remoteData.deviceIdentificationList" bordered :row-selection="contentControl.deviceIdentificationListSelection" />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { deviceIdentificationListTable } from '@/assets/tables'

export default {
  data() {
    return {
      config: {
        deviceIdentificationListTable,
      },
      remoteData: {
        deviceIdentificationList: [
        ],
      },
      contentControl: {
        deviceIdentificationListSelection: {},
      },
    }
  },
}
</script>
