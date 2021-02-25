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
            <div class="product-info-value">{{  }}</div>
          </div>
          <div class="product-info-block">
            <div class="product-info-label">设备标识总数</div>
            <div class="product-info-value">{{  }}</div>
          </div>
          <div class="product-info-block">
            <div class="product-info-datetime">·更新时间： <span class="product-info-datetime-value">{{ remoteData.product.updated_at.split('.')[0] }}</span></div>
            <div class="product-info-datetime">·添加时间： <span class="product-info-datetime-value">{{ remoteData.product.created_at.split('.')[0] }}</span></div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { getProductDetail } from '@/assets/api/ajax'
import Product from '@/assets/classes/product'
import enums from '~/assets/classes/enums'

export default {
  data() {
    return {
      remoteData: {
        originalProduct: {},
        product: new Product({}),
      },
      enums,
    }
  },
  created() {
    this.getProductDetail()
  },
  methods: {
    async getProductDetail() {
      let pid =  this.$route.params.pid
      if (!pid) {
        this.$toase('请先选择产品进行查看')
        this.$router.push('/deviceAccess/productManagement/')
        return
      }
      await getProductDetail(this, {obj: this.remoteData, name: 'originalProduct'}, null, '', '', {pid})
      this.remoteData.product = new Product(this.remoteData.originalProduct)
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
</style>
