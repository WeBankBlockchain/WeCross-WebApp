import request from '@/utils/request'
import { path2Url } from '@/utils'

export function startXATransaction(data) {
  return request({
    url: '/xa/startXATransaction',
    method: 'post',
    data: data
  })
}
export function commitXATransaction(data) {
  return request({
    url: '/xa/commitXATransaction',
    method: 'post',
    data: data
  })
}

export function rollbackXATransaction(data) {
  return request({
    url: '/xa/rollbackXATransaction',
    method: 'post',
    data: data
  })
}

export function getXATransaction(data) {
  return request({
    url: '/xa/getXATransaction',
    method: 'post',
    data: data
  })
}

export function listXATransactions(data) {
  return request({
    url: '/xa/listXATransactions',
    method: 'post',
    data: data
  })
}

export function call(data) {
  return request({
    url: 'resource' + path2Url(data.path) + '/call',
    method: 'post',
    data: data
  })
}

export function sendTransaction(data) {
  return request({
    url: 'resource' + path2Url(data.path) + '/sendTransaction',
    method: 'post',
    data: data
  })
}

export function listTransactions(params) {
  return request({
    url: '/trans/listTransactions',
    method: 'get',
    params: params
  })
}

export function getTransaction(params) {
  return request({
    url: '/trans/getTransaction',
    method: 'get',
    params: params
  })
}
