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
    protocol_type: {
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
    created_at: {
      type: 'string',
      required: true,
      description: '创建时间',
    },
    updated_at: {
      type: 'string',
      required: true,
      description: '更新时间',
    },
  }
  constructor(product = {}) {
    let { result, message } = checker.check(product, this.Structure)
    if (!result) {
      // throw new Error(message)
      console.debug(message)
    }
    for (let key in product) {
      if (product[key] !== undefined) {
        this[key] = product[key]
      } else {
        if (this.Structure[key] && (this.Structure[key].type === 'array' || this.Structure[key].type === 'enum')) {
          this[key] = []
        } else {
          this[key] = ''
        }
      }
    }
    for (let key in this.Structure) {
      if (this[key] !== undefined) continue
      if (this.Structure[key].type === 'array' || this.Structure[key].type === 'enum') {
        this[key] = []
      } else {
        this[key] = ''
      }
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
