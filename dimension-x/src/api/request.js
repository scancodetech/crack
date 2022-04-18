import axios from 'axios'
import qs from 'qs'
import sign from './sign.js'

// 线上环境请求
let baseURL = process.env.VUE_APP_BASE_API
// 创建axios实例
const service = axios.create({
  baseURL,
  timeout: 200000 // 请求超时时间
  // withCredentials: true
})
// axios.defaults.headers.post['Content-Type'] = 'application/json'

// request拦截器
service.interceptors.request.use(config => {
  if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
    config.data = config.data || {}
    if (!config.noSign) { // 需要签名
      config.data = {
        ...config.data,
        sign: sign(config.data)
      }
    }
    if (!config.noStringify) {
      config.data = qs.stringify(config.data)
    }
  } else {
    if (!config.noSign && config.params) { // 需要签名
      config.params = {
        ...config.params,
        sign: sign(config.params)
      }
    }
    config.params = config.params || {}
    // config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    if (response.data.code === 200) {
      return response.data
    } else {
      
      return Promise.reject(response.data)
    }
  },
  error => {
    console.log('err' + error)// for debug
    return Promise.reject(error)
  }
)

export default service