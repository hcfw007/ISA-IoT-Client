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
              {{ remoteData.deviceStatistics.device_amount }}
            </div>
          </div>
          <div class="device-info-block">
            <div class="device-info-label">
              <span class="device-info-dot dot-color-2">●</span>
              已激活设备数
            </div>
            <div class="device-info-value">
              {{ remoteData.deviceStatistics.activated_amount }}
            </div>
          </div>
          <div class="device-info-block">
            <div class="device-info-label">
              <span class="device-info-dot dot-color-3">●</span>
              在线设备数
            </div>
            <div class="device-info-value">
              {{ remoteData.deviceStatistics.online_amount }}
            </div>
          </div>
          <div class="device-info-block">
            <div class="device-info-label">
              <span class="device-info-dot dot-color-4">●</span>
              离线设备数
            </div>
            <div class="device-info-value">
              {{ remoteData.deviceStatistics.offline_amount }}
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row class="block-normal block-white">
        <a-col :span="16">
          <a-select default-value="all" class="regular-input" v-model="contentControl.filters.pid">
            <a-select-option value="all">
              全部产品
            </a-select-option>
            <a-select-option v-for="(item, index) in remoteData.productList" :key="`product${ index }`" :value="item.pid">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-select default-value="all" class="regular-input" v-model="contentControl.filters.status">
            <a-select-option value="all">
              全部设备状态
            </a-select-option>
            <a-select-option value="ON_LINE">
              在线
            </a-select-option>
            <a-select-option value="OFF_LINE">
              离线
            </a-select-option>
            <a-select-option value="UNACTIVATED ">
              未激活
            </a-select-option>
          </a-select>
          <a-select default-value="all" class="regular-input">
            <a-select-option value="all">
              全部节点类型
            </a-select-option>
            <a-select-option v-for="(item, index) of enums.deviceTypeEnum.transferList" :key="`deviceType${ index }`" :value="item">
              {{ enums.deviceTypeEnum.getDisplay(item) }}
            </a-select-option>
          </a-select>
          <a-input placeholder="请输入完整设备标识或后缀搜索" class="regular-input" v-model="contentControl.filters.sn" />
          <a-input placeholder="请输入设备名称搜索" class="regular-input" v-model="contentControl.filters.name" />
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
                设备列表
              </h5>
            </a-col>
            <a-col class="text-right" :span="16">
              <a-button @click="confirmDeletion(deleteConfirmationModal.tableSelectedDevices)">批量删除</a-button>
              <a-button @click="exportDevices">导出设备</a-button>
              <a-button @click="importDevice">批量导入设备</a-button>
              <a-button type="primary" @click="addDevice">添加单个设备</a-button>
            </a-col>
          </a-row>
          <a-row class="block-content-row">
            <a-col :span="24">
              <a-table
                :columns="config.deviceListTable"
                :data-source="remoteData.deviceList"
                bordered
                :row-key="record => record.sn"
                :row-selection="{ selectedRowKeys: contentControl.deviceListSelection, onChange: onDeviceTableSelectChange }"
              >
                <span slot="node" slot-scope="text">{{ enums.deviceTypeEnum.getDisplay(text) }}</span>
                <span slot="latest_at" slot-scope="text">{{ text.split('.')[0] }}</span>
                <span slot="created_at" slot-scope="text">{{ text.split('.')[0] }}</span>
                <template slot="status" slot-scope="text">
                  <span v-if="text === 'UNACTIVATED'" class="pending">未激活</span>
                  <span v-if="text === 'ON_LINE'" class="good">在线</span>
                  <span v-if="text === 'OFF_LINE'" class="bad">离线</span>
                </template>
                <div slot="operators" slot-scope="record">
                  <span class="clickable"><nuxt-link :to="`/deviceAccess/deviceManagemet/${ record.sn }`">查看详情</nuxt-link></span>
                  <span class="clickable" @click="confirmDeletion([record])">删除</span>
                </div>
              </a-table>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <a-drawer
      title="添加单个设备"
      :visible="deviceAddDrawer.display"
      :width="drawerConfig.width"
      :body-style="{ paddingBottom: '80px' }"
      @close="deviceAddDrawer.display = false"
    >
      <a-form
        :form="deviceAddDrawer.deviceAddForm"
        :layout="'vertical'"
        class="drawer-form"
      >
        <a-form-item label="所属产品">
          <a-select placeholder="请选择产品" v-decorator="['pid', { rules: [ validators.requiredRuleFactory('产品', 'select')]}]" @change="productChangeHandler">
            <a-select-option v-for="(item, index) in remoteData.productList" :key="`product${ index }`" :value="item.pid">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <span>*添加设备需要消耗已申请的设备标识，添加设备时请确保有充足的可用设备标识。</span>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col :span="16">
              <span>剩余可用设备标识：{{ deviceAddDrawer.identificationNumberAvailable }}</span>
            </a-col>
            <a-col :span="8" class="text-right">
              <span class="clickable" @click="deviceApplicationDrawer.display = true">申请设备标识</span>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="设备名称">
          <a-input v-decorator="['name', { rules: [ validators.requiredRuleFactory('设备名称'), validators.maxWordsFactory(32), validators.legalCharTypeFactory(['letter', 'number', 'hyphen', 'underline']), validators.startWithLetter ]}]" placeholder="1-32个字符，英文字母、数字及符号_-，以英文字母开头" />
        </a-form-item>
        <a-form-item label="设备标识">
          <a-input v-decorator="['sn']" placeholder="请填写完整设备标识，若不填写则自动分配" />
        </a-form-item>
        <a-form-item label="设备位置">
          <a-input v-decorator="['addr']" placeholder="请填写完整设备地址" />
          <a-row>
            <a-col :span="12"><span class="clickable" @click="showMap">地图选点确定经纬度</span></a-col>
            <a-col :span="12" class="text-right">{{ deviceAddDrawer.location }}</a-col>
          </a-row>
        </a-form-item>
      </a-form>
      <div class="drawer-feet">
        <a-button @click="deviceAddDrawer.display = false" class="dismiss-btn">取消</a-button>
        <a-button type="primary" class="execute-btn" @click="saveDevice" :loading="deviceAddDrawer.posting">保存</a-button>
      </div>
    </a-drawer>
    <identification-application-drawer :display="deviceApplicationDrawer.display" @close="drawerCloseHandler" :mode="'new'" />
    <a-drawer
      title="确定经纬度"
      :visible="mapDrawer.display"
      :width="drawerConfig.width"
      :body-style="{ paddingBottom: '80px' }"
      @close="mapDrawer.display = false"
    >
      <a-row>
        <a-col :span="16">
          <a-input v-model="mapDrawer.keyword"></a-input>
        </a-col>
        <a-col :span="7" :offset="1">
          <a-button type="primary" @click="showKeywordAddress">查询</a-button>
        </a-col>
      </a-row>
      <a-row style="margin: 10px 0">
        <a-col :span="24">
          <baidu-map
            :center="mapDrawer.center"
            :zoom="mapDrawer.zoom"
            @ready="mapReadyHandler"
            ak="YM2tRU5LpghvIzRrASnmxXNWV8d9ztLS"
            style="width: 100%; height: 400px"
            :scroll-wheel-zoom="true"
            @moving="syncCenterAndZoom"
            @moveend="syncCenterAndZoom"
            @zoomend="syncCenterAndZoom"
          >
            <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
          </baidu-map>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="20">
          <span>当前地图中心坐标点：</span>
          <a-select v-model="mapDrawer.latMark">
            <a-select-option value="N">北纬</a-select-option>
            <a-select-option value="S">南纬</a-select-option>
          </a-select>
          <a-input-number v-model="mapDrawer.lat" style="width: 100px !important" />
          <a-select v-model="mapDrawer.lngMark">
            <a-select-option value="E">东经</a-select-option>
            <a-select-option value="W">西经</a-select-option>
          </a-select>
          <a-input-number v-model="mapDrawer.lng" style="width: 100px !important" />
        </a-col>
        <a-col :span="4">
          <a-button type="primary" @click="setMapCoord">查看</a-button>
        </a-col>
      </a-row>
      <div class="drawer-feet">
        <a-button @click="mapDrawer.display = false" class="dismiss-btn">取消</a-button>
        <a-button type="primary" class="execute-btn" @click="saveAddress">确定</a-button>
      </div>
    </a-drawer>
    <a-modal v-model="deleteConfirmationModal.display" title="操作确认" class="deleteConfirmationModal">
      <template slot="footer">
        <a-button @click="deleteConfirmationModal.display = false">
          取消
        </a-button>
        <a-button type="danger" @click="executeDelete" :loading="deleteConfirmationModal.loading">
          删除
        </a-button>
      </template>
      <a-row class="title-row">
        <a-col :span="2"><a-icon type="question-circle" /></a-col>
        <a-col :span="22">确认删除以下产品？</a-col>
      </a-row>
      <a-row>
        <a-col :span="22" :offset="2">
          {{ deleteConfirmationModal.deviceNameStr }}
        </a-col>
      </a-row>
    </a-modal>
    <a-drawer
      title="导入设备"
      :visible="deviceImportDrawer.display"
      :width="drawerConfig.width"
      :body-style="{ paddingBottom: '80px' }"
      @close="deviceImportDrawer.display = false"
    >
      <a-form
        :layout="'vertical'"
        class="drawer-form"
      >
        <a-form-item label="所属产品" required>
          <a-select placeholder="请选择产品" v-model="deviceImportDrawer.pid" @change="productChangeHandler">
            <a-select-option v-for="(item, index) in remoteData.productList" :key="`product${ index }`" :value="item.pid">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <span>*添加设备需要消耗已申请的设备标识，添加设备时请确保有充足的可用设备标识。</span>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col :span="16">
              <span>剩余可用设备标识：{{ deviceAddDrawer.identificationNumberAvailable }}</span>
            </a-col>
            <a-col :span="8" class="text-right">
              <span class="clickable" @click="deviceApplicationDrawer.display = true">申请设备标识</span>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <p>
            使用模板文件批量导入设备，格式.xlsx，最大2M，单次最多可添加500个设备
          </p>
          <p>
            设备名称：1-32个字符，英文字母、数字及符号_-，以英文字母开头
          </p>
          <p>
            设备描述：1-500个字符
          </p>
        </a-form-item>
        <a-form-item>
          <span class="clickable" @click="simpleDownload('/devmng/devices/template')">
            模板文件下载
          </span>
        </a-form-item>
        <a-form-item label="上传设备信息文件" required :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <span class="clickable" @click="chooseImportFile">上传文件</span>
          <input id="import" type="file" style="display: none" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" @change="handleImportUpload($event)">
        </a-form-item>
        <a-form-item>
          <span>{{ deviceImportDrawer.filename }}</span>
          <a-progress :percent="deviceImportDrawer.progress" />
        </a-form-item>
      </a-form>
      <div class="drawer-feet">
        <a-button @click="deviceImportDrawer.display = false" class="dismiss-btn">确定</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { deviceListTable } from '@/assets/tables'
import { getDeviceList, postDevice, getProductList, getDeviceIdentificationNumberAvailable, deleteDevice, getDeviceStatistics, exportDevices, postDeviceFile } from '@/assets/api/ajax'
import Product from '@/assets/classes/Product'
import DeviceID from '@/assets/classes/DeviceID'
import BaiduMap from 'vue-baidu-map/components/map/Map'
import { BmCityList } from 'vue-baidu-map/components'

const getBaseFilter = () => {
  return {
    pid: 'all',
    status: 'all',
    product_node_type: 'all',
    sn: '',
    name: '',
  }
}

export default {
  components: {
    BaiduMap,
    BmCityList,
  },
  data() {
    return {
      config: {
        deviceListTable,
      },
      remoteData: {
        original: {
        },
        deviceList: [],
        productList: [],
        deviceStatistics: {},
      },
      contentControl: {
        deviceListSelection: [],
        filters: getBaseFilter(),
        cachedFilters: getBaseFilter(),
        uploadingDeviceFile: false,
      },
      deviceAddDrawer: {
        display: false,
        posting: false,
        deviceAddForm: this.$form.createForm(this, { name: 'deviceAddForm' }),
        identificationNumberAvailable: 0,
        location: '',
      },
      deviceImportDrawer: {
        display: false,
        posting: false,
        pid: undefined,
        progress: 0,
        filename: '',
      },
      deviceApplicationDrawer: {
        display: false,
      },
      mapDrawer: {
        display: false,
        zoom: 15,
        center: {lng: 0, lat: 0},
        keyword: '',
        latMark: 'N',
        lngMark: 'E',
        lat: 0,
        lng: 0,
        geocoder: null,
      },
      deleteConfirmationModal: {
        display: false,
        deviceNameStr: '',
        devices: [],
        tableSelectedDevices: [],
        loading: false,
      },
    }
  },
  async created() {
    this.getDeviceList()
    this.getDeviceStatistics()
    await this.getProductList()
    if (this.$route.query.productPid) {
      let pid = this.$route.query.productPid
      this.contentControl.filters.pid = pid
      this.executeFilter()
    }
  },
  methods: {
    importDevice() {
      this.deviceImportDrawer.display = true
      this.deviceImportDrawer.pid = undefined
      this.deviceImportDrawer.filename = ''
      this.deviceImportDrawer.progress = 0
    },
    executeFilter() {
      let filters = this.contentControl.filters
      this.contentControl.cachedFilters = JSON.parse(JSON.stringify(filters))
      this.getDeviceList()
    },
    exportDevices() {
      let filters = this.contentControl.cachedFilters
      let filterObj = {}
      for (let key in filters) {
        if (filters[key] !== 'all' && filters[key] !== '') {
          filterObj[key] = filters[key]
        }
      }
      exportDevices(filterObj).catch((err) => {
        this.$toast('导出失败，消息为' + err.message, {
          customCss: {
            'background-color': '#E6A23C',
            color: '#fff',
          },
        })
      })
    },
    resetFilter() {
      this.contentControl.filters = getBaseFilter()
      this.contentControl.cachedFilters = getBaseFilter()
      this.getDeviceList()
    },
    onDeviceTableSelectChange(selectedRowKeys) {
      this.contentControl.deviceListSelection = selectedRowKeys
      let deviceSelectedList = []
      for (let sn of selectedRowKeys) {
        for (let device of this.remoteData.deviceList) {
          if (device.sn === sn) {
            deviceSelectedList.push(device)
            break
          }
        }
      }
      this.deleteConfirmationModal.tableSelectedDevices = deviceSelectedList
    },
    async getDeviceList() {
      let filters = this.contentControl.cachedFilters
      let filterObj = {}
      for (let key in filters) {
        if (filters[key] !== 'all' && filters[key] !== '') {
          filterObj[key] = filters[key]
        }
      }
      await getDeviceList(this, {obj: this.remoteData.original, name: 'deviceList'}, filterObj)
      this.remoteData.deviceList = this.remoteData.original.deviceList.devices
      let deviceList = []
      for (let item of this.remoteData.original.deviceList.devices) {
        deviceList.push(new DeviceID.Device(item))
      }
      this.remoteData.deviceList = deviceList
    },
    async getDeviceStatistics() {
      await getDeviceStatistics(this, {obj: this.remoteData.original, name: 'deviceStatistics'})
      this.remoteData.deviceStatistics = this.remoteData.original.deviceStatistics
    },
    addDevice() {
      this.deviceAddDrawer.deviceAddForm.resetFields()
      this.deviceAddDrawer.identificationNumberAvailable = 0
      this.deviceAddDrawer.location = ''
      this.mapDrawer.center.lng = 116.404
      this.mapDrawer.center.lat = 39.915
      this.mapDrawer.zoom = 15
      this.deviceAddDrawer.display = true
    },
    async getProductList() {
      await getProductList(this, { obj: this.remoteData.original, name: 'productList' })
      let productList = []
      for (let item of this.remoteData.original.productList.products) {
        productList.push(new Product(item))
      }
      this.remoteData.productList = productList
    },
    drawerCloseHandler() {
      this.deviceApplicationDrawer.display = false
    },
    async productChangeHandler(event) {
      let pid = event
      await getDeviceIdentificationNumberAvailable(this, { obj: this.remoteData.original, name: 'inentificationNumberAvailable'}, null, '', '获取设备标识数量失败', {pid})
      this.deviceAddDrawer.identificationNumberAvailable = this.remoteData.original.inentificationNumberAvailable.count
    },
    mapReadyHandler({BMap, map}) {
      this.mapDrawer.center.lng = 116.404
      this.mapDrawer.center.lat = 39.915
      this.mapDrawer.zoom = 15
      this.mapDrawer.geocoder = new BMap.Geocoder()
    },
    showMap() {
      this.mapDrawer.display = true
    },
    setMapCoord() {
      let lng = this.mapDrawer.lng
      if (this.mapDrawer.lngMark === 'W') {
        lng = -lng
      }
      let lat = this.mapDrawer.lat
      if (this.mapDrawer.latMark === 'S') {
        lat = - lat
      }
      this.mapDrawer.center.lng = lng
      this.mapDrawer.center.lat = lat
    },
    syncCenterAndZoom(e) {
      const {lng, lat} = e.target.getCenter()
      this.mapDrawer.center.lng = lng
      this.mapDrawer.center.lat = lat
      this.zoom = e.target.getZoom()
      this.mapDrawer.lng = Math.abs(lng)
      this.mapDrawer.lat = Math.abs(lat)
      this.mapDrawer.lngMark = lng < 0 ? 'W' : 'E'
      this.mapDrawer.latMark = lng < 0 ? 'S' : 'N'
    },
    showKeywordAddress() {
      let that = this
      let keyword = this.mapDrawer.keyword
      let geocoder = this.mapDrawer.geocoder
      geocoder.getPoint(keyword, function(point) {
        if (point) {
          that.showMapPoint(point)
        } else {
          that.$toast('所填地址无法解析出结果，请检查')
        }
      })
    },
    showMapPoint({lng, lat}) {
      this.mapDrawer.center.lng = lng
      this.mapDrawer.center.lat = lat
      this.mapDrawer.zoom = 16
    },
    saveAddress() {
      let lng = this.mapDrawer.center.lng
      let lat = this.mapDrawer.center.lat
      let str = `${lat > 0 ? '北纬' : '南纬'} ${lat.toFixed(2)}度, ${lng > 0 ? '东经' : '西经'} ${lng.toFixed(2)}度`
      this.deviceAddDrawer.location = str
      this.mapDrawer.display = false
    },
    async saveDevice() {
      this.deviceAddDrawer.deviceAddForm.validateFields(async (err, values) => {
        console.log('1')
        if (err) return
        this.deviceAddDrawer.posting = true
        values.location = this.deviceAddDrawer.location
        let result = await postDevice(this, values, '添加设备成功', '添加设备失败')
        if (result.flag) {
          this.deviceAddDrawer.display = false
          this.getDeviceList()
        }
        this.deviceAddDrawer.posting = false
      })
    },
    confirmDeletion(devices) {
      if (devices.length === 0) {
        this.$toast('请先选择设备')
        return
      }
      let str = ''
      for (let index in devices) {
        let item = devices[index]
        // if (item.status === 'ON_LINE') {
        //   this.$toast(`无法删除${ item.name }， 该设备目前在线`)
        //   return
        // }
        if (index > 0) {
          str += '，'
        }
        str += item.name
      }
      this.deleteConfirmationModal.deviceNameStr = str
      this.deleteConfirmationModal.devices = devices
      this.deleteConfirmationModal.display = true
    },
    async executeDelete() {
      let devices = this.deleteConfirmationModal.devices
      let promises = []
      this.deleteConfirmationModal.loading = true
      for (let device of devices) {
        promises.push(deleteDevice(this, null, `删除${ device.name }成功`, `删除${ device.name }失败`, {sn: device.sn}))
      }
      await Promise.all(promises)
      this.deleteConfirmationModal.loading = false
      this.deleteConfirmationModal.display = false
      this.getDeviceList()
    },
    chooseImportFile() {
      if (!this.deviceImportDrawer.pid) {
        this.$toast('请先选择产品', {
          customCss: {
            'background-color': '#E6A23C',
            color: '#fff',
          },
        })
        return
      }
      document.getElementById('import').click()
    },
    async handleImportUpload(event) {
      this.contentControl.uploadingDeviceFile = true
      let file = event.target.files[0]
      let data = new FormData()
      this.deviceImportDrawer.filename = file.name
      data.append('file', file)
      data.append('pid', this.deviceImportDrawer.pid)
      await postDeviceFile(data, (progress) => {
        this.deviceImportDrawer.progress = progress
      }).then((response) => {
        let data = response.data
        if (data.code === 200) {
          this.$toast('导入成功', {
            customCss: {
              'background-color': '#67C23A',
              color: '#fff',
            },
          })
          this.getDeviceList()
        } else {
          this.$toast('导入失败， 消息为：' + data.msg, {
            customCss: {
              'background-color': '#E6A23C',
              color: '#fff',
            },
          })
        }
      }).catch((err) => {
        console.log(err)
        this.$toast('导入失败', {
          customCss: {
            'background-color': '#E6A23C',
            color: '#fff',
          },
        })
      })
      this.contentControl.uploadingDeviceFile = false
    },

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
