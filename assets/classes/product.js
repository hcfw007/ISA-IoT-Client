import enums from './enums'
import BaseClass from './BaseClass'

export default class Product extends BaseClass {
  constructor(product) {
    let structure = {
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
    super(product, structure)
  }
}
