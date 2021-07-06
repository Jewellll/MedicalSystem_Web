import router from '../router/index'
import axios from 'axios'

import {Message} from 'element-ui'

axios.defaults.timeout = 50000 // 超时时间
axios.defaults.baseURL = 'http://172.17.169.0:8081'
// axios.defaults.baseURL = 'http://172.20.10.11:8443/api'
// axios.defaults.baseURL = 'http://localhost:8443/api'
// http request 拦截器
axios.interceptors.request.use(
  config => {
    config.headers.contentType = 'application/json'
    if (localStorage.token) { // 判断token是否存在
      config.headers.Authorization = localStorage.token // 将token设置成请求头
    }
    return config
  },
  err => {
    // router.push({path: "/NotFound"});
    return Promise.reject(err)
  }
)
// http response 拦截器
axios.interceptors.response.use(
  response => {
    //     switch (response.data.code) {
    //         case '200':
    //             break;
    //         case '104':
    //             break;
    //         case '-2':
    //             window.localStorage.removeItem('token')
    //     }
    // console.log('response')
    return response
  },
  error => {
    // 对响应错误做点什么
    // if (error.response) {
    //     switch (error.response.code) {
    //         case 404:
    //            router.push( "/404");
    //             break;
    //         case 500:
    //             router.push({path: "/500"});
    //             break;
    //         case 503:
    //             router.push({path: "/503"});
    //             break;
    //     }
    // } else {
    //     router.push({path: "/NotFound"});
    // }
    return Promise.reject(error)
  }
)
export default axios
