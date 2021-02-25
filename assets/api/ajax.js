import axios from 'axios'
import Vue from 'vue'

const baseURL = '/isa-api'
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
        setTimeout(() => removeFlag(requestFlag), 3000)
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

const gotoLogin = () => {
  const jump = () => {
    location.href = loginUrl
  }

  setTimeout(jump, 3000)
}

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
    if (dataItem.obj && dataItem.name) {
      dataItem.obj[dataItem.name] = payload
    }
    if (vueObj && successToast.length > 0) {
      vueObj.$toast(successToast, successToastOption)
    }
  }).catch((error) => {
    flag = false
    payload = error.message
    if (error.message === 'dense requests') return
    if (error.response && error.response.status === 401) {
      if (vueObj) {
        vueObj.$toast('鉴权失败，登录已过期，3秒后回到登录页面。')
        gotoLogin()
      }
      return
    }
    if (vueObj && failureToast.length > 0) {
      vueObj.$toast(failureToast + `，消息是${error.message }`, failureToastOption)
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
    if (error.response.status === 401) {
      if (vueObj) {
        vueObj.$toast('鉴权失败，登录已过期，3秒后回到登录页面。')
        gotoLogin()
      }
      return
    }
    if (vueObj && failureToast.length > 0) {
      vueObj.$toast(failureToast + `，消息是${error.message}`, failureToastOption)
    }
  })

  return {
    flag,
    payload,
  }
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

export const postPasswordReset = postRequestFactory('/usrmng/user/password/reset')

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
