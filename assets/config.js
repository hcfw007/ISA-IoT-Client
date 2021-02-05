export const menuStructure = [{
  id: 'index',
  addr: '/',
  title: '平台概览',
  available: true,
}, {
  id: 'deviceAccess',
  title: '设备接入',
  children: [{
    id: 'productManagement',
    addr: '/deviceAccess/productManagement',
    title: '产品管理',
    available: true,
  }, {
    id: 'deviceManagemet',
    addr: '/deviceAccess/deviceManagemet',
    title: '设备管理',
    available: true,
  }, {
    id: 'deviceIdentification',
    addr: '/deviceAccess/deviceIdentification',
    title: '设备标识申请',
    available: true,
  }, {
    id: 'deviceDebug',
    addr: '/deviceAccess/deviceDebug',
    title: '设备调试',
    available: true,
  }, {
    id: 'customProtocolAccess',
    addr: '/deviceAccess/customProtocolAccess',
    title: '自定义协议接入',
    available: true,
  }],
}, {
  id: 'deviceOperation',
  title: '设备运维',
  children: [{
    id: 'deviceLog',
    addr: '/deviceOperation/deviceLog',
    title: '设备日志',
    available: true,
  }, {
    id: 'remoteUpgrade',
    addr: '/deviceOperation/remoteUpgrade',
    title: '远程升级',
    available: true,
  }],
}]

export const drawerConfig = {
  width: 700,
  form: {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  },
}
