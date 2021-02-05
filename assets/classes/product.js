import checker from './checkers'
import enums from './enums'

export default class Product {
  Structure = {
    category_id: {
      type: 'string',
      required: true,
      description: '产品类别id',
    },
    connection: {
      type: 'enum',
      enum: enums.connectionTypeEnum,
      required: true,
      description: '联网方式',
    },
    industry_id: {
      type: 'string',
      required: true,
      description: '行业id',
    },
    model: {
      type: 'string',
      required: true,
      description: '型号',
    },
    name: {
      type: 'string',
      required: true,
      description: '产品名称',
    },
    protocol: {
      type: 'enum',
      enum: enums.protocolEnum,
      required: true,
      description: '协议',
    },
    remark: {
      type: 'string',
      required: true,
      description: '备注',
    },
    device_node: {
      type: 'enum',
      enum: enums.deviceTypeEnum,
      required: true,
      description: '设备类型',
    },
  }
  constructor(product = {}) {
    let { result, message } = checker.check(product, this.Structure)
    if (!result) {
      throw new Error(message)
    }
    for (let key in product) {
      this[key] = product[key]
    }
  }
  toRemoteObj() {
    let obj = {}
    for (let key in this) {
      if (key == 'Structure') {
        continue
      }
      obj[key] = this[key]
    }
    return obj
  }
}
