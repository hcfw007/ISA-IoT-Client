<template>
  <a-drawer
    :title="deviceApplicationDrawer.title"
    :visible="deviceApplicationDrawer.display"
    :width="drawerConfig.width"
    :body-style="{ paddingBottom: '80px' }"
    @close="closeDrawer"
  >
    <a-form
      :form="deviceApplicationDrawer.applicationForm"
      :label-col="drawerConfig.form.labelCol"
      :wrapper-col="drawerConfig.form.wrapperCol"
      class="drawer-form"
    >
      <a-form-item label="选择产品" style="margin-bottom: 0" required>
        <a-form-item :style="{ display: 'inline-block', width: 'calc(33% - 16px)' }">
          <a-select placeholder="请选择产品行业" @change="drawerIndustryChangeHandler" v-decorator="['industry_id', { rules: [ validators.requiredRuleFactory('产品行业', 'select')]}]" :disabled="mode === 'display'">
            <a-select-option v-for="(item, index) in remoteData.industryList" :key="`industry${ index }`" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
          -
        </span>
        <a-form-item :style="{ display: 'inline-block', width: 'calc(33% - 16px)' }">
          <a-select placeholder="请选择产品类型" @change="drawerCategoryChangeHandler" v-decorator="['category_id', { rules: [ validators.requiredRuleFactory('产品类型', 'select')]}]" :disabled="mode === 'display'">
            <a-select-option v-for="(item, index) in deviceApplicationDrawer.filteredCategoryList" :key="`category${ index }`" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
          -
        </span>
        <a-form-item :style="{ display: 'inline-block', width: 'calc(33% - 16px)' }">
          <a-select placeholder="请选择产品" v-decorator="['product_id', { rules: [ validators.requiredRuleFactory('产品', 'select')]}]" @change="drwerProductChangeHandler" :disabled="mode === 'display'">
            <a-select-option v-for="(item, index) in deviceApplicationDrawer.filteredProductList" :key="`product${ index }`" :value="item.pid">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form-item>
      <a-form-item label="协议类型">
        <a-input v-decorator="['protocol', { rules: [ validators.requiredRuleFactory('协议类型')]}]" placeholder="请选择产品" disabled />
      </a-form-item>
      <a-form-item label="操作系统">
        <a-input v-decorator="['product_system']" placeholder="请选择设备节点" placehoder="请填写操作系统" :disabled="mode === 'display'"/>
      </a-form-item>
      <a-form-item label="申请数量">
        <a-input-number v-decorator="['amount', { rules: [ validators.requiredRuleFactory('申请数量'), validators.integerChecker ]}]" placeholder="请选择设备节点" placehoder="每个产品单次最多申请100,000个" :disabled="mode === 'display'"/>
      </a-form-item>
      <a-form-item label="联系人">
        <a-input v-decorator="['contact', { rules: [ validators.requiredRuleFactory('联系人') ]}]" placeholder="请填写联系人姓名" :disabled="mode === 'display'"/>
      </a-form-item>
      <a-form-item label="联系电话">
        <a-input v-decorator="['contact_tel', { rules: [ validators.requiredRuleFactory('联系电话') ]}]" placeholder="请填写联系电话" :disabled="mode === 'display'"/>
      </a-form-item>
    </a-form>
    <div class="drawer-feet">
      <a-button @click="deviceApplicationDrawer.display = false" class="dismiss-btn" v-if="mode === 'new'">取消</a-button>
      <a-button type="primary" class="execute-btn" @click="saveApplication" :loading="deviceApplicationDrawer.posting" v-if="mode === 'new'">保存</a-button>
      <a-button @click="deviceApplicationDrawer.display = false" class="dismiss-btn" v-if="mode === 'display'">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { getProductList, getIndustryList, getCategoryList, postDeviceIdentification } from '@/assets/api/ajax'
import Product from '@/assets/classes/Product'
import DeviceID from '@/assets/classes/DeviceID'
import { setFormItems } from '~/assets/utils'

export default {
  data() {
    return {
      remoteData: {
        original: {
        },
        productList: [],
        industryList: [],
        categoryList: [],
      },
      deviceApplicationDrawer: {
        posting: false,
        display: false,
        applicationForm: this.$form.createForm(this, { name: 'applicationForm' }),
        filteredCategoryList: [],
        filteredProductList: [],
        title: '申请设备标识',
      },
    }
  },
  props: {
    application: {
      type: Object,
      default: () => new DeviceID.DeviceIdenticationApplication(),
    },
    display: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: 'new',
    },
  },
  watch: {
    display: function(val) {
      if (val) {
        if (this.mode === 'new') {
          this.createApplication()
        } else {
          this.displayApplication()
        }
      }
    },
  },
  created() {
    this.getStaticData()
    this.getProductList()
  },
  methods: {
    getStaticData() {
      getIndustryList(this, { obj: this.remoteData, name: 'industryList' }, {}, '', '获取行业列表失败')
      getCategoryList(this, { obj: this.remoteData, name: 'categoryList' }, {}, '', '获取类别列表失败')
    },
    async getProductList() {
      await getProductList(this, { obj: this.remoteData.original, name: 'productList' })
      let productList = []
      for (let item of this.remoteData.original.productList.products) {
        productList.push(new Product(item))
      }
      this.remoteData.productList = productList
    },
    async saveApplication() {
      this.deviceApplicationDrawer.applicationForm.validateFields(async (err, values) => {
        if (err) return
        this.deviceApplicationDrawer.posting = true
        values.protocol = this.enums.protocolEnum.getTransfer(values.protocol)
        let applicationObj = new DeviceID.DeviceIdenticationApplication(values)
        let result = await postDeviceIdentification(this, applicationObj, '新建设备标识申请成功', '新建设备标识申请失败')
        if (result.flag) {
          this.closeDrawer()
          this.$emit('created')
        }
        this.deviceApplicationDrawer.posting = false
      })
    },
    drawerIndustryChangeHandler(industryId) {
      let categoryList = this.remoteData.categoryList
      this.deviceApplicationDrawer.filteredCategoryList = categoryList.filter(ele => ele.industry === industryId)
      this.deviceApplicationDrawer.applicationForm.resetFields(['product_id', 'category_id', 'protocol'])
    },
    drawerCategoryChangeHandler(categoryId) {
      let productList = this.remoteData.productList
      this.deviceApplicationDrawer.filteredProductList = productList.filter(ele => ele.category_id === categoryId)
      this.deviceApplicationDrawer.applicationForm.resetFields(['product_id', 'protocol'])
    },
    drwerProductChangeHandler(pid) {
      for (let product of this.remoteData.productList) {
        if (product.pid === pid) {
          this.deviceApplicationDrawer.applicationForm.setFieldsValue({
            protocol: this.enums.protocolEnum.getDisplay(product.protocol_type),
          })
          break
        }
      }
    },
    createApplication() {
      this.deviceApplicationDrawer.display = true
      this.deviceApplicationDrawer.title = '申请设备标识'
      this.deviceApplicationDrawer.applicationForm.resetFields()
      this.deviceApplicationDrawer.industry_id = ''
      this.deviceApplicationDrawer.category_id = ''
    },
    displayApplication() {
      this.deviceApplicationDrawer.display = true
      this.deviceApplicationDrawer.title = '详情'
      this.$nextTick(() => {
        let application = JSON.parse(JSON.stringify(this.application))
        for (let product of this.remoteData.productList) {
          if (product.pid === application.product_id) {
            application.industry_id = product.industry_id
            this.drawerIndustryChangeHandler(product.industry_id)
            application.category_id = product.category_id
            this.drawerCategoryChangeHandler(product.category_id)
            break
          }
        }
        setFormItems(application, this.deviceApplicationDrawer.applicationForm)
        this.drwerProductChangeHandler(application.product_id)
      })
    },
    closeDrawer() {
      this.deviceApplicationDrawer.display = false
      this.$emit('close')
    },
  },
}
</script>
