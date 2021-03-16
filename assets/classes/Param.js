import BaseClass from './BaseClass'
import BooleanValue from './BooleanValue'
import EnumValue from './EnumValue'
import NumberValue from './NumberValue'

const paramTypeMapping = {
  INTEGER: {
    propertyName: 'num_type',
    type: NumberValue,
  },
  FLOAT: {
    propertyName: 'num_type',
    type: NumberValue,
  },
  BOOLEAN: {
    propertyName: 'boolean_type',
    type: BooleanValue,
  },
  ENUM: {
    propertyName: 'enum_type',
    type: EnumValue,
  },
}

const noAdditionalDataParamTypeList = [
  'STRING',
]


export default class Param extends BaseClass {
  constructor(param) {
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

    // 处理数据类型
    if (param.type in paramTypeMapping) {
      let type = paramTypeMapping[param.type]
      if (param[type.propertyName]) {
        param[type.propertyName] = new type.type(param[type.propertyName]).trim()
      } else {
        param[type.propertyName] = new type.type(param).trim()
      }
    } else {
      if (!noAdditionalDataParamTypeList.includes(param.type)) {
        throw new Error('Cannot create corresponding data type object for ' + param.type)
      }
    }
    super(param, structure)

    // 删除无关属性
    this.trim()
  }

  toFormObject() {
    let flatternObject = (root, object) => {
      for (let item in object) {
        if (typeof (object[item]) !== 'object') {
          root[item] = object[item]
        } else {
          flatternObject(root, object[item])
        }
      }
    }

    let obj = {}
    flatternObject(obj, this)
    return obj
  }
}
