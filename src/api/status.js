import request from '@/utils/request'

export function listStubs(params) {
  return request({
    url: '/conn/listStubs',
    method: 'get',
    params
  })
}
