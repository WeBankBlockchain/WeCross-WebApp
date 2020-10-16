import request from '@/utils/request'

export function getResourceList(params) {
  return request({
    url: '/resource/listResources',
    method: 'get',
    params
  })
}
