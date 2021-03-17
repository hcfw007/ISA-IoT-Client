<template>
  <div class="device-identification">
    <a-row class="page-title-row">
      <a-col :span="12">
        <h4 class="page-title">设备标识申请</h4>
      </a-col>
      <a-col :span="12" class="text-right page-operators">
        <a-button class="page-title-button" @click="refresh"><a-icon type="sync" />刷新</a-button>
      </a-col>
    </a-row>
    <div class="main-content">
      <a-row class="block-normal block-white">
        <a-col :span="16">
          <a-select default-value="all" class="regular-input" v-model="contentControl.filters.status">
            <a-select-option value="all">
              全部
            </a-select-option>
            <a-select-option value="APPROVED">
              已通过
            </a-select-option>
            <a-select-option value="APPLYING">
              待审批
            </a-select-option>
            <a-select-option value="REJECTED">
              已驳回
            </a-select-option>
          </a-select>
          <a-range-picker v-model="contentControl.filters.dateRange" />
          <a-input placeholder="请输入产品名称搜索" class="regular-input" v-model="contentControl.filters.product_name"/>
        </a-col>
        <a-col :span="8" class="text-right">
          <a-button type="primary" @click="executeFilter">查询</a-button>
          <a-button @click="resetFilter">重置</a-button>
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
              <a-button type="primary" @click="createApplication">申请设备标识</a-button>
            </a-col>
          </a-row>
          <a-row class="block-content-row">
            <a-col :span="24">
              <a-table :columns="config.deviceIdentificationListTable" :data-source="remoteData.deviceIdentificationList" bordered :rowKey="record => record.apply_sn">
                <span slot="created_at" slot-scope="text">{{ text.split('.')[0] }}</span>
                <div slot="operators" slot-scope="record">
                  <span class="clickable" @click="displayApplication(record)">查看详情</span>
                  <span class="clickable" v-if="record.status === 'APPROVED'" @click="downloadIdentification(record.apply_sn)">下载设备标识</span>
                  <a-tooltip placement="bottom" :title="record.remark || '未知'" trigger="click" v-if="record.status === 'REJECTED'">
                    <span class="clickable">查看驳回原因</span>
                  </a-tooltip>
                </div>
                <template slot="status" slot-scope="text">
                  <span class="good" v-if="text === 'APPROVED'">已通过</span>
                  <span class="bad" v-if="text === 'REJECTED'">已驳回</span>
                  <span class="pending" v-if="text === 'APPLYING'">待审批</span>
                </template>
              </a-table>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <identification-application-drawer :display="deviceApplicationDrawer.display" @close="drawerCloseHandler" @created="getDeviceIdentificationList" :mode="deviceApplicationDrawer.mode" :application="deviceApplicationDrawer.application" />
  </div>
</template>

<script>
import { deviceIdentificationListTable } from '@/assets/tables'
import { getDeviceIdentificationList, getIndustryList, getCategoryList, downloadIdentification } from '@/assets/api/ajax'
import { dateTimeFormatter } from '@/assets/utils'

const getBaseFilter = () => {
  return {
    status: 'all',
    dateRange: [],
    product_name: '',
  }
}

export default {
  data() {
    return {
      config: {
        deviceIdentificationListTable,
      },
      remoteData: {
        original: {
        },
        deviceIdentificationList: [],
      },
      deviceApplicationDrawer: {
        display: false,
        mode: 'new',
        application: null,
      },
      contentControl: {
        filters: getBaseFilter(),
        cachedFilters: getBaseFilter(),
      },
    }
  },
  created() {
    this.getDeviceIdentificationList()
    this.getStaticData()
    // this.getProductList()
  },
  methods: {
    async getDeviceIdentificationList() {
      let filters = this.contentControl.cachedFilters
      let filterObj = {}
      for (let key in filters) {
        if (key === 'dateRange') continue
        if (filters[key] !== 'all' && filters[key] !== '') {
          filterObj[key] = filters[key]
        }
      }
      if (filters.dateRange.length > 0) {
        filterObj.fromDateTime = dateTimeFormatter(new Date(filters.dateRange[0]), 'yyyy-MM-dd') + ' 00:00:00.000'
        filterObj.toDateTime = dateTimeFormatter(new Date(filters.dateRange[1]), 'yyyy-MM-dd') + ' 23:59:59.999'
      }
      await getDeviceIdentificationList(this, {obj: this.remoteData.original, name: 'deviceIdentificationList'}, filterObj)
      this.remoteData.deviceIdentificationList = this.remoteData.original.deviceIdentificationList.identities
    },
    executeFilter() {
      let filters = this.contentControl.filters
      this.contentControl.cachedFilters = JSON.parse(JSON.stringify(filters))
      this.getDeviceIdentificationList()
    },
    resetFilter() {
      this.contentControl.filters = getBaseFilter()
      this.contentControl.cachedFilters = getBaseFilter()
      this.getDeviceIdentificationList()
    },
    getStaticData() {
      getIndustryList(this, { obj: this.remoteData, name: 'industryList' }, {}, '', '获取行业列表失败')
      getCategoryList(this, { obj: this.remoteData, name: 'categoryList' }, {}, '', '获取类别列表失败')
    },
    drawerCloseHandler() {
      this.deviceApplicationDrawer.display = false
    },
    createApplication() {
      this.deviceApplicationDrawer.mode = 'new'
      this.deviceApplicationDrawer.display = true
    },
    displayApplication(application) {
      this.deviceApplicationDrawer.mode = 'display'
      this.deviceApplicationDrawer.application = application
      this.deviceApplicationDrawer.display = true
    },
    downloadIdentification(sn) {
      downloadIdentification(sn)
    },
  },
}
</script>
