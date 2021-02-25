import BaseClass from './BaseClass'
import BooleanValue from './BooleanValue'
import EnumValue from './EnumValue'
import NumberValue from './NumberValue'

export default class Param extends BaseClass {
  constructor(product) {
    let structure = {
      name: {
        type: 'string',
        required: true,
        description: '名称',
      },
      subject: {
        type: 'string',
        required: true,
        description: '字段名',
      },
      type: {
        type: 'string',
        required: true,
        description: '数据类型',
      },
      mark: {
        type: 'string',
        required: true,
        description: '注释',
      },
      boolean_type: {
        type: BooleanValue,
        required: false,
        description: '布尔功能点',
      },
      enum_type: {
        type: EnumValue,
        required: false,
        description: '枚举功能点',
      },
      num_type: {
        type: NumberValue,
        required: false,
        description: '数值功能点',
      },
    }
    super(product, structure)
  }
}
