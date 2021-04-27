<template>
  <div class="device-detail">
    <a-row class="page-title-row">
      <a-col :span="12">
        <h4 class="page-title">设备详情</h4>
      </a-col>
      <a-col :span="12" class="text-right page-operators">
        <a-button class="page-title-button" @click="goBack"><a-icon type="left" />返回</a-button>
        <a-button class="page-title-button" @click="refresh"><a-icon type="sync" />刷新</a-button>
      </a-col>
    </a-row>
    <div class="main-content">
      <a-row class="block-normal block-white">
        <a-col :span="24" class="device-info-container">
          <div class="device-info-block">
            <a-avatar :size="48" icon="user" />
            <div class="device-name">
              <div>{{ remoteData.device.name }}</div>
              <div>所属产品：{{ remoteData.device.product_name }}</div>
            </div>
          </div>
          <div class="device-info-block">
            <div class="device-info-label">设备标识</div>
            <div class="device-info-value">{{ remoteData.device.sn }}</div>
          </div>
          <div class="device-info-block">
            <div class="device-info-label">所属产品ID</div>
            <div class="device-info-value">{{ remoteData.device.product_id }}</div>
          </div>
          <div class="device-info-block">
            <div class="device-info-label">节点类型</div>
            <div class="device-info-value">{{ enums.deviceTypeEnum.getDisplay(remoteData.device.product_node_type) }}</div>
          </div>
          <div class="device-info-block">
            <div class="device-info-label">IP地址</div>
            <div class="device-info-value">{{ remoteData.device.addr_ip }}</div>
          </div>
          <div class="device-info-block">
            <div class="device-info-label">设备状态</div>
            <div class="device-info-value">{{ enums.deviceStatusEnum.getDisplay(remoteData.device.status) }}</div>
          </div>
          <div class="device-info-block">
            <div class="device-info-label">设备密钥</div>
            <div class="device-info-value">
              <a-popover trigger="click">
                <template slot="content">
                  <div class="key-popover-container">
                    <a-row>
                      <a-col :span="24">{{ remoteData.device.dev_key }}</a-col>
                    </a-row>
                    <a-row style="margin-top: 10px">
                      <a-col :span="12" class="text-center key-action">
                        <span class="clickable" @click="copyToClipboard(remoteData.device.dev_key)">复制密钥</span>
                      </a-col>
                      <a-col :span="12" class="text-center key-action" @click="renewKey">
                        <span>更新密钥</span>
                      </a-col>
                    </a-row>
                  </div>
                </template>
                <span class="clickable">查看</span>
              </a-popover>
            </div>
          </div>
          <div class="device-info-block">
            <div class="device-info-datetime">·最近在线时间： <span class="device-info-datetime-value">{{ remoteData.device.operated_at.split('.')[0] }}</span></div>
            <div class="device-info-datetime">·设备激活时间： <span class="device-info-datetime-value">{{ remoteData.device.activated_at.split('.')[0] }}</span></div>
            <div class="device-info-datetime">·设备添加时间： <span class="device-info-datetime-value">{{ remoteData.device.created_at.split('.')[0] }}</span></div>
          </div>
        </a-col>
      </a-row>
      <a-row class="block-normal block-white">
        <a-col :span="24">
          <a-tabs>
            <a-tab-pane key="1" tab="属性">
              <a-row>
                <a-col :span="24">
                  <a-table
                    :columns="config.deviceFunctionTable"
                    :data-source="remoteData.deviceFunctionList"
                    bordered
                    :row-key="record => record.index"
                    :pagination="{ pageSize: 10, showTotal: total => `共 ${ total } 条`}"
                    class="functionPoint-table"
                  >
                    <span slot="functionType" slot-scope="record">{{ record.function_id ? '标准' : '自定义' }}</span>
                    <span slot="dataType" slot-scope="text">{{ enums.commonFunctionDataTypeEnum.getDisplay(text) }}</span>
                    <span slot="transferType" slot-scope="record">{{ record.getTransferType() }}</span>
                    <span slot="dataDefinition" slot-scope="record">{{ record.getdataDefinition() }}</span>
                    <span slot="updated_at" slot-scope="text">{{ text.split('.')[0].replace('T', ' ') }}</span>
                  </a-table>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="2" tab="事件">
              <a-row>
                <a-col :span="16">
                  <a-select default-value="all" class="regular-input" v-model="contentControl.filters.event_type">
                    <a-select-option value="all">
                      全部事件类型
                    </a-select-option>
                    <a-select-option v-for="(type, index) in enums.eventTypeEnum.transferList" :key="'eventType' + String(index)" :value="type">
                      {{ enums.eventTypeEnum.getDisplay(type) }}
                    </a-select-option>
                  </a-select>
                  <a-range-picker v-model="contentControl.filters.dateRange" />
                  <a-input placeholder="事件名称" class="regular-input" v-model="contentControl.filters.name"/>
                </a-col>
                <a-col :span="8" class="text-right">
                  <a-button type="primary" @click="executeFilter">查询</a-button>
                  <a-button @click="resetFilter">重置</a-button>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-table
                    :columns="config.deviceEventTable"
                    :data-source="filteredEventList"
                    bordered
                    :row-key="record => record.index"
                    :pagination="{ pageSize: 10, showTotal: total => `共 ${ total } 条`}"
                    class="functionPoint-table"
                  >
                    <span slot="functionType" slot-scope="record">{{ record.function_id ? '标准' : '自定义' }}</span>
                    <span slot="eventType" slot-scope="text">{{ enums.eventTypeEnum.getDisplay(text) }}</span>
                    <span slot="updated_at" slot-scope="text">{{ text.split('.')[0].replace('T', ' ') }}</span>
                    <span slot="params" slot-scope="record">{{ record.getParams() }}</span>
                  </a-table>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { getDeviceDetail, getDeviceFunctionList } from '@/assets/api/ajax'
import DeviceID from '@/assets/classes/DeviceID'
import { deviceFunctionTable, deviceEventTable } from '@/assets/tables'
import FunctionPoint from '@/assets/classes/FunctionPoint'
import { dateTimeFormatter } from '@/assets/utils'

const getBaseFilter = () => {
  return {
    event_type: 'all',
    dateRange: [],
    name: '',
  }
}

export default {
  data() {
    return {
      config: {
        deviceFunctionTable,
        deviceEventTable,
      },
      remoteData: {
        original: {
        },
        device: new DeviceID.Device(),
        deviceFunctionList: [],
        deviceEventList: [],
      },
      contentControl: {
        filters: getBaseFilter(),
        cachedFilters: getBaseFilter(),
      },
    }
  },
  async created() {
    let sn = this.$route.query.sn
    if (!sn) {
      this.$router.push('/deviceAccess/deviceManagement')
    }
    await this.getDeviceDetail()
    this.getDeviceFunctionList()
  },
  computed: {
    filteredEventList() {
      return this.remoteData.deviceEventList.filter(ele => {
        let filters = this.contentControl.cachedFilters
        if (filters.event_type !== 'all' && filters.event_type !== ele.event_type) {
          return false
        }
        if (filters.dateRange.length > 0) {
          let fromDateTime = new Date(dateTimeFormatter(new Date(filters.dateRange[0]), 'yyyy-MM-dd') + ' 00:00:00.000')
          let toDateTime = new Date(dateTimeFormatter(new Date(filters.dateRange[1]), 'yyyy-MM-dd') + ' 23:59:59.999')
          let actualTime = new Date(ele.updated_at)
          if (actualTime < fromDateTime || actualTime > toDateTime) {
            return false
          }
        }
        if (filters.name.length > 0 && !ele.name.includes(filters.name)) {
          return false
        }
        return true
      })
    },
  },
  methods: {
    executeFilter() {
      let filters = this.contentControl.filters
      this.contentControl.cachedFilters = JSON.parse(JSON.stringify(filters))
    },
    resetFilter() {
      this.contentControl.filters = getBaseFilter()
      this.contentControl.cachedFilters = getBaseFilter()
    },
    async getDeviceDetail() {
      let sn =  this.$route.query.sn
      await getDeviceDetail(this, {obj: this.remoteData.original, name: 'device'}, null, '', '', {sn})
      this.remoteData.device = new DeviceID.Device(this.remoteData.original.device)
    },
    async getDeviceFunctionList() {
      let sn = this.$route.query.sn
      let pid = this.remoteData.device.product_id
      await getDeviceFunctionList(this, {obj: this.remoteData.original, name: 'deviceFunctionList'}, { sn, pid }, '', '')
      let functionList = []
      let eventList = []
      let count = 0
      for (let item of this.remoteData.original.deviceFunctionList.functions) {
        count ++
        let func = new FunctionPoint(item)
        func.index = count
        if (func.fn_type === 'COMMON') {
          functionList.push(func)
        }
        if (func.fn_type === 'EVENT') {
          eventList.push(func)
        }
      }
      this.remoteData.deviceFunctionList = functionList
      this.remoteData.deviceEventList = eventList
    },
    copyToClipboard(text) {
      let input = document.createElement('input')
      input.value = text
      document.body.appendChild(input)
      input.select()
      document.execCommand('Copy')
      input.remove()
      this.$toast('已复制到剪切板！', {
        customCss: {
          'background-color': '#67C23A',
          color: '#fff',
        },
      })
    },
    async renewKey() {
      await this.getDeviceDetail()
      this.$toast('已更新', {
        customCss: {
          'background-color': '#67C23A',
          color: '#fff',
        },
      })
    },
  },
}
</script>

<style lang="stylus">
.device-detail
  .device-info-container
    display: flex

    .device-info-block
      padding: 0 20px
      min-width: 140px
      vertical-align: middle

      .device-info-label, .device-info-value
        text-align: center

      .device-info-label
        font-size: 14px
        color: #999

      .device-info-value
        font-size: 12px
        font-weight: 700
        color: #666
        margin-top: 15px

      .device-info-datetime
        font-size: 12px
        color: #666

        &:not(:first-child)
          margin-top: 5px

        .device-info-datetime-value
          color: #999

      &:not(:first-child)
        border-left: solid 1px #bbb


    .device-name
      display: inline-block
      vertical-align: middle
      margin-left: 10px
      width: 240px

      div:not(:first-child)
        margin-top: 10px

    @media screen and (max-width: 1919px)
      .device-info-block
        min-width: 80px

        .device-info-label, .device-info-value
          text-align: center

        .device-info-label
          font-size: 12px

        .device-info-value
          font-size: 10px

        .device-info-datetime
          font-size: 10px

      .device-name
        width: 150px
        font-size: 12px

  .function-info-label
    color: #666
    font-size: 16px

  .function-info-value
    font-size: 30px
    margin-top: 10px

  .function-info-operators
    .ant-btn
      padding: 10px 30px
      height: auto

      &:not(:first-child)
        margin-left: 30px

  .function-table-title
    font-size: 20px

  .function-table-subtitle
    margin-left: 10px
    font-size: 14px
    color: #666

  .add-function-button
    display: inline-block
    cursor: pointer

    &:not(:first-child)
      margin-left: 25px

    .add-function-icon
      color: var(--default-link-color)
      border: solid 1px var(--default-link-color)
      border-radius: 8px
      text-align: center
      height: 30px
      width: 30px
      line-height: 22px
      font-size: 24px
      font-weight: bold
      vertical-align: middle
      display: inline-block

    .add-function-text
      display: inline-block
      margin-left: 15px

.key-action
  cursor: pointer
  padding: 5px

  &:hover
    background-color: #eee
</style>
