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
              <a-button type="primary" @click="createApplication">申请设备标识</a-button>
            </a-col>
          </a-row>
          <a-row class="block-content-row">
            <a-col :span="24">
              <a-table :columns="config.deviceIdentificationListTable" :data-source="remoteData.deviceIdentificationList" bordered :rowKey="record => record.apply_sn">
                <span slot="created_at" slot-scope="text">{{ text.split('.')[0] }}</span>
                <div slot="operators" slot-scope="record">
                  <span class="clickable">查看详情</span>
                  <span class="clickable" v-if="record.status === 'APPROVED'">下载设备标识</span>
                  <span class="clickable" v-if="record.status === 'REJECTED'">查看驳回原因</span>
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
    <a-drawer
      title="申请设备标识"
      :visible="deviceApplicationDrawer.display"
      :width="drawerConfig.width"
      :body-style="{ paddingBottom: '80px' }"
      @close="deviceApplicationDrawer.display = false"
    >
      <a-form
        :form="deviceApplicationDrawer.applicationForm"
        :label-col="drawerConfig.form.labelCol"
        :wrapper-col="drawerConfig.form.wrapperCol"
        class="drawer-form"
      >
        <a-form-item label="选择产品" style="margin-bottom: 0" required>
          <a-form-item :style="{ display: 'inline-block', width: 'calc(33% - 16px)' }">
            <a-select placeholder="请选择产品行业" @change="drawerIndustryChangeHandler" v-decorator="['industry_id', { rules: [ validators.requiredRuleFactory('产品行业', 'select')]}]">
              <a-select-option v-for="(item, index) in remoteData.industryList" :key="`industry${ index }`" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
            -
          </span>
          <a-form-item :style="{ display: 'inline-block', width: 'calc(33% - 16px)' }">
            <a-select placeholder="请选择产品类型" @change="drawerCategoryChangeHandler" v-decorator="['category_id', { rules: [ validators.requiredRuleFactory('产品类型', 'select')]}]">
              <a-select-option v-for="(item, index) in deviceApplicationDrawer.filteredCategoryList" :key="`category${ index }`" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
            -
          </span>
          <a-form-item :style="{ display: 'inline-block', width: 'calc(33% - 16px)' }">
            <a-select placeholder="请选择产品" v-decorator="['product_id', { rules: [ validators.requiredRuleFactory('产品', 'select')]}]" @change="drwerProductChangeHandler">
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
          <a-input v-decorator="['product_system']" placeholder="请选择设备节点" placehoder="请填写操作系统" />
        </a-form-item>
        <a-form-item label="申请数量">
          <a-input-number v-decorator="['amount', { rules: [ validators.requiredRuleFactory('申请数量'), validators.integerChecker ]}]" placeholder="请选择设备节点" placehoder="每个产品单次最多申请100,000个" />
        </a-form-item>
        <a-form-item label="联系人">
          <a-input v-decorator="['contact', { rules: [ validators.requiredRuleFactory('联系人') ]}]" placeholder="请填写联系人姓名" />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input v-decorator="['contact_tel', { rules: [ validators.requiredRuleFactory('联系电话') ]}]" placeholder="请填写联系电话" />
        </a-form-item>
      </a-form>
      <div class="drawer-feet">
        <a-button @click="deviceApplicationDrawer.display = false" class="dismiss-btn">取消</a-button>
        <a-button type="primary" class="execute-btn" @click="saveApplication" :loading="deviceApplicationDrawer.posting">保存</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { deviceIdentificationListTable } from '@/assets/tables'
import { getDeviceIdentificationList, getProductList, getIndustryList, getCategoryList, postDeviceIdentification } from '@/assets/api/ajax'
import Product from '@/assets/classes/Product'
import DeviceID from '@/assets/classes/DeviceID'

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
      },
    }
  },
  created() {
    this.getDeviceIdentificationList()
    this.getStaticData()
    this.getProductList()
  },
  methods: {
    async getDeviceIdentificationList() {
      await getDeviceIdentificationList(this, {obj: this.remoteData.original, name: 'deviceIdentificationList'})
      this.remoteData.deviceIdentificationList = this.remoteData.original.deviceIdentificationList.identities
    },
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
      this.deviceApplicationDrawer.applicationForm.resetFields()
      this.deviceApplicationDrawer.industry_id = ''
      this.deviceApplicationDrawer.category_id = ''
    },
    async saveApplication() {
      this.deviceApplicationDrawer.applicationForm.validateFields(async (err, values) => {
        if (err) return
        this.deviceApplicationDrawer.posting = true
        values.protocol = this.enums.protocolEnum.getTransfer(values.protocol)
        let applicationObj = new DeviceID.DeviceIdenticationApplication(values)
        let result = await postDeviceIdentification(this, applicationObj, '新建设备标识申请成功', '新建设备标识申请失败')
        if (result.flag) {
          this.deviceApplicationDrawer.display = false
          this.getDeviceIdentificationList()
        }
        this.deviceApplicationDrawer.posting = false
      })
    },
  },
}
</script>
