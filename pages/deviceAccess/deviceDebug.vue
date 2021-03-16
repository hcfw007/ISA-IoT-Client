<template>
  <div class="device-debug">
    <a-row class="page-title-row">
      <a-col :span="12">
        <h4 class="page-title">设备调试</h4>
      </a-col>
      <a-col :span="12" class="text-right page-operators">
        <a-button class="page-title-button" @click="refresh"><a-icon type="sync" />刷新</a-button>
      </a-col>
    </a-row>
    <div class="main-content">
      <a-row class="block-white block-normal">
        <a-col :span="12" class="debug-form">
          <a-form
            :form="debugInfo.debugForm"
            :label-col="contentConfig.form.labelCol"
            :wrapper-col="contentConfig.form.wrapperCol"
            class="content-form"
          >
            <a-form-item label="所属产品">
              <a-select placeholder="请选择产品" v-decorator="['pid', { rules: [ validators.requiredRuleFactory('产品', 'select')]}]" @change="productChangeHandler">
                <a-select-option v-for="(item, index) in remoteData.productList" :key="`product${ index }`" :value="item.pid">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="选择设备">
              <a-select placeholder="请选择设备" v-decorator="['sn', { rules: [ validators.requiredRuleFactory('设备', 'select')]}]">
                <a-select-option v-for="(item, index) in remoteData.deviceList" :key="`device${ index }`" :value="item.sn">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="消息类型">
              <a-radio-group v-decorator="['messageType', { initialValue: 'down' }]" @change="messageTypeChangeHandler">
                <a-radio value="down">功能点下发</a-radio>
                <a-radio value="up">功能点上报</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="功能点">
              <a-select placeholder="请选择功能点" v-decorator="['index', { rules: [ validators.requiredRuleFactory('功能点', 'select')]}]" @change="functionChangeHandler">
                <a-select-option v-for="(item, index) in filteredFunctionList" :key="`function${ index }`" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="数据类型">
              {{ debugInfo.dataType }}
            </a-form-item>
            <a-form-item label="功能点值">
              <a-textarea placeholder="最多255个字符，应符合JSON格式" v-decorator="['value', { rules: [ validators.requiredRuleFactory('功能点值'), validators.maxWordsFactory(255), ]}]" :rows='5'></a-textarea>
            </a-form-item>
            <a-form-item label="发送设置">
              <a-select v-model="debugInfo.requestType" placeholder="请选择发送模式">
                <a-select-option value="once">单次发送</a-select-option>
                <a-select-option value="loop">循环发送</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item v-if="debugInfo.requestType === 'loop'" label="发送间隔">
              <a-input-number v-model="debugInfo.requestInterval" placeholder="3-3600, 单位秒" min="3" max="3600" />
            </a-form-item>
          </a-form>
          <a-row>
            <a-col :span="22" class="text-right">
              <a-button v-if="looping" type="primary" :loading="shakeproof" class="stop-button" @click="stop">停止</a-button>
              <a-button v-else :loading="shakeproof" type="primary" @click="executeCommand">发送</a-button>
              <a-button @click="reset">重置</a-button>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="12" class="message-log">
          <a-row>
            <a-col :span="12">
              <span class="message-log-title">消息日志</span>
            </a-col>
            <a-col :span="12" class="text-right">
              <span class="clickable" @click="messageLogList = []">清屏</span>
            </a-col>
          </a-row>
          <a-row>
            <a-col v-if="messageLogList.length > 0" :span="24" class="message-log-container">
              <div v-for="(log, index) in messageLogList" :key="'log' + index" class="message-block">
                <!-- <div class="message-timestamp">
                  获取属性 {{ log.time }}
                </div> -->
                <div class="message-result">
                  result: {{ log.result }}
                </div>
                <div class="message-message">
                  message: {{ log.message }}
                </div>
                <div v-if="index < (messageLogList.length - 1)" class="message-seperator" />
              </div>
            </a-col>
            <a-col v-else :span="24">
              <h4>暂无数据</h4>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { getProductList, getDeviceList, getFunctionList, postCommand } from '@/assets/api/ajax'
import Product from '@/assets/classes/Product'
import DeviceID from '@/assets/classes/DeviceID'
import { contentConfig } from '@/assets/config'

export default {
  data() {
    return {
      remoteData: {
        original: {},
        productList: [],
        deviceList: [],
        functionList: [],
      },
      debugInfo: {
        messageType: 'down',
        function: {},
        dataType: '请先选择功能点',
        value: '',
        requestType: 'once',
        requestInterval: 3,
        debugForm: this.$form.createForm(this, { name: 'debugForm' }),
      },
      deviceList: {
        resultList: [],
      },
      functionData: {},
      messageLogList: [],
      looping: false,
      shakeproof: false,
      interval: null,
      gettingFunction: false,
      showIDInput: false,
      contentConfig,
    }
  },
  computed: {
    filteredFunctionList() {
      return this.remoteData.functionList.filter(ele => ele[this.debugInfo.messageType])
    },
  },
  created() {
    this.getProductList()
  },
  methods: {
    async getProductList() {
      await getProductList(this, { obj: this.remoteData.original, name: 'productList' })
      let productList = []
      for (let item of this.remoteData.original.productList.products) {
        productList.push(new Product(item))
      }
      this.remoteData.productList = productList
    },
    async getDeviceList(pid) {
      await getDeviceList(this, {obj: this.remoteData.original, name: 'deviceList'}, {pid})
      this.remoteData.deviceList = this.remoteData.original.deviceList.devices
      let deviceList = []
      for (let item of this.remoteData.original.deviceList.devices) {
        deviceList.push(new DeviceID.Device(item))
      }
      this.remoteData.deviceList = deviceList
    },
    productChangeHandler(pid) {
      this.debugInfo.debugForm.resetFields(['sn', 'index'])
      this.debugInfo.dataType = '请先选择功能点'
      this.getDeviceList(pid)
      this.getFunctionList(pid)
    },
    messageTypeChangeHandler(event) {
      this.debugInfo.messageType = event.target.value
      this.debugInfo.debugForm.resetFields(['index'])
      this.debugInfo.dataType = '请先选择功能点'
    },
    async getFunctionList(pid) {
      await getFunctionList(this, {obj: this.remoteData.original, name: 'functionList'}, { pid }, '', '')
      let functionListForTransfer = []
      for (let item of this.remoteData.original.functionList.functions) {
        // 穿梭框不能用FunctionPoint，不知为何
        let functionPoint = item
        functionPoint.key = String(functionPoint.index)
        functionPoint.title = functionPoint.name
        functionListForTransfer.push(functionPoint)
      }
      this.remoteData.functionList = functionListForTransfer
    },
    functionChangeHandler(id) {
      if (!id) {
        this.debugInfo.dataType = '请先选择功能点'
        this.debugInfo.debugForm.resetFields(['value'])
      } else {
        for (let fn of this.remoteData.functionList) {
          this.debugInfo.function = fn
          if (fn.id === id) {
            this.debugInfo.dataType = this.enums.commonFunctionDataTypeEnum.getDisplay(fn.type)
            let valueObj = []
            if (fn.meta_type !== 'COMBINE') {
              valueObj.push({
                index: fn.index,
                value: {
                },
              })
            } else {
              for (let item of fn.combination) {
                valueObj.push({
                  index: item.index,
                  value: {
                  },
                })
              }
            }
            this.debugInfo.debugForm.setFieldsValue({ value: JSON.stringify(valueObj, null, 2)})
            break
          }
        }
      }
    },
    executeCommand() {
      this.debugInfo.debugForm.validateFields((err, values) => {
        if (err) return
        this.shakeproof = true
        setTimeout(() => {
          this.shakeproof = false
        }, 2000)
        let sn = values.sn
        let data = {
          pid: values.pid,
          sn: sn,
        }

        if (this.debugInfo.messageType === 'down') {
          try {
            let params = JSON.parse(values.value)
            data.params = params
          } catch (e) {
            console.debug(e.message)
            this.$toast('读取功能点值失败，请输入合法的JSON字符串', {
              customCss: {
                'background-color': '#E6A23C',
                color: '#fff',
              },
            })
            return
          }
        } else if (this.debugInfo.function.meta_type !== 'COMBINE') {
          data.params = [{
            index: this.debugInfo.function.index,
          }]
        }

        if (this.debugInfo.function.meta_type === 'COMBINE') {
          data.group_id = this.debugInfo.function.index
        }
        if (this.debugInfo.requestType === 'loop') {
          this.interval = setInterval(() => {
            this.request(data)
          }, this.debugInfo.requestInterval * 1000)
          this.looping = true
        } else {
          this.request(data)
        }
      })
    },
    async request(data) {
      let result = await postCommand(this, data, '发送命令成功', '发送命令失败')
      let log = {
        message: result.payload.message,
        result: result.payload.success ? '成功' : '失败',
      }
      this.messageLogList.push(log)
    },
    stop() {
      clearInterval(this.interval)
      this.looping = false
    },
    reset() {
      this.debugInfo.debugForm.resetFields()
      this.remoteData.deviceList = []
      this.remoteData.functionList = []
      this.debugInfo.dataType = '请先选择功能点'
    },
  },
}
</script>

<style lang="stylus">
.device-debug
  .a-form-item__content
    width: 70%

  .el-select
    width: 100%

  .message-log-container
    border: solid 1px #AAA
    color: #999

    .message-block
      width: 100%
      padding: 15px

      div:not(:first-child)
        margin-top: 20px

    .message-seperator
      width: 100%
      height: 0
      border-top: solid 1px #AAA

  .execute-button, .stop-button
    background-color: #3071a9
    border-color: #3071a9
</style>
