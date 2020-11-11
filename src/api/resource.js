import request from '@/utils/request'
import { path2Url } from '@/utils'

export function getResourceList(params, data) {
  return request({
    url: '/sys/listResources',
    method: 'post',
    params: params,
    data: data
  })
}

export function bcosDeploy(data) {
  return request({
    url: 'resource' + path2Url(data.path) + '/customCommand/deploy',
    method: 'post',
    data: data
  })
}

export function bcosRegister(data) {
  return request({
    url: 'resource' + path2Url(data.path) + '/customCommand/register',
    method: 'post',
    data: data
  })
}

export function fabricInstall(data) {
  return request({
    url: 'resource' + path2Url(data.path) + '/customCommand/install',
    method: 'post',
    data: data
  })
}

export function fabricInstantiate(data) {
  return request({
    url: 'resource' + path2Url(data.path) + '/customCommand/instantiate',
    method: 'post',
    data: data
  })
}

export function fabricUpgrade(data) {
  return request({
    url: 'resource' + path2Url(data.path) + '/customCommand/upgrade',
    method: 'post',
    data: data
  })
}
