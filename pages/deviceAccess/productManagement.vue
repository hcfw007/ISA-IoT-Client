<template>
  <div class="product-management">
    <a-row class="page-title-row">
      <a-col :span="24">
        <h4 class="page-title">产品管理</h4>
      </a-col>
    </a-row>
    <div class="main-content">
      <a-row class="block-normal block-white">
        <a-col :span="16">
          <a-select default-value="all" class="regular-input">
            <a-select-option value="all">
              全部行业类型
            </a-select-option>
            <a-select-option v-for="(item, index) in remoteData.industryList" :key="`industry${ index }`" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-select default-value="all" class="regular-input">
            <a-select-option value="all">
              全部发布状态
            </a-select-option>
            <a-select-option value="true">
              已发布
            </a-select-option>
            <a-select-option value="false">
              未发布
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
                产品列表
              </h5>
            </a-col>
            <a-col class="text-right" :span="16">
              <a-button>批量删除</a-button>
              <a-button type="primary" @click="createProduct">添加产品</a-button>
            </a-col>
          </a-row>
          <a-row class="block-content-row">
            <a-col :span="24">
              <a-table
                :columns="config.productListTable"
                :data-source="remoteData.productList.products"
                bordered
                :row-selection="contentControl.productListSelection"
                :row-key="record => record.pid"
                :pagination="{ pageSize: 10, showTotal: total => `共 ${ total } 条`}"
                class="product-table"
              >
                <span slot="protocol" slot-scope="text">{{ enums.protocolEnum.getDisplay(text) }}</span>
                <span slot="created_at" slot-scope="text">{{ text.split('.')[0] }}</span>
                <span slot="release_status" slot-scope="record">{{ record.publish ? '已发布' : '未发布' }}</span>
                <div slot="operators" slot-scope="record">
                  <span class="clickable">查看详情</span>
                  <span class="clickable" v-if="record.publish">申请设备标识</span>
                  <span class="clickable">设备管理</span>
                  <span class="clickable">编辑</span>
                  <a-popconfirm title="确定要删除吗？" v-if="!record.publish">
                    <span class="clickable">删除</span>
                  </a-popconfirm>
                  <span class="clickable" v-if="!record.publish">发布</span>
                </div>
              </a-table>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <a-drawer
      :title="`${productDrawer.mode}产品`"
      :visible="productDrawer.display"
      :width="drawerConfig.width"
      :body-style="{ paddingBottom: '80px' }"
    >
      <a-form
        :form="productDrawer.productForm"
        :label-col="drawerConfig.form.labelCol"
        :wrapper-col="drawerConfig.form.wrapperCol"
        class="drawer-form"
      >
        <a-form-item label="产品名称">
          <a-input v-decorator="['name', { rules: [ validators.requiredRuleFactory('产品名称') ]}]" placeholder="请输入产品名称" />
        </a-form-item>
        <a-form-item label="行业-产品类别" style="margin-bottom: 0" required>
          <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
            <a-select v-decorator="['industry_id', { rules: [ validators.requiredRuleFactory('产品行业', 'select')]}]" placeholder="请选择产品行业">
              <a-select-option v-for="(item, index) in remoteData.industryList" :key="`industry${ index }`" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
            -
          </span>
          <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
            <a-select v-decorator="['category_id', { rules: [ validators.requiredRuleFactory('产品类型', 'select')]}]" placeholder="请选择产品类型">
              <a-select-option v-for="(item, index) in remoteData.categoryList" :key="`category${ index }`" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form-item>
        <a-form-item label="协议类型">
          <a-select v-decorator="['protocol_type', { rules: [ validators.requiredRuleFactory('协议类型', 'select')]}]" placeholder="请选择协议类型">
            <a-select-option v-for="(item, index) in enums.protocolEnum.displayList" :key="`protocol${ index }`" :value="enums.protocolEnum.getTransfer(item)">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="设备节点">
          <a-select v-decorator="['device_node', { rules: [ validators.requiredRuleFactory('设备节点', 'select')]}]" placeholder="请选择设备节点">
            <a-select-option v-for="(item, index) in enums.deviceTypeEnum.displayList" :key="`deviceType${ index }`" :value="enums.deviceTypeEnum.getTransfer(item)">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="联网方式">
          <a-checkbox-group v-decorator="['connection', { rules: [ validators.requiredRuleFactory('联网方式', 'select')]}]" placeholder="请选择联网方式">
            <a-checkbox v-for="(item, index) in enums.connectionTypeEnum.displayList" :key="`connectionType${ index }`" :value="enums.connectionTypeEnum.getTransfer(item)">
              {{ item }}
            </a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="产品型号">
          <a-input v-decorator="['model', { rules: [ validators.requiredRuleFactory('产品型号') ]}]" placeholder="请输入产品型号" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-decorator="['remark', {}]" placeholder="请输入备注" />
        </a-form-item>
      </a-form>
      <div class="drawer-feet">
        <a-button @click="productDrawer.display = false" class="dismiss-btn">取消</a-button>
        <a-button type="primary" class="execute-btn" @click="saveProduct" :loading="productDrawer.posting">保存</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { productListTable } from '@/assets/tables'
import { getProductList, postNewProduct, postEditedProduct, getIndustryList, getCategoryList } from '@/assets/api/ajax'
import { validators } from '~/assets/validators'
import { drawerConfig } from '~/assets/config'
import { setFormItems } from '~/assets/utils'
import enums from '~/assets/classes/enums'
import Product from '@/assets/classes/product'

export default {
  data() {
    return {
      config: {
        productListTable,
      },
      remoteData: {
        productList: {
          count: 0,
          products: [],
        },
        industryList: [],
        categoryList: [],
      },
      contentControl: {
        productListSelection: {},
      },
      productDrawer: {
        display: false,
        productForm: this.$form.createForm(this, { name: 'productForm' }),
        mode: '新增',
        pid: '',
        posting: false,
      },
      validators,
      drawerConfig,
      enums,
    }
  },
  mounted() {
    this.getProductList()
    this.getStaticData()
  },
  methods: {
    getProductList() {
      getProductList(this, { obj: this.remoteData, name: 'productList' }, {}, '', '获取产品列表失败')
      let productList = []
      for (let item of this.remoteData.productList.products) {
        productList.push(new Product(item))
      }
      this.remoteData.productList.products = productList
    },
    getStaticData() {
      getIndustryList(this, { obj: this.remoteData, name: 'industryList' }, {}, '', '获取行业列表失败')
      getCategoryList(this, { obj: this.remoteData, name: 'categoryList' }, {}, '', '获取类别列表失败')
    },
    createProduct() {
      this.productDrawer.mode = '新增'
      this.productDrawer.productForm.resetFields()
      this.productDrawer.display = true
    },
    saveProduct() {
      this.productDrawer.productForm.validateFields(async (err, values) => {
        if (!err) {
          this.productDrawer.posting = true
          let product = new Product(values)
          let result
          if (this.productDrawer.mode === '新增') {
            result = await postNewProduct(this, product, '保存产品信息成功', '保存产品信息失败')
          } else {
            product.pid = this.productDrawer.pid
            result = await postEditedProduct(this, product, '保存产品信息成功', '保存产品信息失败')
          }
          this.productDrawer.posting = false
          if (result.flag) {
            this.productDrawer.display = false
            this.getProductList()
          }
        }
      })
    },
    editProduct(product) {
      this.productDrawer.display = true
      this.productDrawer.mode = '编辑'
      this.productDrawer.pid = product.pid
      this.$nextTick(() => {
        setFormItems(product, this.productDrawer.productForm)
      })
    },
  },
}
</script>
