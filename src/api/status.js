import request from '@/utils/request'

/**
 * get the status of system
 * @return {Promise} an axios promise object of response
 */
export function systemStatus() {
  return request({
    url: '/sys/systemStatus',
    method: 'get'
  })
}

/**
 * list supported chain types
 * @return {Promise} an axios promise object of response
 */
export function supportedStubs(params) {
  return request({
    url: '/sys/supportedStubs',
    method: 'get',
    params
  })
}

/**
 * get router status
 * @return {Promise} an axios promise object of response
 */
export function routerStatus() {
  return request({
    url: '/sys/routerStatus',
    method: 'get'
  })
}
