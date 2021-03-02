/* eslint-disable no-unused-vars */


const charTypeMappings = {
  letter: {
    reg: 'A-Za-z',
    msg: '字母',
  },
  number: {
    reg: '0-9',
    msg: '数字',
  },
  underline: {
    reg: '_',
    msg: '下划线',
  },
  Chinese: {
    reg: '\\u4E00-\\u9FA5',
    msg: '汉字',
  },
  lowerCase: {
    reg: 'a-z',
    msg: '小写字母',
  },
  upperCase: {
    reg: 'A-Z',
    msg: '大写字母',
  },
}

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
      if (/^1[0-9]{10}$/.test(value) || /^[A-Za-z0-9\u4E00-\u9FA5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
        callback()
      } else {
        callback(true)
      }
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
  startWithLetter: {
    pattern: /^[a-zA-Z]/,
    message: '必须以字母开头',
  },
  integerChecker: {
    validator: (rule, value, callback) => {
      return String(value).indexOf('.') === -1
    },
    message: '必须为整数',
  },
  legalCharTypeFactory(charTypeList = []) {
    let regStr = '^['
    let message = '只能包含'
    let count = 0
    for (let index in charTypeList) {
      let charType = charTypeList[index]
      if (charType in charTypeMappings) {
        if (count > 0) {
          if (Number(index) === charTypeList.length - 1) {
            message += '和'
          } else {
            message += '，'
          }
        }
        regStr += charTypeMappings[charType].reg
        message += charTypeMappings[charType].msg
        count ++
      }
    }
    regStr += ']*$'
    return {
      pattern: new RegExp(regStr),
      message,
    }
  },
  maxWordsFactory(length) {
    return {
      validator: (rule, value, callback) => {
        return value.length < length
      },
      message: `不超过${ length }个字符`,
    }
  },
  requiredRuleFactory(itemName, mode = 'input') {
    if (mode === 'input') {
      return {
        required: true,
        message: `请输入${itemName}`,
      }
    }
    if (mode === 'select') {
      return {
        required: true,
        message: `请选择${itemName}`,
      }
    }
  },
  enumRequiredFactory(itemName) {
    return {
      validator: (rule, value, callback) => {
        console.log(value)
        return value.length > 0
      },
      message: `请输入${itemName}`,
    }
  },
}
