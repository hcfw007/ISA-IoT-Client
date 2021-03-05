import BaseClass from './BaseClass'
import { transferTypeEnum } from './enums'

export default class CombinedFunctionPoint extends BaseClass {
  constructor(functionPoint) {
    let structure = {
      name: {
        type: 'string',
        required: true,
        description: '功能点名称',
      },
      subject: {
        type: 'string',
        required: true,
        description: '字段名',
      },
      fn_type: {
        type: 'string',
        required: true,
        description: '功能点类型',
      },
      product_id: {
        type: 'string',
        required: true,
        description: '产品pid',
      },
      up: {
        type: 'boolean',
        required: true,
        description: '上报',
      },
      down: {
        type: 'boolean',
        required: true,
        description: '下发',
      },
      id: {
        type: 'string',
        required: false,
      },
      index: {
        type: 'number',
        required: false,
        description: '序号，比id更常用',
      },
      combination: {
        type: 'array',
        required: false,
        description: '组合功能点用',
      },
    }

    // 处理上下行
    if (functionPoint.transferType) {
      functionPoint.up = functionPoint.transferType.toUpperCase().indexOf('UP') > -1
      functionPoint.down = functionPoint.transferType.toUpperCase().indexOf('DOWN') > -1
    }

    super(functionPoint, structure)

    // 删除无关属性
    this.trim()
  }

  getTransferType() {
    if (this.up && this.down) {
      return '可上报可下发'
    }
    if (this.up) {
      return '只可上报'
    }
    if (this.down) {
      return '只可下发'
    }
    return '你猜'
  }

  getFormTransferType() {
    return transferTypeEnum.getTransfer(this.getTransferType())
  }

  toFormObject() {
    let flatternObject = (root, object) => {
      for (let item in object) {
        if (typeof (object[item]) !== 'object' || Array.isArray(object[item])) {
          root[item] = object[item]
        } else {
          flatternObject(root, object[item])
        }
      }
    }

    let obj = {}
    flatternObject(obj, this)
    obj.transferType = this.getFormTransferType()
    return obj
  }
}
