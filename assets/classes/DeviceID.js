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

const DeviceID = {
  DeviceIdenticationApplication,
}

export default DeviceID
