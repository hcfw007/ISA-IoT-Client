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
  enumObj.getTransfer = function(str) {
    let index = this.displayList.indexOf(str)
    if (index === -1) {
      return null
    }
    return this.transferList[index]
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

export default {
  protocolEnum,
  deviceTypeEnum,
  connectionTypeEnum,
}
