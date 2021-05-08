<template>
  <div class="product-management">
    <a-row class="page-title-row">
      <a-col :span="12">
        <h4 class="page-title">产品管理</h4>
      </a-col>
      <a-col :span="12" class="text-right page-operators">
        <a-button class="page-title-button" @click="refresh"><a-icon type="sync" />刷新</a-button>
      </a-col>
    </a-row>
    <div class="main-content">
      <a-row class="block-normal block-white">
        <a-col :span="20">
          <a-select default-value="all" class="regular-input" v-model="contentControl.filters.industry">
            <a-select-option value="all">
              全部行业类型
            </a-select-option>
            <a-select-option v-for="(item, index) in remoteData.industryList" :key="`industry${ index }`" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-select default-value="all" class="regular-input" v-model="contentControl.filters.publish">
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
          <a-input placeholder="请输入产品名称搜索" class="regular-input" v-model="contentControl.filters.name" />
        </a-col>
        <a-col :span="4" class="text-right">
          <a-button type="primary" @click="executeFilter">查询</a-button>
          <a-button @click="resetFilter">重置</a-button>
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
              <a-button @click="confirmDeletion(deleteConfirmationModal.tableSelectedProducts)">批量删除</a-button>
              <a-button type="primary" @click="createProduct">添加产品</a-button>
            </a-col>
          </a-row>
          <a-row class="block-content-row">
            <a-col :span="24">
              <a-table
                :columns="config.productListTable"
                :data-source="remoteData.productList"
                bordered
                :row-selection="{ selectedRowKeys: contentControl.productListSelection, onChange: onProductTableSelectChange }"
                :row-key="record => record.pid"
                :pagination="{ pageSize: 10, showTotal: total => `共 ${ total } 条`}"
                class="product-table"
              >
                <span slot="node" slot-scope="text">{{ enums.deviceTypeEnum.getDisplay(text) }}</span>
                <span slot="protocol" slot-scope="text">{{ enums.protocolEnum.getDisplay(text) }}</span>
                <span slot="created_at" slot-scope="text">{{ text.split('.')[0] }}</span>
                <template slot="release_status" slot-scope="publish">
                  <span v-if="publish" class="positive">已发布</span>
                  <span v-else class="negative">未发布</span>
                </template>
                <div slot="operators" slot-scope="record">
                  <span class="clickable"><nuxt-link :to="`/deviceAccess/productManagement/detail?pid=${ record.pid }`">查看详情</nuxt-link></span>
                  <span class="clickable" v-if="record.publish" @click="createApplication">申请设备标识</span>
                  <span class="clickable" v-if="record.publish"><nuxt-link :to="`/deviceAccess/deviceManagement?productPid=${ record.pid }`">设备管理</nuxt-link></span>
                  <span class="clickable" @click="editProduct(record)" v-if="!record.publish">编辑</span>
                  <span class="clickable" v-if="!record.publish" @click="confirmDeletion([record])">删除</span>
                  <span class="clickable" v-if="!record.publish" @click="publishProduct(record)">发布</span>
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
      @close="productDrawer.display = false"
    >
      <a-form
        :form="productDrawer.productForm"
        :label-col="drawerConfig.form.labelCol"
        :wrapper-col="drawerConfig.form.wrapperCol"
        class="drawer-form"
      >
        <a-form-item label="产品名称">
          <a-input v-decorator="['name', { rules: [ validators.requiredRuleFactory('产品名称'), validators.legalCharTypeFactory(['letter', 'number', 'Chinese']) ]}]" placeholder="请输入产品名称" />
        </a-form-item>
        <a-form-item label="行业-产品类别" style="margin-bottom: 0" required>
          <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
            <a-select v-decorator="['industry_id', { rules: [ validators.requiredRuleFactory('产品行业', 'select')]}]" placeholder="请选择产品行业" @change="drawerIndustryChangeHandler">
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
              <a-select-option v-for="(item, index) in productDrawer.filteredCategoryList" :key="`category${ index }`" :value="item.id">
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
          {{ deleteConfirmationModal.productNameStr }}
        </a-col>
      </a-row>
    </a-modal>
    <identification-application-drawer :display="deviceApplicationDrawer.display" @close="drawerCloseHandler"  :mode="deviceApplicationDrawer.mode" :application="deviceApplicationDrawer.application" />
  </div>
</template>

<script>
import { productListTable } from '@/assets/tables'
import { getProductList, postNewProduct, postEditedProduct, getIndustryList, getCategoryList, deleteProduct, publishProduct } from '@/assets/api/ajax'
import { setFormItems } from '~/assets/utils'
import Product from '@/assets/classes/Product'

const getBaseFilter = () => {
  return {
    name: '',
    publish: 'all',
    industry: 'all',
  }
}

export default {
  data() {
    return {
      config: {
        productListTable,
      },
      remoteData: {
        originalProductList: {
          count: 0,
          products: [],
        },
        productList: [],
        industryList: [],
        categoryList: [],
      },
      deviceApplicationDrawer: {
        display: false,
        mode: 'new',
        application: null,
      },
      contentControl: {
        productListSelection: [],
        filters: getBaseFilter(),
        cachedFilters: getBaseFilter(),
      },
      productDrawer: {
        display: false,
        productForm: this.$form.createForm(this, { name: 'productForm' }),
        mode: '新增',
        pid: '',
        posting: false,
        filteredCategoryList: [],
      },
      deleteConfirmationModal: {
        display: false,
        productNameStr: '',
        products: [],
        tableSelectedProducts: [],
        loading: false,
      },
    }
  },
  mounted() {
    this.getProductList()
    this.getStaticData()
  },
  methods: {
    drawerCloseHandler() {
      this.deviceApplicationDrawer.display = false
    },
    createApplication() {
      this.deviceApplicationDrawer.mode = 'new'
      this.deviceApplicationDrawer.display = true
    },
    onProductTableSelectChange(selectedRowKeys) {
      this.contentControl.productListSelection = selectedRowKeys
      let productSelectedList = []
      for (let pid of selectedRowKeys) {
        for (let product of this.remoteData.productList) {
          if (product.pid === pid) {
            productSelectedList.push(product)
            break
          }
        }
      }
      this.deleteConfirmationModal.tableSelectedProducts = productSelectedList
    },
    drawerIndustryChangeHandler(industryId) {
      let categoryList = this.remoteData.categoryList
      this.productDrawer.filteredCategoryList = categoryList.filter(ele => ele.industry === industryId)
      let category_id = this.productDrawer.productForm.getFieldValue('category_id')
      let clear = true
      for (let category of this.productDrawer.filteredCategoryList) {
        if (category_id === category.id) {
          clear = false
          break
        }
      }
      if (clear) this.productDrawer.productForm.resetFields(['category_id'])
    },
    resetFilter() {
      this.contentControl.filters = getBaseFilter()
      this.contentControl.cachedFilters = getBaseFilter()
      this.getProductList()
    },
    executeFilter() {
      let filters = this.contentControl.filters
      this.contentControl.cachedFilters = JSON.parse(JSON.stringify(filters))
      this.getProductList()
    },
    async getProductList() {
      let filters = this.contentControl.cachedFilters
      let filterObj = {}
      for (let key in filters) {
        if (filters[key] !== 'all' && filters[key] !== '') {
          filterObj[key] = filters[key]
        }
      }
      await getProductList(this, { obj: this.remoteData, name: 'originalProductList' }, filterObj, '', '获取产品列表失败')
      let productList = []
      for (let item of this.remoteData.originalProductList.products) {
        productList.push(new Product(item))
      }
      this.remoteData.productList = productList
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
        this.drawerIndustryChangeHandler(product.industry_id)
      })
    },
    confirmDeletion(products) {
      if (products.length === 0) {
        this.$toast('请先选择产品')
        return
      }
      let str = ''
      for (let index in products) {
        let item = products[index]
        if (item.publish) {
          this.$toast(`无法删除${ item.name }， 该产品已发布`)
          return
        }
        if (index > 0) {
          str += '，'
        }
        str += item.name
      }
      this.deleteConfirmationModal.productNameStr = str
      this.deleteConfirmationModal.products = products
      this.deleteConfirmationModal.display = true
    },
    async executeDelete() {
      let products = this.deleteConfirmationModal.products
      let promises = []
      this.deleteConfirmationModal.loading = true
      for (let product of products) {
        promises.push(deleteProduct(this, null, `删除${ product.name }成功`, `删除${ product.name }失败`, {pid: product.pid}))
      }
      await Promise.all(promises)
      this.deleteConfirmationModal.loading = false
      this.deleteConfirmationModal.display = false
      this.getProductList()
    },
    async publishProduct(product) {
      await publishProduct(this, null, '发布成功', '发布失败', {pid: product.pid})
      this.getProductList()
    },
  },
}
</script>
