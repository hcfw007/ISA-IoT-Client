const enumCreator = (obj) => {
  let enumObj = {
    originalObj: JSON.parse(JSON.stringify(obj)),
    displayList: [],
    transferList: [],
  }
  for (let key in obj) {
    let item = obj[key]
    if (typeof(item) !== 'string') {
      throw new Error('unable to create enum')
    }
    enumObj.displayList.push(item)
    enumObj.transferList.push(key)
  }
  enumObj.getDisplay = function(str) {
    let index = this.transferList.indexOf(str)
    if (index === -1) {
      return null
    }
    return this.displayList[index]
  }
  enumObj.getDisplayList = function(arr) {
    let str = ''
    for (let index in arr) {
      let item = arr[index]
      if (index > 0) {
        str += ', '
      }
      str += this.getDisplay(item)
    }
    return str
  }
  enumObj.getTransfer = function(str) {
    let index = this.displayList.indexOf(str)
    if (index === -1) {
      return null
    }
    return this.transferList[index]
  }
  enumObj.getTransferList = function(arr) {
    let str = ''
    for (let index in arr) {
      let item = arr[index]
      if (index > 0) {
        str += ', '
      }
      str += this.getTransfer(item)
    }
    return str
  }
  return enumObj
}

export const connectionTypeEnum = enumCreator({
  _2G: '2G',
  _4G: '4G',
  NBIoT: 'NBIoT',
  WIFI: 'Wifi',
  ETHERNET: '以太网',
  OTHER: '其他',
})

export const protocolEnum = enumCreator({
  MQTT: 'MQTT协议',
  CoAP: 'CoAP协议',
  TCP: 'tcp协议',
  CUSTOM: '自定义协议',
})

export const deviceTypeEnum = enumCreator({
  DIRECT: '直连设备',
  CHILD: '子设备',
  GATEWAY: '网关设备',
})

export const functionTypeEnum = enumCreator({
  COMMON: '属性类型',
  EVENT: '事件类型',
})

export const commonFunctionDataTypeEnum = enumCreator({
  BOOLEAN: '布尔型',
  INTEGER: '整数型',
  FLOAT: '浮点型',
  ENUM: '枚举型',
  EXCEPTION: '故障型',
  STRING: '字符串型',
  BUFFER: '透传型',
  DATE: '日期型',
})

export const paramDataTypeEnum = enumCreator({
  BOOLEAN: '布尔型',
  INTEGER: '整数型',
  FLOAT: '浮点型',
  ENUM: '枚举型',
  STRING: '字符串型',
})

export const transferTypeEnum = enumCreator({
  upAndDown: '可上报可下发',
  up: '只可上报',
  down: '只可下发',
})

export const eventTypeEnum = enumCreator({
  INFO: '信息型',
  WARNING: '告警型',
  FAULT: '故障型',
})

export const deviceStatusEnum = enumCreator({
  UNACTIVATED: '未激活',
  ON_LINE: '在线',
  OFF_LINE: '离线',
})

export default {
  protocolEnum,
  deviceTypeEnum,
  connectionTypeEnum,
  functionTypeEnum,
  commonFunctionDataTypeEnum,
  transferTypeEnum,
  eventTypeEnum,
  paramDataTypeEnum,
  deviceStatusEnum,
}
