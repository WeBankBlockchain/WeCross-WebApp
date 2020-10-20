import request from '@/utils/request'

export function getResourceList(params) {
  return request({
    url: '/resource/listResources',
    method: 'get',
    params
  })
}

export function bcosDeploy(params) {
  return request({
    url: '/resource/customCommand/deploy',
    method: 'post',
    params
  })
}

export function bcosRegister(params) {
  return request({
    url: '/resource/customCommand/register',
    method: 'post',
    params
  })
}

export function fabricInstall(params) {
  return request({
    url: '/resource/customCommand/install',
    method: 'post',
    params
  })
}

export function fabricInstantiate(params) {
  return request({
    url: '/resource/customCommand/instantiate',
    method: 'post',
    params
  })
}

export function fabricUpgrade(params) {
  return request({
    url: '/resource/customCommand/upgrade',
    method: 'post',
    params
  })
}
