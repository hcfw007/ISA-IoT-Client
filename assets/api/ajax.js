import axios from 'axios'
import Vue from 'vue'
import { Base64 } from 'js-base64'

const baseURL = '/isa-client'
const headers = {}

const instance = axios.create({
  baseURL,
  headers,
  timeout: 5000,
  antiShake: true,
})

// 防抖

const requestList = []
const CancelToken = axios.CancelToken
const removeFlag = (flag) => {
  requestList.splice(requestList.findIndex(item => item === flag), 1)
}

instance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    if (config.method === 'get') {
      return config
    }
    if (!config.antiShake) {
      return config
    }
    config.cancelToken = new CancelToken((cancel) => {
      let requestFlag = JSON.stringify(config.url) + JSON.stringify(config.data) + '&' + config.method
      if (requestList.includes(requestFlag)) {
        cancel('dense requests')
        Vue.prototype.$toast('重复请求，请3秒后再试...', failureToastOption)
      } else {
        requestList.push(requestFlag)
        setTimeout(() => removeFlag(requestFlag), 2000)
      }
    })

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 回到登录
const loginUrl = '/user/login'

export const gotoLogin = (() => {
  let goingBack = false
  return (vueObj, msg = '登录已过期') => {
    const jump = () => {
      vueObj.$router.push(loginUrl)
      goingBack = false
    }

    if (goingBack) {
      return
    } else {
      goingBack = true
      vueObj.$toast(`${ msg }，3秒后回到登录页面。`)
      setTimeout(jump, 3000)
    }
  }
})()

const successToastOption = {
  customCss: {
    'background-color': '#67C23A',
    color: '#fff',
  },
}

const failureToastOption = {
  customCss: {
    'background-color': '#E6A23C',
    color: '#fff',
  },
}

const urlReplace = (url, urlReplacementItem) => {
  let _url = url
  for (let item in urlReplacementItem) {
    _url = _url.replace('{' + item + '}', urlReplacementItem[item])
  }
  return _url
}

const getRequestFactory = url => async (vueObj, dataItem = {}, params = {}, successToast = '', failureToast = '', urlReplacer = {}) => {
  let _url = urlReplace(url, urlReplacer)
  let flag = 'origin'
  let payload = null
  await instance.get(_url, { params }).then((response) => {
    if (response.status !== 200) {
      flag = false
      throw new Error('Network Error')
    }
    if (response.data.code && Number(response.data.code) !== 200) {
      flag = false
      throw new Error(response.data.msg)
    }
    flag = true
    payload = response.data.data
    if (dataItem && dataItem.obj && dataItem.name) {
      dataItem.obj[dataItem.name] = payload
    }
    if (vueObj && successToast.length > 0) {
      vueObj.$toast(successToast, successToastOption)
    }
  }).catch((error) => {
    flag = false
    payload = error.message
    if (dataItem.obj && dataItem.name) {
      dataItem.obj[dataItem.name] = {}
    }
    if (error.message === 'dense requests') return
    if (error.response && error.response.status === 401 && error.response.data.msg === '鉴权失败！') {
      if (vueObj) {
        gotoLogin(vueObj)
      }
      return
    }
    if (vueObj && failureToast.length > 0) {
      let message = error.message
      if (error.reponse && error.reponse.data) {
        message = error.response.data.msg
      }
      vueObj.$toast(failureToast + `，消息是${message }`, failureToastOption)
    }
  })

  return {
    flag,
    payload,
  }
}

const postRequestFactory = url => async (vueObj, data = {}, successToast = '', failureToast = '', urlReplacer = {}) => {
  let _url = urlReplace(url, urlReplacer)
  let flag = 'origin'
  let payload = null
  await instance.post(_url, data).then((response) => {
    if (response.status !== 200) {
      flag = false
      throw new Error('Network Error')
    }
    if (response.data.code && Number(response.data.code) !== 200) {
      flag = false
      throw new Error(response.data.msg)
    }
    flag = true
    payload = response.data.data
    if (vueObj && successToast.length > 0) {
      vueObj.$toast(successToast, successToastOption)
    }
  }).catch((error) => {
    flag = false
    payload = error.message
    if (error.message === 'dense requests') return
    if (error.response && error.response.status === 401 && error.response.data.msg === '鉴权失败！') {
      if (vueObj) {
        gotoLogin(vueObj)
      }
      return
    }
    if (vueObj && failureToast.length > 0) {
      let message = error.message
      if (error.response && error.response.data) {
        message = error.response.data.msg
      }
      vueObj.$toast(failureToast + `，消息是${message}`, failureToastOption)
    }
  })

  return {
    flag,
    payload,
  }
}

// 对下载文件名进行base64解码
const downloadProcessor = (response) => {
  let data = response.data
  let url = window.URL.createObjectURL(data)
  let download = document.createElement('a')
  download.href = url
  download.target = '_blank'
  try {
    let disposition = response.headers['content-disposition']
    let filename = disposition.split(';')[1].split('?UTF8?B?')[1]
    download.download = Base64.decode(filename)
  } catch (e) {
    console.debug(e.message)
  }
  download.click()
  window.URL.revokeObjectURL(download.href)
}

export const getVerifyImg = uuid =>
  instance.get('/usrmng/user/register/picture-code', {
    responseType: 'blob',
    params: {
      uuid,
    },
  })

// 用户注册登录
export const getSMSCode = getRequestFactory('/usrmng/user/register/sms-code')
export const getMailCode = getRequestFactory('/usrmng/user/register/email-code')

export const postUserRegister = postRequestFactory('/usrmng/user/register')

export const postUserPasswordLogin = postRequestFactory('/usrmng/user/login/account')
export const postUserMailLogin = postRequestFactory('/usrmng/user/login/quick/email')
export const postUserMobileLogin = postRequestFactory('/usrmng/user/login/quick/phone')

export const getUserInfo = getRequestFactory('/usrmng/user/info')

export const logout = postRequestFactory('/usrmng/user/logout')

export const postPasswordReset = postRequestFactory('/usrmng/user/password/reset')

// 用户实名认证相关

export const postPersonalIdApplication = postRequestFactory('/usrmng/identity/person/apply')
export const postOrganizationIdApplication = postRequestFactory('/usrmng/identity/enterprise/apply')

export const getUserIdInfo = getRequestFactory('/usrmng/user/{userId}/identity')

// 产品信息子模块
export const getProductList = getRequestFactory('/thing-models/products/ops')

export const getProductDetail = getRequestFactory('/thing-models/products/ops/{pid}')

export const postNewProduct = postRequestFactory('/thing-models/products/ops')
export const postEditedProduct = postRequestFactory('/thing-models/products/ops/put')
export const deleteProduct = postRequestFactory('/thing-models/products/ops/delete/{pid}')
export const publishProduct = postRequestFactory('/thing-models/products/publish/{pid}')

// 行业/类别信息
export const getIndustryList = getRequestFactory('/thing-models/industry/ops')
export const getCategoryList = getRequestFactory('/thing-models/product-categories/ops')

// 设备管理
export const getProductDetailWithDeviceStastic = getRequestFactory('/devmng/devices/statistics/{pid}')

// 功能点
export const getFunctionList = getRequestFactory('/thing-models/functions/opts')

export const postStandardFunction = postRequestFactory('/thing-models/functions/imp-standard')
export const postCustomFunction = postRequestFactory('/thing-models/functions/custom')
export const editFunction = postRequestFactory('/thing-models/functions/opts/put')

export const postCombinedFunction = postRequestFactory('/thing-models/functions/combine')
export const editCombinedFunction = postRequestFactory('/thing-models/functions/combine/put')

export const deleteFunction = postRequestFactory('/thing-models/functions/opts/delete/{pid}:{index}')

// 设备
export const getDeviceList = getRequestFactory('/devmng/devices/ops')
export const getDeviceStatistics = getRequestFactory('/devmng/devices/statistics')

export const postDevice = postRequestFactory('/devmng/devices/ops')

export const deleteDevice = postRequestFactory('/devmng/devices/ops/delete/{sn}')

export const getDeviceDetail = getRequestFactory('/devmng/devices/ops/{sn}')
export const getDeviceFunctionList = getRequestFactory('/thing-models/device/functions/list')

// 设备标识
export const getDeviceIdentificationList = getRequestFactory('/devmng/devices/identities/ops')

export const postDeviceIdentification = postRequestFactory('/devmng/devices/identities/ops')

export const getDeviceIdentificationNumberAvailable = getRequestFactory('/devmng/devices/identities/avail/{pid}')

// commands
export const postWriteCommand = postRequestFactory('/devices/write/commands')
export const postReadCommand = postRequestFactory('/devices/read/commands')

export const postFunctionFile = (data, progressCallback) =>
  instance.post('/functions/import/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      let complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
      if (progressCallback) {
        progressCallback(complete)
      }
    },
  })

export const postDeviceFile = (data, progressCallback) =>
  instance.post('/devmng/devices/import', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      let complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
      if (progressCallback) {
        progressCallback(complete)
      }
    },
  })

export const downloadSDK = pid => {
  instance.get(`/devices/${pid}/sdk`, {
    responseType: 'blob',
  }).then(downloadProcessor)
}

export const downloadIdentification = sn => {
  instance.get(`/devmng/devices/identities/download/${sn}`, {
    responseType: 'blob',
  }).then(downloadProcessor)
}

export const exportFunction = pid =>
  instance.get('/thing-models/functions/export?pid=' + pid, {
    responseType: 'blob',
  }).then(downloadProcessor)

export const exportDevices = queryObject =>
  instance.get('/devmng/devices/export' + queryStringfy(queryObject), {
    responseType: 'blob',
  }).then(downloadProcessor)

export const simpleDownload = (url, queryObject = {}) => {
  instance.get(url + queryStringfy(queryObject), {
    responseType: 'blob',
  }).then(downloadProcessor)
}

const queryStringfy = (qsObj) => {
  let count = 0
  let str = ''
  for (let key in qsObj) {
    str += count > 0 ? '&' : '?'
    str += `${key}=${qsObj[key]}`
  }
  return str
}
