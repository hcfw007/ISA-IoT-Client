import axios from 'axios'

const baseURL = '/isa-api'
const headers = {}

const instance = axios.create({
  baseURL,
  headers,
  timeout: 5000
})

const successToastOption = {
  customCss: {
    'background-color': '#67C23A',
    color: '#fff'
  }
}

const failureToastOption = {
  customCss: {
    'background-color': '#E6A23C',
    color: '#fff'
  }
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

export const getverifyImg = uuid =>
  instance.get('/usrmng/user/register/picture-code', {
    params: {
      uuid
    }
  })
