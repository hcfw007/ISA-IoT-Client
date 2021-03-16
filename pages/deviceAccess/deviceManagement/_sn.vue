<template>
  <div class="device-detail">
    <a-row class="page-title-row">
      <a-col :span="24">
        <h4 class="page-title">设备详情</h4>
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
                        <span class="clickable" @click="copyToClipboard(remoteData.device.dev_key)">复制密码</span>
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
      <!-- <a-row class="block-normal block-white">
        <a-col :span="24">
          <a-tabs>
            <a-tab-pane key="1" tab="基础功能点">
              <a-row>
                <a-col :span="16">
                  <span class="function-table-title">设备功能</span>
                  <span class="function-table-subtitle">标准功能无法满足你的需求时，你可以添加自定义功能</span>
                </a-col>
                <a-col :span="8" class="text-right">
                  <div class="add-function-button" @click="selectStandardFunction">
                    <div class="add-function-icon">+</div>
                    <div class="add-function-text">标准功能点</div>
                  </div>
                  <div class="add-function-button" @click="createFunction">
                    <div class="add-function-icon">+</div>
                    <div class="add-function-text">自定义功能点</div>
                  </div>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-table
                    :columns="config.functionListTable"
                    :data-source="remoteData.functionList"
                    bordered
                    :row-key="record => record.index"
                    :pagination="{ pageSize: 10, showTotal: total => `共 ${ total } 条`}"
                    class="functionPoint-table"
                  >
                    <span slot="functionType" slot-scope="text">{{ enums.functionTypeEnum.getDisplay(text) }}</span>
                    <span slot="dataType" slot-scope="text">{{ enums.commonFunctionDataTypeEnum.getDisplay(text) }}</span>
                    <span slot="transferType" slot-scope="record">{{ record.getTransferType() }}</span>
                    <div slot="operators" slot-scope="record">
                      <span class="clickable" @click="editFunction(record)">编辑</span>
                      <a-popconfirm
                        title="确定要删除嘛？"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="deleteFunction(record)"
                      >
                        <span class="clickable">删除</span>
                      </a-popconfirm>
                    </div>
                  </a-table>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="2" tab="组合功能点">
              <a-row>
                <a-col :span="16">
                  <span class="function-table-title">组合功能点</span>
                  <span class="function-table-subtitle">可以将多个独立功能点组合，进行上报或者下发</span>
                </a-col>
                <a-col :span="8" class="text-right">
                  <div class="add-function-button" @click="createCombinedFunction">
                    <div class="add-function-icon">+</div>
                    <div class="add-function-text">组合功能点</div>
                  </div>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-table
                    :columns="config.combinedFunctionListTable"
                    :data-source="remoteData.combinedFunctionList"
                    bordered
                    :row-key="record => record.index"
                    :pagination="{ pageSize: 10, showTotal: total => `共 ${ total } 条`}"
                    class="functionPoint-table"
                  >
                    <span slot="functionType" slot-scope="text">{{ enums.functionTypeEnum.getDisplay(text) }}</span>
                    <span slot="transferType" slot-scope="record">{{ record.getTransferType() }}</span>
                    <div slot="operators" slot-scope="record">
                      <span class="clickable" @click="editCombinedFunction(record)">编辑</span>
                      <a-popconfirm
                        title="确定要删除嘛？"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="deleteFunction(record)"
                      >
                        <span class="clickable">删除</span>
                      </a-popconfirm>
                    </div>
                  </a-table>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row> -->
    </div>
    <!-- <a-drawer
      :title="`${functionEditDrawer.mode}基础功能点`"
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
          <a-input v-decorator="['name', { rules: [ validators.requiredRuleFactory('功能点名称')]}]" placeholder="请输入功能点名称" />
        </a-form-item>
        <a-form-item label="字段名称">
          <a-input v-decorator="['subject', { rules: [ validators.requiredRuleFactory('字段名称'), validators.startWithLetter, validators.legalCharTypeFactory(['letter', 'number', 'Chinese', 'underline']) ]}]" placeholder="请输入字段名称" />
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
                <a-input-number v-decorator="['max', { rules: [ validators.requiredRuleFactory('最大值'), validators.integerChecker ]}]" placeholder="请输入最大值" />
              </a-form-item>
            </a-form-item>
            <a-form-item label="间距">
              <a-input-number v-decorator="['step', { rules: [ validators.requiredRuleFactory('间距'), validators.integerChecker ]}]" placeholder="请输入间距" />
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
        <section v-if="functionEditDrawer.functionForm.getFieldValue('fn_type') === 'EVENT'">
          <a-form-item label="事件类型">
            <a-select v-decorator="['event_type', { rules: [ validators.requiredRuleFactory('事件类型', 'select')], initialValue: 'INFO'}]" placeholder="请选择事件类型">
              <a-select-option v-for="(item, index) in enums.eventTypeEnum.displayList" :value="enums.eventTypeEnum.getTransfer(item)" :key="`eventType${ index }`" >
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="输出参数">
            <param-display v-decorator="['params', { initialValue: [] }]" @addParam="addParamHandler" @deleteParam="deleteParamHandler" @editParam="editParamHandler" />
          </a-form-item>
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
      </a-form>
      <div class="drawer-feet">
        <a-button @click="functionEditDrawer.display = false" class="dismiss-btn">取消</a-button>
        <a-button type="primary" class="execute-btn" @click="saveFunction" :loading="functionEditDrawer.posting">保存</a-button>
      </div>
    </a-drawer>
    <a-drawer
      :title="`${paramEditDrawer.mode}输出参数`"
      :visible="paramEditDrawer.display"
      :width="drawerConfig.width"
      :body-style="{ paddingBottom: '80px' }"
      @close="paramEditDrawer.display = false"
    >
      <a-form
        :form="paramEditDrawer.paramForm"
        :label-col="drawerConfig.form.labelCol"
        :wrapper-col="drawerConfig.form.wrapperCol"
        class="drawer-form"
      >
        <a-form-item label="参数名称">
          <a-input v-decorator="['name', { rules: [ validators.requiredRuleFactory('功能点名称')]}]" placeholder="请输入参数名称" />
        </a-form-item>
        <a-form-item label="参数字段">
          <a-input v-decorator="['subject', { rules: [ validators.requiredRuleFactory('字段名称'), validators.startWithLetter, validators.legalCharTypeFactory(['letter', 'number', 'Chinese', 'underline']) ]}]" placeholder="请输入参数字段" />
        </a-form-item>
        <a-form-item label="数据类型">
          <a-select v-decorator="['type', { rules: [ validators.requiredRuleFactory('数据类型', 'select')], initialValue: 'BOOLEAN'}]" placeholder="请选择数据类型">
            <a-select-option v-for="(item, index) in enums.paramDataTypeEnum.displayList" :value="enums.paramDataTypeEnum.getTransfer(item)" :key="`paramDataType${ index }`" >
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <section v-if="paramEditDrawer.paramForm.getFieldValue('type') === 'BOOLEAN' || !paramEditDrawer.paramForm.getFieldValue('type')">
          <a-form-item label="True - ">
            <a-input v-decorator="['true_value', { rules: [ validators.requiredRuleFactory('真值') ]}]" placeholder="请输入真值" />
          </a-form-item>
          <a-form-item label="False - ">
            <a-input v-decorator="['false_value', { rules: [ validators.requiredRuleFactory('假值') ]}]" placeholder="请输入假值" />
          </a-form-item>
        </section>
        <section v-if="paramEditDrawer.paramForm.getFieldValue('type') === 'INTEGER'">
          <a-form-item label="取值范围" style="margin-bottom: 0" required>
            <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
              <a-input-number v-decorator="['min', { rules: [ validators.requiredRuleFactory('最小值'), validators.integerChecker ]}]" placeholder="请输入最小值" />
            </a-form-item>
            <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
              -
            </span>
            <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
              <a-input-number v-decorator="['max', { rules: [ validators.requiredRuleFactory('最大值'), validators.integerChecker ]}]" placeholder="请输入最大值" />
            </a-form-item>
          </a-form-item>
          <a-form-item label="间距">
            <a-input-number v-decorator="['step', { rules: [ validators.requiredRuleFactory('间距'), validators.integerChecker ]}]" placeholder="请输入间距" />
          </a-form-item>
          <a-form-item label="单位">
            <a-input v-decorator="['unit', { rules: []}]" placeholder="请输入单位" />
          </a-form-item>
        </section>
        <section v-if="paramEditDrawer.paramForm.getFieldValue('type') === 'FLOAT'">
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
        <section v-if="paramEditDrawer.paramForm.getFieldValue('type') === 'ENUM'">
          <a-form-item label="枚举值" required>
            <enum-editor v-decorator="['items', { initialValue: [] }]" />
          </a-form-item>
        </section>
        <section v-if="paramEditDrawer.paramForm.getFieldValue('type') === 'STRING'">
          <a-form-item label="最大长度">
            <span>最大长度不超过255字节</span>
          </a-form-item>
        </section>
        <a-form-item label="备注">
          <a-textarea v-decorator="['remark']" :maxLength="100" placeholder="最多100字符" />
        </a-form-item>
      </a-form>
      <div class="drawer-feet">
        <a-button @click="paramEditDrawer.display = false" class="dismiss-btn">取消</a-button>
        <a-button type="primary" class="execute-btn" @click="saveParam">保存</a-button>
      </div>
    </a-drawer>
    <a-drawer
      title="选择要添加的标准功能点"
      :visible="standardFunctionSelectionDrawer.display"
      :width="drawerConfig.width"
      :body-style="{ paddingBottom: '80px' }"
      @close="standardFunctionSelectionDrawer.display = false"
    >
      <a-transfer
        :data-source="remoteData.standardFunctionTransferList"
        :titles="['全部标准功能点', '要添加的功能点']"
        :render="item => item.name"
        :target-keys="standardFunctionSelectionDrawer.targetKeys"
        :selected-keys="standardFunctionSelectionDrawer.selectedKeys"
        @change="handleStandardDrawerChange"
        @selectChange="handleStandardDrawerSelectChange"
      >
      </a-transfer>
      <div class="drawer-feet">
        <a-button @click="standardFunctionSelectionDrawer.display = false" class="dismiss-btn">取消</a-button>
        <a-button type="primary" class="execute-btn" @click="saveStandardFunction" :loading="standardFunctionSelectionDrawer.posting">保存</a-button>
      </div>
    </a-drawer>
    <a-drawer
      :title="`${combinedFunctionEditDrawer.mode}组合功能点`"
      :visible="combinedFunctionEditDrawer.display"
      :width="drawerConfig.width"
      :body-style="{ paddingBottom: '80px' }"
      @close="combinedFunctionEditDrawer.display = false"
    >
      <a-form
        :form="combinedFunctionEditDrawer.combinedFunctionForm"
        :label-col="drawerConfig.form.labelCol"
        :wrapper-col="drawerConfig.form.wrapperCol"
        class="drawer-form"
      >
        <a-form-item label="功能点名称">
          <a-input v-decorator="['name', { rules: [ validators.requiredRuleFactory('功能点名称')]}]" placeholder="请输入功能点名称" />
        </a-form-item>
        <a-form-item label="字段名称">
          <a-input v-decorator="['subject', { rules: [ validators.requiredRuleFactory('字段名称'), validators.startWithLetter, validators.legalCharTypeFactory(['letter', 'number', 'Chinese', 'underline']) ]}]" placeholder="请输入字段名称" />
        </a-form-item>
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
        <a-form-item label="传输类型">
          <a-select v-decorator="['transferType', { rules: [ validators.requiredRuleFactory('传输类型', 'select')], initialValue: 'upAndDown'}]" placeholder="请选择传输类型" @change="combinedFunctionEditDrawerTransferTypeChangeHandler">
            <a-select-option v-for="(item, index) in enums.transferTypeEnum.displayList" :value="enums.transferTypeEnum.getTransfer(item)" :key="`transferType${ index }`" >
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <a-transfer
        :data-source="combinedFunctionEditDrawerFunctionFilterList"
        :titles="['全部标准功能点', '要添加的功能点']"
        :render="item => item.name"
        :target-keys="combinedFunctionEditDrawer.targetKeys"
        :selected-keys="combinedFunctionEditDrawer.selectedKeys"
        @change="handleCombinedDrawerChange"
        @selectChange="handleCombinedDrawerSelectChange"
      >
      </a-transfer>
      <div class="drawer-feet">
        <a-button @click="combinedFunctionEditDrawer.display = false" class="dismiss-btn">取消</a-button>
        <a-button type="primary" class="execute-btn" @click="saveCombinedFunction" :loading="combinedFunctionEditDrawer.posting">保存</a-button>
      </div>
    </a-drawer> -->
  </div>
</template>

<script>
import { getProductDetailWithDeviceStastic, postFunctionFile, getFunctionList, postCustomFunction, editFunction, deleteFunction, postStandardFunction, postCombinedFunction, editCombinedFunction, getDeviceDetail } from '@/assets/api/ajax'
import Product from '@/assets/classes/Product'
import FunctionPoint from '@/assets/classes/FunctionPoint'
import CombinedFunctionPoint from '@/assets/classes/CombinedFunctionPoint'
import Param from '@/assets/classes/Param'
import DeviceID from '@/assets/classes/DeviceID'
import { functionListTable, combinedFunctionListTable } from '@/assets/tables'
import { setFormItems } from '~/assets/utils'

export default {
  data() {
    return {
      config: {
        functionListTable,
        combinedFunctionListTable,
      },
      remoteData: {
        original: {
        },
        product: new Product(),
        device: new DeviceID.Device(),
        functionList: [],
        combinedFunctionList: [],
        functionTransferList: [],
        standardFunctionList: [],
        standardFunctionTransferList: [],
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
        index: 0,
      },
      combinedFunctionEditDrawer: {
        display: false,
        combinedFunctionForm: this.$form.createForm(this, { name: 'combinedFunctionForm' }),
        targetKeys: [],
        selectedKeys: [],
        transferType: 'upAndDown',
        mode: '新增',
        posting: false,
        index: 0,
      },
      paramEditDrawer: {
        display: false,
        paramForm: this.$form.createForm(this, { name: 'paramForm' }),
        mode: '新增',
        index: 0,
      },
      standardFunctionSelectionDrawer: {
        display: false,
        targetKeys: [],
        selectedKeys: [],
        posting: false,
      },
      sdkDrawer: {
        display: false,
      },
    }
  },
  async created() {
    // this.getFunctionList()
    // this.getCombinedFunctionList()
    await this.getDeviceDetail()
    await this.getProductDetail()
    // this.getStandardFunctionList()
  },
  computed: {
    combinedFunctionEditDrawerFunctionFilterList() {
      let [up, down] = [false, false]
      if (this.combinedFunctionEditDrawer.transferType.includes('up')) {
        up = true
      }
      if (this.combinedFunctionEditDrawer.transferType.includes('down')) {
        down = true
      }
      return this.remoteData.functionTransferList.filter(ele => ((ele.up === up && ele.down === down) || (ele.up && ele.down)))
    },
  },
  methods: {
    combinedFunctionEditDrawerTransferTypeChangeHandler(transferType) {
      this.combinedFunctionEditDrawer.transferType = transferType
    },
    async getDeviceDetail() {
      let sn =  this.$route.params.sn
      await getDeviceDetail(this, {obj: this.remoteData.original, name: 'device'}, null, '', '', {sn})
      this.remoteData.device = new DeviceID.Device(this.remoteData.original.device)
    },
    async getProductDetail() {
      let pid =  this.remoteData.device.product_id
      await getProductDetailWithDeviceStastic(this, {obj: this.remoteData.original, name: 'product'}, null, '', '', {pid})
      this.remoteData.product = new Product(this.remoteData.original.product.product)
      this.remoteData.totalDevice = this.remoteData.original.product.device_total
      this.remoteData.totalDeviceIdentity = this.remoteData.original.product.device_identity_total
    },
    async getFunctionList() {
      let pid = this.$route.params.pid
      await getFunctionList(this, {obj: this.remoteData.original, name: 'functionList'}, { pid, meta_type: 'BASE', standard: false }, '', '')
      let functionList = []
      let functionListForTransfer = []
      for (let item of this.remoteData.original.functionList.functions) {
        // 穿梭框不能用FunctionPoint，不知为何
        let functionPoint = item
        functionPoint.key = String(functionPoint.index)
        functionPoint.title = functionPoint.name
        functionListForTransfer.push(functionPoint)

        functionList.push(new FunctionPoint(item))
      }
      this.remoteData.functionTransferList = functionListForTransfer
      this.remoteData.functionList = functionList
    },
    async getCombinedFunctionList() {
      let pid = this.$route.params.pid
      await getFunctionList(this, {obj: this.remoteData.original, name: 'combinedFunctionList'}, { pid, meta_type: 'COMBINE', standard: false }, '', '')
      let functionList = []
      for (let item of this.remoteData.original.combinedFunctionList.functions) {
        functionList.push(new CombinedFunctionPoint(item))
      }
      this.remoteData.combinedFunctionList = functionList
    },
    handleStandardDrawerChange(nextTargetKeys) {
      this.standardFunctionSelectionDrawer.targetKeys = nextTargetKeys
    },
    handleStandardDrawerSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.standardFunctionSelectionDrawer.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
    },
    handleCombinedDrawerChange(nextTargetKeys) {
      this.combinedFunctionEditDrawer.targetKeys = nextTargetKeys
    },
    handleCombinedDrawerSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.combinedFunctionEditDrawer.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
    },
    async getStandardFunctionList() {
      let industry_id = this.remoteData.product.industry_id
      let category_id = this.remoteData.product.category_id
      await getFunctionList(this, {obj: this.remoteData.original, name: 'standardFunctionList'}, { industry_id, category_id, meta_type: 'BASE', standard: true }, '', '')
      let functionList = []
      let functionListForTransfer = []
      for (let item of this.remoteData.original.standardFunctionList.functions) {
        // 穿梭框不能用FunctionPoint，不知为何
        let functionPoint = item
        functionPoint.key = String(functionPoint.index)
        functionPoint.title = functionPoint.name
        functionListForTransfer.push(functionPoint)

        functionList.push(new FunctionPoint(item))
      }
      this.remoteData.standardFunctionTransferList = functionListForTransfer
      this.remoteData.standardFunctionList = functionList
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
    createCombinedFunction() {
      this.combinedFunctionEditDrawer.mode = '新增'
      this.combinedFunctionEditDrawer.combinedFunctionForm.resetFields()
      this.combinedFunctionEditDrawer.targetKeys = []
      this.combinedFunctionEditDrawer.selectedKeys = []
      this.combinedFunctionEditDrawer.display = true
    },
    selectStandardFunction() {
      this.standardFunctionSelectionDrawer.targetKeys = []
      this.standardFunctionSelectionDrawer.selectedKeys = []
      this.standardFunctionSelectionDrawer.display = true
    },
    async saveFunction() {
      this.functionEditDrawer.functionForm.validateFields(async (err, values) => {
        if (err) return
        values.product_id = this.$route.params.pid
        this.functionEditDrawer.posting = true
        let funObj = new FunctionPoint(values)
        let result
        if (this.functionEditDrawer.mode === '新增') {
          result = await postCustomFunction(this, funObj, '保存自定义功能点成功', '保存自定义功能点失败')
        } else {
          funObj.index = this.functionEditDrawer.index
          funObj.meta_type = 'BASE'
          funObj.standard = true
          result = await editFunction(this, funObj, '修改自定义功能点成功', '修改自己定义功能点失败')
        }
        this.functionEditDrawer.posting = false
        if (result.flag) {
          this.functionEditDrawer.display = false
          this.getFunctionList()
        }
      })
    },
    async saveStandardFunction() {
      this.standardFunctionSelectionDrawer.posting = true
      let pid = this.$route.params.pid
      let functionObj = {
        product_id: pid,
        indexes: this.standardFunctionSelectionDrawer.targetKeys,
      }
      let result = await postStandardFunction(this, functionObj, '添加标准功能点成功', '添加标准功能点失败')
      if (result.flag) {
        this.standardFunctionSelectionDrawer.display = false
        this.getFunctionList()
      }
      this.standardFunctionSelectionDrawer.posting = false
    },
    async saveCombinedFunction() {
      this.combinedFunctionEditDrawer.combinedFunctionForm.validateFields(async (err, values) => {
        if (err) return
        this.combinedFunctionEditDrawer.posting = true
        values.product_id = this.$route.params.pid
        values.combination = []
        this.combinedFunctionEditDrawer.targetKeys.forEach(ele => {
          values.combination.push({
            index: ele,
          })
        })
        this.functionEditDrawer.posting = true
        let funObj = new CombinedFunctionPoint(values)
        let result
        if (this.combinedFunctionEditDrawer.mode === '新增') {
          result = await postCombinedFunction(this, funObj, '保存组合功能点成功', '保存组合功能点失败')
        } else {
          funObj.index = this.combinedFunctionEditDrawer.index
          result = await editCombinedFunction(this, funObj, '修改组合功能点成功', '修改组合功能点失败')
        }
        this.combinedFunctionEditDrawer.posting = false
        if (result.flag) {
          this.combinedFunctionEditDrawer.display = false
          this.getCombinedFunctionList()
        }
      })
    },
    saveParam() {
      this.paramEditDrawer.paramForm.validateFields(async (err, values) => {
        if (err) return
        let paramObj = new Param(values)
        let params = this.functionEditDrawer.functionForm.getFieldValue('params')
        if (this.paramEditDrawer.mode === '新增') {
          params.push(paramObj)
          this.functionEditDrawer.functionForm.setFieldsValue({params})
        } else {
          params[this.paramEditDrawer.index] = paramObj
          this.functionEditDrawer.functionForm.setFieldsValue({params})
        }
        this.paramEditDrawer.display = false
      })
    },
    editFunction(functionPoint) {
      this.functionEditDrawer.mode = '编辑'
      this.functionEditDrawer.display = true
      this.functionEditDrawer.index = functionPoint.index
      setFormItems(functionPoint.toFormObject(), this.functionEditDrawer.functionForm)
      this.$nextTick(() => {
        setFormItems(functionPoint.toFormObject(), this.functionEditDrawer.functionForm)
      })
    },
    editCombinedFunction(functionPoint) {
      this.combinedFunctionEditDrawer.mode = '编辑'
      this.combinedFunctionEditDrawer.display = true
      this.combinedFunctionEditDrawer.index = functionPoint.index
      let combinations = []
      for (let item of functionPoint.combination) {
        combinations.push(String(item.index))
      }
      this.combinedFunctionEditDrawer.selectedKeys = []
      this.combinedFunctionEditDrawer.targetKeys = combinations
      this.$nextTick(() => {
        setFormItems(functionPoint.toFormObject(), this.combinedFunctionEditDrawer.combinedFunctionForm)
      })
    },
    async deleteFunction(functionPoint) {
      let pid = this.$route.params.pid
      let index = functionPoint.index
      let result = await deleteFunction(this, null, '删除功能点成功', '删除功能点失败', { pid, index})
      if (result.flag) {
        this.getFunctionList()
      }
    },
    addParamHandler() {
      this.paramEditDrawer.mode = '新增'
      this.paramEditDrawer.paramForm.resetFields()
      this.paramEditDrawer.display = true
    },
    deleteParamHandler(index) {
      let params = this.functionEditDrawer.functionForm.getFieldValue('params')
      params.splice(index, 1)
      this.functionEditDrawer.functionForm.setFieldsValue({params})
    },
    editParamHandler(index) {
      this.paramEditDrawer.mode = '编辑'
      this.paramEditDrawer.display = true
      this.paramEditDrawer.index = index
      let param = this.functionEditDrawer.functionForm.getFieldValue('params')[index]
      setFormItems(param.toFormObject(), this.paramEditDrawer.paramForm)
      this.$nextTick(() => {
        setFormItems(param.toFormObject(), this.paramEditDrawer.paramForm)
      })
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
