import request from '@/utils/request'

export function getChainsList(params) {
  return request({
    url: '/conn/listChains',
    method: 'get',
    params
  })
}
