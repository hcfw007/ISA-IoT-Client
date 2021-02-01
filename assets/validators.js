export const validators = {
  mobile: {
    pattern: /^1[0-9]{10}$/,
    message: '请输入合法的手机号码',
  },
  mail: {
    pattern: /^[A-Za-z0-9\u4E00-\u9FA5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    message: '请输入合法的邮箱地址',
  },
  mobileOrMail: {
    validator: (rule, value, callback) => {
      if (!value || value.length == 0) callback()
      callback (/^1[0-9]{10}$/.test(value) || /^[A-Za-z0-9\u4E00-\u9FA5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value))
    },
    message: '请输入合法的邮箱地址/手机号码',
  },
  password: {
    min: 6,
    max: 20,
    message: '密码必须在6-20位之间',
  },
  confirmPassword: {
    required: true,
    message: '请再次输入密码',
  },
  agreement: {
    validator: (rule, value, callback) => {
      return value === true
    },
    message: '请同意用户服务协议以继续',
  },
  requiredRuleFactory(itemName) {
    return {
      required: true,
      message: `请输入${itemName}`,
    }
  },
}
