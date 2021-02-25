<template>
  <div class="product-detail">
    <a-row class="page-title-row">
      <a-col :span="24">
        <h4 class="page-title">产品详情</h4>
      </a-col>
    </a-row>
    <div class="main-content">
      <a-row class="block-normal block-white">
        <a-col :span="24" class="product-info-container">
          <div class="product-info-block">
            <a-avatar :size="48" icon="user" />
            <div class="product-name">
              <div>{{ remoteData.product.name }}</div>
              <div>产品类别：{{ remoteData.product.category_name }}</div>
            </div>
          </div>
          <div class="product-info-block">
            <div class="product-info-label">产品ID</div>
            <div class="product-info-value">{{ remoteData.product.pid }}</div>
          </div>
          <div class="product-info-block">
            <div class="product-info-label">节点类型</div>
            <div class="product-info-value">{{ enums.deviceTypeEnum.getDisplay(remoteData.product.device_node) }}</div>
          </div>
          <div class="product-info-block">
            <div class="product-info-label">设备协议</div>
            <div class="product-info-value">{{ enums.protocolEnum.getDisplay(remoteData.product.protocol_type) }}</div>
          </div>
          <div class="product-info-block">
            <div class="product-info-label">设备总数</div>
            <div class="product-info-value">{{ remoteData.totalDevice }}</div>
          </div>
          <div class="product-info-block">
            <div class="product-info-label">设备标识总数</div>
            <div class="product-info-value">{{ remoteData.totalDeviceIdentity }}</div>
          </div>
          <div class="product-info-block">
            <div class="product-info-datetime">·更新时间： <span class="product-info-datetime-value">{{ remoteData.product.updated_at.split('.')[0] }}</span></div>
            <div class="product-info-datetime">·添加时间： <span class="product-info-datetime-value">{{ remoteData.product.created_at.split('.')[0] }}</span></div>
          </div>
        </a-col>
      </a-row>
      <a-row class="block-normal block-white">
        <a-col :span="4">
          <div class="function-info-label">
            基础功能点
          </div>
          <div class="function-info-value">
            {{ 0 }}
          </div>
        </a-col>
        <a-col :span="2">
          <div class="seperator" />
        </a-col>
        <a-col :span="4">
          <div class="function-info-label">
            组合功能点
          </div>
          <div class="function-info-value">
            {{ 0 }}
          </div>
        </a-col>
        <a-col :span="14" class="function-info-operators text-right">
          <a-button :loading="contentControl.uploadingFunctionFile" @click="chooseImportFile">导入功能点</a-button>
          <a-button>导出功能点</a-button>
          <a-button type="primary">下载SDK</a-button>
          <input id="import" type="file" style="display: none" accept="application/json" @change="handleImportUpload($event)">
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { getProductDetailWithDeviceStastic, postFunctionFile, getFunctionList } from '@/assets/api/ajax'
import Product from '@/assets/classes/product'
import enums from '~/assets/classes/enums'

export default {
  data() {
    return {
      remoteData: {
        original: {
          product: {},
          functionList: {},
        },
        product: new Product({}),
        totalDeviceIdentity: 0,
        totalDevice: 0,
      },
      contentControl: {
        uploadingFunctionFile: false,
      },
      enums,
    }
  },
  created() {
    this.getProductDetail()
    this.getFunctionList()
  },
  methods: {
    async getProductDetail() {
      let pid =  this.$route.params.pid
      await getProductDetailWithDeviceStastic(this, {obj: this.remoteData.original, name: 'product'}, null, '', '', {pid})
      this.remoteData.product = new Product(this.remoteData.original.product.product)
      this.remoteData.totalDevice = this.remoteData.original.product.device_total
      this.remoteData.totalDeviceIdentity = this.remoteData.original.product.device_identity_total
    },
    async getFunctionList() {
      let pid =  this.$route.params.pid
      await getFunctionList(this, {obj: this.remoteData.original, name: 'functionList'}, null, '', '')
    },
    async handleImportUpload(event) {
      this.contentControl.uploadingFunctionFile = true
      let file = event.target.files[0]
      let data = new FormData()
      data.append('file', file)
      await postFunctionFile(data).then((response) => {
        let data = response.data
        if (data.code === 200) {
          this.$toast('导入成功', {
            customCss: {
              'background-color': '#67C23A',
              color: '#fff',
            },
          })
          this.getProductFunctionList()
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
      this.contentControl.uploadingFunctionFile = false
    },
    chooseImportFile() {
      document.getElementById('import').click()
    },
  },
}
</script>

<style lang="stylus">
.product-detail
  .product-info-container
    display: flex

    .product-info-block
      padding: 0 20px
      min-width: 140px
      vertical-align: middle

      .product-info-label, .product-info-value
        text-align: center

      .product-info-label
        font-size: 14px
        color: #999

      .product-info-value
        font-size: 12px
        font-weight: 700
        color: #666
        margin-top: 15px

      .product-info-datetime
        font-size: 12px
        color: #666

        &:not(:first-child)
          margin-top: 15px

        .product-info-datetime-value
          color: #999

      &:not(:first-child)
        border-left: solid 1px #bbb

    .product-name
      display: inline-block
      vertical-align: middle
      margin-left: 10px
      width: 240px

      div:not(:first-child)
        margin-top: 10px

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
</style>
