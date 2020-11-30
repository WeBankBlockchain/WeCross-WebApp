import request from '@/utils/request'

export function systemStatus(params) {
  return request({
    url: '/sys/systemStatus',
    method: 'get',
    params
  })
}

export function supportedStubs(params) {
  return request({
    url: '/sys/supportedStubs',
    method: 'get',
    params
  })
}

export function routerStatus(params) {
  return request({
    url: '/sys/routerStatus',
    method: 'get',
    params
  })
}
