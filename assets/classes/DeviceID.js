import BaseClass from './BaseClass'

class DeviceIdenticationApplication extends BaseClass {
  constructor(application) {
    let structure = {
      amount: {
        type: 'number',
        required: true,
        description: '申请数量',
      },
      contact: {
        type: 'string',
        required: true,
        description: '联系人',
      },
      contact_tel: {
        type: 'string',
        required: true,
        description: '联系人电话',
      },
      product_id: {
        type: 'string',
        required: true,
        description: '产品pid',
      },
      product_system: {
        type: 'string',
        required: false,
        description: '操作系统',
      },
      protocol: {
        type: 'string',
        required: false,
        description: '接入协议',
      },
    }
    super(application, structure)
  }
}

class Device extends BaseClass {
  constructor(device) {
    let structure = {
      sn: {
        type: 'string',
        required: true,
        description: '设备标识',
      },
      name: {
        type: 'string',
        required: true,
        description: '设备名称',
      },
      status: {
        type: 'string',
        required: true,
        description: '设备状态',
      },
      product_node_type: {
        type: 'string',
        required: true,
        description: '节点类型',
      },
      operated_at: {
        type: 'string',
        required: true,
        description: '最近在线时间',
      },
      created_at: {
        type: 'string',
        required: true,
        description: '添加时间',
      },
      activated_at: {
        type: 'string',
        required: true,
        description: '激活时间',
      },
    }
    super(device, structure)
  }
}


const DeviceID = {
  DeviceIdenticationApplication,
  Device,
}

export default DeviceID
