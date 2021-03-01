import BaseClass from './BaseClass'
import BooleanValue from './BooleanValue'
import EnumValue from './EnumValue'
import NumberValue from './NumberValue'
import ExceptionValue from './ExceptionValue'
import Param from './Param'

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
        required: true,
        description: '事件类型',
      },
      type: {
        type: 'string',
        required: true,
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
        type: Param,
        required: true,
        description: '事件类型参数数组',
      },
    }
    // 处理数据类型
    if (functionPoint.fn_type === 'COMMON') {
      if (functionPoint.type in CommonFunctionTypeMapping) {
        let type = CommonFunctionTypeMapping[functionPoint.type]
        console.log(type)
        functionPoint[type.propertyName] = new type.type(functionPoint).trim()
      } else {
        throw new Error('Cannot create corresponding data type object for ' + functionPoint.type)
      }
    }

    // 处理上下行
    functionPoint.up = functionPoint.transferType.toUpperCase().indexOf('UP') > -1
    functionPoint.down = functionPoint.transferType.toLowerCase().indexOf('DOWN') > -1

    super(functionPoint, structure)

    // 删除无关属性
    this.trim()
  }
}
