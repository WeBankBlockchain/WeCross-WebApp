import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

// create an axios instance
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
request.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['Accept'] = 'application/json'
    config.headers['content-type'] = 'application/json;charset=UTF-8'

    return config
  },
  error => {
    // do something with request error
    console.log('err: ', error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
request.interceptors.response.use(
  response => {
    if (!response) {
      Message({
        message: 'HTTP返回为空!',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error('HTTP返回为空'))
    }
    if (!response.status) {
      Message({
        message: 'HTTP响应状态码为空!',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error('HTTP响应状态码为空!'))
    }
    const res = response.data
    const status = response.status
    if (status !== 200) {
      Message({
        message: res.message || 'Error: status is' + status,
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
          store.dispatch('user/resetSecKey').then(() => {
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
    // another tab login, should fresh status
    if (axios.isCancel(error)) {
      throw new Error('canceled')
    } else if (error.message === 'needRefresh') {
      throw new Error('当前页面状态已变化，请刷新页面再重试！')
    }
    // timeout
    if (error.message.includes('timeout')) {
      Message({
        message: '请求超时，请检查后台服务：' + error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(error.message || '请求超时，请检查后台服务'))
    }
    // no response status
    if (typeof error.response !== 'undefined' && typeof error.response.status !== 'undefined') {
      const status = error.response.status
      switch (status) {
        case 401 :
          MessageBox.confirm('您的登录态已超时，请重新登录', '超时提醒', {
            confirmButtonText: '重登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetSecKey').then(() => {
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
  }
)

export default request
