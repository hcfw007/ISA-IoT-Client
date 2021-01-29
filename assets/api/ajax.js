import axios from 'axios'
import Vue from 'vue'

const baseURL = '/isa-api'
const headers = {}

const instance = axios.create({
  baseURL,
  headers,
  timeout: 5000,
})

const requestList = []
const CancelToken = axios.CancelToken
const removeFlag = (flag) => {
  requestList.splice(requestList.findIndex(item => item === flag), 1)
}

instance.interceptors.request.use(
  (config) => {
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
    _url = _url.replace('${' + item + '}', urlReplacementItem[item])
  }
  return _url
}

const getRequestFactory = url => async(vueObj, dataItem, params = {}, successToast = '', failureToast = '', urlReplacer = {}) => {
  let _url = urlReplace(url, urlReplacer)
  let flag = 'origin'
  await instance.get(url).then((response) => {
    console.log(1)
  })
}

export const getVerifyImg = uuid =>
  instance.get('/usrmng/user/register/picture-code', {
    responseType: 'blob',
    params: {
      uuid,
    },
  })
