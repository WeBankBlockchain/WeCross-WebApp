import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    const status = response.status
    if (status !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.errorCode === 10502 || res.errorCode === 50012 || res.errorCode === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    const status = error.response.status
    switch (status) {
      case 401 :
        MessageBox.confirm('您的登录态已超时，请重新登录', '超时提醒', {
          confirmButtonText: '重登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
        break
      case 400:
        Message.error({
          message: '参数异常'
        })
        break
      case 404:
        Message.error({
          message: '请求URL错误：' + error.message,
          center: true,
          duration: 5 * 1000
        })
        break
      case 500:
        Message.error({
          message: '服务器异常'
        })
        break
      default:
        Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })
    }
    console.log('err: ' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
