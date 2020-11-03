import request from '@/utils/request'

export function getResourceList(params, data) {
  return request({
    url: '/sys/listResources',
    method: 'post',
    params: params,
    data: data
  })
}

export function bcosDeploy(params) {
  return request({
    url: params.path + '/customCommand/deploy',
    method: 'post',
    data: params
  })
}

export function bcosRegister(params) {
  return request({
    url: '/resource/customCommand/register',
    method: 'post',
    data: params
  })
}

export function fabricInstall(params) {
  return request({
    url: '/resource/customCommand/install',
    method: 'post',
    data: params
  })
}

export function fabricInstantiate(params) {
  return request({
    url: '/resource/customCommand/instantiate',
    method: 'post',
    data: params
  })
}

export function fabricUpgrade(params) {
  return request({
    url: '/resource/customCommand/upgrade',
    method: 'post',
    data: params
  })
}
