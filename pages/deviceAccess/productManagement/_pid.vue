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
      <a-row class="block-normal block-white">
        <a-col :span="24">
          <a-tabs>
            <a-tab-pane key="1" tab="基础功能点">
              <a-row>
                <a-col :span="16">
                  <span class="function-table-title">设备功能</span>
                  <span class="function-table-subtitle">标准功能无法满足你的需求时，你可以添加自定义功能</span>
                </a-col>
                <a-col :span="8" class="text-right">
                  <div class="add-function-button">
                    <div class="add-function-icon">+</div>
                    <div class="add-function-text">标准功能点</div>
                  </div>
                  <div class="add-function-button" @click="createFunction">
                    <div class="add-function-icon">+</div>
                    <div class="add-function-text">自定义功能点</div>
                  </div>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="2" tab="组合功能点">
              2
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </div>
    <a-drawer
      :title="`${functionEditDrawer.mode}产品`"
      :visible="functionEditDrawer.display"
      :width="drawerConfig.width"
      :body-style="{ paddingBottom: '80px' }"
      @close="functionEditDrawer.display = false"
    >
      <a-form
        :form="functionEditDrawer.functionForm"
        :label-col="drawerConfig.form.labelCol"
        :wrapper-col="drawerConfig.form.wrapperCol"
        class="drawer-form"
      >
        <a-form-item label="功能类型" required>
          <a-select v-decorator="['fn_type', { rules: [ validators.requiredRuleFactory('功能类型', 'select')], initialValue: 'COMMON'}]" placeholder="请选择功能点类型">
            <a-select-option :value="'COMMON'">
              属性类型
            </a-select-option>
            <a-select-option :value="'EVENT'">
              事件类型
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="功能点名称">
          <a-input v-decorator="['name', { rules: [ validators.requiredRuleFactory('功能点名称')]}]" placeholder="请输入产品名称" />
        </a-form-item>
        <a-form-item label="字段名称">
          <a-input v-decorator="['subject', { rules: [ validators.requiredRuleFactory('字段名称'), validators.startWithLetter, validators.legalCharTypeFactory(['letter', 'number', 'Chinese', 'underline']) ]}]" placeholder="请输入产品名称" />
        </a-form-item>
        <section v-if="functionEditDrawer.functionForm.getFieldValue('fn_type') === 'COMMON' || !functionEditDrawer.functionForm.getFieldValue('fn_type')">
          <a-form-item label="数据类型">
            <a-select v-decorator="['type', { rules: [ validators.requiredRuleFactory('数据类型', 'select')], initialValue: 'BOOLEAN'}]" placeholder="请选择数据类型">
              <a-select-option v-for="(item, index) in enums.commonFunctionDataTypeEnum.displayList" :value="enums.commonFunctionDataTypeEnum.getTransfer(item)" :key="`commonFunctionDataType${ index }`" >
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <section v-if="functionEditDrawer.functionForm.getFieldValue('type') === 'BOOLEAN' || !functionEditDrawer.functionForm.getFieldValue('type')">
            <a-form-item label="True - ">
              <a-input v-decorator="['true_value', { rules: [ validators.requiredRuleFactory('真值') ]}]" placeholder="请输入真值" />
            </a-form-item>
            <a-form-item label="False - ">
              <a-input v-decorator="['false_value', { rules: [ validators.requiredRuleFactory('假值') ]}]" placeholder="请输入假值" />
            </a-form-item>
          </section>
          <section v-if="functionEditDrawer.functionForm.getFieldValue('type') === 'INTEGER'">
            <a-form-item label="取值范围" style="margin-bottom: 0" required>
              <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
                <a-input-number v-decorator="['min', { rules: [ validators.requiredRuleFactory('最小值'), validators.integerChecker ]}]" placeholder="请输入最小值" />
              </a-form-item>
              <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
                -
              </span>
              <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
                <a-input-number v-decorator="['max', { rules: [ validators.requiredRuleFactory('最大值') ]}]" placeholder="请输入最大值" />
              </a-form-item>
            </a-form-item>
            <a-form-item label="间距">
              <a-input-number v-decorator="['step', { rules: [ validators.requiredRuleFactory('间距') ]}]" placeholder="请输入间距" />
            </a-form-item>
            <a-form-item label="单位">
              <a-input v-decorator="['unit', { rules: []}]" placeholder="请输入单位" />
            </a-form-item>
          </section>
          <section v-if="functionEditDrawer.functionForm.getFieldValue('type') === 'FLOAT'">
            <a-form-item label="取值范围" style="margin-bottom: 0" required>
              <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
                <a-input-number v-decorator="['min', { rules: [ validators.requiredRuleFactory('最小值') ]}]" placeholder="请输入最小值" />
              </a-form-item>
              <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
                -
              </span>
              <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
                <a-input-number v-decorator="['max', { rules: [ validators.requiredRuleFactory('最大值') ]}]" placeholder="请输入最大值" />
              </a-form-item>
            </a-form-item>
            <a-form-item label="间距">
              <a-input-number v-decorator="['step', { rules: [ validators.requiredRuleFactory('间距') ]}]" placeholder="请输入间距" />
            </a-form-item>
            <a-form-item label="单位">
              <a-input v-decorator="['unit', { rules: []}]" placeholder="请输入单位" />
            </a-form-item>
          </section>
          <section v-if="functionEditDrawer.functionForm.getFieldValue('type') === 'ENUM'">
            <a-form-item label="枚举值" required>
              <enum-editor v-decorator="['items', { initialValue: [] }]" />
            </a-form-item>
          </section>
          <section v-if="functionEditDrawer.functionForm.getFieldValue('type') === 'EXCEPTION'">
            <a-form-item label="故障值" required>
              <enum-editor v-decorator="['items', { initialValue: [] }]" typeLabel="故障" />
            </a-form-item>
          </section>
          <section v-if="functionEditDrawer.functionForm.getFieldValue('type') === 'STRING' || functionEditDrawer.functionForm.getFieldValue('type') === 'BUFFER'">
            <a-form-item label="最大长度">
              <span>最大长度不超过255字节</span>
            </a-form-item>
          </section>
        </section>
        <a-form-item label="传输类型">
            <a-select v-decorator="['transferType', { rules: [ validators.requiredRuleFactory('传输类型', 'select')], initialValue: 'upAndDown'}]" placeholder="请选择传输类型">
              <a-select-option v-for="(item, index) in enums.transferTypeEnum.displayList" :value="enums.transferTypeEnum.getTransfer(item)" :key="`transferType${ index }`" >
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="备注">
            <a-textarea v-decorator="['remark']" :maxLength="100" placeholder="最多100字符" />
          </a-form-item>
        <section v-if="functionEditDrawer.functionForm.getFieldValue('fn_type') === 'EVENT'">
          event
        </section>
      </a-form>
      <div class="drawer-feet">
        <a-button @click="functionEditDrawer.display = false" class="dismiss-btn">取消</a-button>
        <a-button type="primary" class="execute-btn" @click="saveFunction" :loading="functionEditDrawer.posting">保存</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { getProductDetailWithDeviceStastic, postFunctionFile, getFunctionList } from '@/assets/api/ajax'
import Product from '@/assets/classes/Product'
import FunctionPoint from '@/assets/classes/FunctionPoint'

export default {
  data() {
    return {
      remoteData: {
        original: {
          product: {},
          functionList: {},
        },
        product: new Product(),
        totalDeviceIdentity: 0,
        totalDevice: 0,
      },
      contentControl: {
        uploadingFunctionFile: false,
      },
      functionEditDrawer: {
        display: false,
        functionForm: this.$form.createForm(this, { name: 'functionForm' }),
        mode: '新增',
        posting: false,
      },
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
    createFunction() {
      this.functionEditDrawer.mode = '新增'
      this.functionEditDrawer.functionForm.resetFields()
      this.functionEditDrawer.display = true
    },
    async saveFunction() {
      this.functionEditDrawer.functionForm.validateFields(async (err, result) => {
        if (err) return
        let funObj = new FunctionPoint(result)
        console.log(funObj)
      })
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
</style>
