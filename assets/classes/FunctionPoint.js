import BaseClass from './BaseClass'
import BooleanValue from './BooleanValue'
import EnumValue from './EnumValue'
import NumberValue from './NumberValue'
import ExceptionValue from './ExceptionValue'
import { transferTypeEnum, paramDataTypeEnum } from './enums'

const CommonFunctionTypeMapping = {
  INTEGER: {
    propertyName: 'number',
    type: NumberValue,
  },
  FLOAT: {
    propertyName: 'number',
    type: NumberValue,
  },
  BOOLEAN: {
    propertyName: 'boolean_value',
    type: BooleanValue,
  },
  ENUM: {
    propertyName: 'enum_value',
    type: EnumValue,
  },
  EXCEPTION: {
    propertyName: 'exception',
    type: EnumValue,
  },
}

const noAdditionalDataFunctionTypeList = [
  'STRING',
  'BUFFER',
  'DATE',
]

export default class FunctionPoint extends BaseClass {
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
      event_type: {
        type: 'string',
        required: false,
        description: '事件类型',
      },
      type: {
        type: 'string',
        required: false,
        description: '数据类型',
      },
      remark: {
        type: 'string',
        required: false,
        description: '备注',
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
      boolean_value: {
        type: BooleanValue,
        required: false,
        description: '布尔功能点',
      },
      enum_value: {
        type: EnumValue,
        required: false,
        description: '枚举功能点',
      },
      number: {
        type: NumberValue,
        required: false,
        description: '数值功能点',
      },
      exception: {
        type: ExceptionValue,
        required: false,
        description: '故障功能点',
      },
      params: {
        type: 'array',
        required: false,
        description: '事件类型参数数组',
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
      updated_at: {
        type: 'string',
        required: false,
        description: '更新时间',
      },
      up_value: {
        type: 'string',
        required: false,
        description: '上报值（最新值）',
      },
      function_id: {
        type: 'string',
        required: false,
        description: '父功能点id',
      },
    }
    // 处理数据类型
    if (functionPoint.fn_type === 'COMMON') {

      if (functionPoint.type in CommonFunctionTypeMapping) {
        let type = CommonFunctionTypeMapping[functionPoint.type]
        if (functionPoint[type.propertyName]) {
          functionPoint[type.propertyName] = new type.type(functionPoint[type.propertyName]).trim()
        } else {
          functionPoint[type.propertyName] = new type.type(functionPoint).trim()
        }
      } else {
        if (!noAdditionalDataFunctionTypeList.includes(functionPoint.type)) {
          throw new Error('Cannot create corresponding data type object for ' + functionPoint.type)
        }
      }
    }

    if (functionPoint.fn_type === 'EVENT') {
      structure.event_type.required = true
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
        if (typeof(object[item]) !== 'object' || Array.isArray(object[item])) {
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

  getdataDefinition() {
    if (this.fn_type !== 'COMMON' || noAdditionalDataFunctionTypeList.includes(this.type)) {
      return ''
    }
    let type = CommonFunctionTypeMapping[this.type].propertyName
    let fnObj = this[type]
    let str = ''
    let count = 0
    for (let item in fnObj) {
      let description = fnObj.$Structure[item].description
      if (count > 0) {
        str += '；'
      }
      str += `${description}为${Array.isArray(fnObj[item]) ? fnObj[item].join('/') : fnObj[item] }`
      count ++
    }
    return str
  }

  getParams() {
    if (this.fn_type !== 'EVENT') {
      return ''
    }
    let str = ''
    let count = 0
    for (let item in this.params) {
      let param = this.params[item]
      if (count > 0) {
        str += '；'
      }
      str += `${ param.name }，${ paramDataTypeEnum.getDisplay(param.type) }`
      count ++
    }
    return str
  }
}
