export const productListTable = [
  {
    title: '产品名称',
    dataIndex: 'name',
  }, {
    title: '产品ID',
    dataIndex: 'pid',
  }, {
    title: '行业类型',
    dataIndex: 'industry_name',
  }, {
    title: '节点类型',
    dataIndex: 'device_node',
    scopedSlots: {
      customRender: 'node',
    },
  }, {
    title: '接入协议',
    dataIndex: 'protocol_type',
    scopedSlots: {
      customRender: 'protocol',
    },
  }, {
    title: '添加时间',
    dataIndex: 'created_at',
    scopedSlots: {
      customRender: 'created_at',
    },
  }, {
    title: '发布状态',
    dataIndex: 'publish',
    scopedSlots: {
      customRender: 'release_status',
    },
  }, {
    title: '操作',
    scopedSlots: {
      customRender: 'operators',
    },
    width: '280px',
  },
]

export const deviceListTable = [
  {
    title: '设备标识（展示后缀）',
    dataIndex: 'sn',
  }, {
    title: '设备名称',
    dataIndex: 'name',
  }, {
    title: '所属产品',
    dataIndex: 'product_name',
  }, {
    title: '设备状态',
    dataIndex: 'status',
    scopedSlots: {
      customRender: 'status',
    },
  }, {
    title: '节点类型',
    dataIndex: 'product_node_type',
    scopedSlots: {
      customRender: 'node',
    },
  }, {
    title: '最近在线时间',
    dataIndex: 'operated_at',
    scopedSlots: {
      customRender: 'latest_at',
    },
  }, {
    title: '添加时间',
    dataIndex: 'created_at',
    scopedSlots: {
      customRender: 'created_at',
    },
  }, {
    title: '操作',
    scopedSlots: {
      customRender: 'operators',
    },
  },
]

export const deviceIdentificationListTable = [
  {
    title: '申请流水号',
    dataIndex: 'apply_sn',
  }, {
    title: '产品名称',
    dataIndex: 'product_name',
  }, {
    title: '审批状态',
    dataIndex: 'status',
    scopedSlots: {
      customRender: 'status',
    },
  }, {
    title: '申请数量',
    dataIndex: 'amount',
  }, {
    title: '申请时间',
    dataIndex: 'created_at',
    scopedSlots: {
      customRender: 'created_at',
    },
  }, {
    title: '操作',
    scopedSlots: {
      customRender: 'operators',
    },
  },
]

export const deviceLogListTable = [
  {
    title: '设备名称',
  }, {
    title: '所属产品',
  }, {
    title: '业务类型',
  }, {
    title: '时间',
  }, {
    title: '结果',
  }, {
    title: '详情',
  },
]

export const functionListTable = [
  {
    title: '功能ID',
    dataIndex: 'index',
  }, {
    title: '功能类型',
    dataIndex: 'fn_type',
    scopedSlots: {
      customRender: 'functionType',
    },
  }, {
    title: '功能点名称',
    dataIndex: 'name',
  }, {
    title: '字段名称',
    dataIndex: 'subject',
  }, {
    title: '数据类型',
    dataIndex: 'type',
    scopedSlots: {
      customRender: 'dataType',
    },
  }, {
    title: '传输类型',
    scopedSlots: {
      customRender: 'transferType',
    },
  }, {
    title: '操作',
    scopedSlots: {
      customRender: 'operators',
    },
  },
]

export const combinedFunctionListTable = [
  {
    title: '功能ID',
    dataIndex: 'index',
  }, {
    title: '功能类型',
    dataIndex: 'fn_type',
    scopedSlots: {
      customRender: 'functionType',
    },
  }, {
    title: '功能点名称',
    dataIndex: 'name',
  }, {
    title: '字段名称',
    dataIndex: 'subject',
  }, {
    title: '传输类型',
    scopedSlots: {
      customRender: 'transferType',
    },
  }, {
    title: '操作',
    scopedSlots: {
      customRender: 'operators',
    },
  },
]

export const deviceFunctionTable = [
  {
    title: '功能名称',
    dataIndex: 'name',
  }, {
    title: '功能类型',
    scopedSlots: {
      customRender: 'functionType',
    },
  }, {
    title: '字段名称',
    dataIndex: 'subject',
  }, {
    title: '数据类型',
    dataIndex: 'type',
    scopedSlots: {
      customRender: 'dataType',
    },
  }, {
    title: '数据值定义',
    scopedSlots: {
      customRender: 'dataDefinition',
    },
  }, {
    title: '传输类型',
    scopedSlots: {
      customRender: 'transferType',
    },
  }, {
    title: '最新值',
    dataIndex: 'up_value',
  }, {
    title: '更新时间',
    dataIndex: 'updated_at',
    scopedSlots: {
      customRender: 'updated_at',
    },
  },
]

export const deviceEventTable = [
  {
    title: '事件名称',
    dataIndex: 'name',
  }, {
    title: '功能类型',
    scopedSlots: {
      customRender: 'functionType',
    },
  }, {
    title: '字段名称',
    dataIndex: 'subject',
  }, {
    title: '事件类型',
    dataIndex: 'event_type',
    scopedSlots: {
      customRender: 'eventType',
    },
  }, {
    title: '时间',
    dataIndex: 'updated_at',
    scopedSlots: {
      customRender: 'updated_at',
    },
  }, {
    title: '输出参数',
    scopedSlots: {
      customRender: 'params',
    },
  },
]
