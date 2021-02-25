import BaseClass from './BaseClass'
import BooleanValue from './BooleanValue'
import EnumValue from './EnumValue'
import NumberValue from './NumberValue'
import ExceptionValue from './ExceptionValue'
import Param from './Param'

export default class FunctionPoint extends BaseClass {
  constructor(product) {
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
    super(product, structure)
  }
}
