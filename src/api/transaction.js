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
    url: path2Url(data.path) + '/call',
    method: 'post',
    data: data
  })
}

export function sendTransaction(data) {
  return request({
    url: 'resource/' + path2Url(data.path) + '/sendTransaction',
    method: 'post',
    data: data
  })
}

/*
  request:
  https://[server:port]/trans/listTransactions?path=payment.bcos&blockNumber=1&offset=0&size=10

  response:
  {
    "version":1,
    "errorCode":0,
    "message":"Success",
    "data":{
        "nextBlockNumber":10,
        "nextOffset":20,
        "transactions":[
            {
                "txHash":"0x11",
                "blockNumber":1
            },
            {
                "txHash":"0x22",
                "blockNumber":2
            }
        ]
    }
  }
  */

export function listTransactions(params) {
  return request({
    url: '/trans/listTransactions',
    method: 'get',
    params: params
  })
}

/**
request:
https://[server:port]/trans/getTransaction?path=payment.bcos&txHash=0x11

response:
{
    "version":1,
    "errorCode":0,
    "message":"success",
    "data":{
        "path":"payment.bcos.hello",
        "username":"hehe",
        "blockNumber":1,
        "txHash":"0x11",
        "xaTransactionID":"001",
        "xaTransactionSeq":1,
        "method":"set",
        "args":[
            "0x11",
            "0x22",
            "0x33"
        ],
        "result":[
            "0x11",
            "0x22",
            "0x33"
        ],
        "byProxy":true,
        "txBytes":[0,1,0],
        "receiptBytes":[0,1,0]
    }
}
*/

export function getTransaction(params) {
  return request({
    url: '/trans/getTransaction',
    method: 'get',
    params: params
  })
}
