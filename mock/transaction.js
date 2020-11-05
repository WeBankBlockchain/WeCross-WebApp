const Mock = require('mockjs')

module.exports = [
  {
    url: '/xa/startXATransaction',
    type: 'post',
    response: _ => {
      return {
        ...Mock.mock({
          version: 1,
          errorCode: 0,
          message: 'success',
          data: {
            status: -1,
            'chainErrorMessages|2': [{
              chain: '@pick([\'payment\',\'load\',\'resource\']).@pick([\'bcos\',\'bcos_gm\',\'fabric\'])',
              message: 'error'
            }]
          }
        })
      }
    }
  },
  {
    url: '/xa/commitXATransaction',
    type: 'post',
    response: _ => {
      return {
        ...Mock.mock({
          version: 1,
          errorCode: 0,
          message: 'success',
          data: {
            status: -1,
            'chainErrorMessages|2': [{
              chain: '@pick([\'payment\',\'load\',\'resource\']).@pick([\'bcos\',\'bcos_gm\',\'fabric\'])',
              message: 'error'
            }]
          }
        })
      }
    }
  },
  {
    url: '/xa/rollbackXATransaction',
    type: 'post',
    response: _ => {
      return {
        ...Mock.mock({
          version: 1,
          errorCode: 1,
          message: 'success',
          data: {
            status: -1,
            'chainErrorMessages|2': [{
              chain: '@pick([\'payment\',\'load\',\'resource\']).@pick([\'bcos\',\'bcos_gm\',\'fabric\'])',
              message: 'error'
            }]
          }
        })
      }
    }
  },
  {
    url: '/xa/getXATransaction',
    type: 'post',
    response: config => {
      return {
        ...Mock.mock({
          version: 1,
          errorCode: 0,
          message: 'success',
          data: {
            xaResponse: {
              status: -1,
              'chainErrorMessages|2': [{
                chain: '@pick([\'payment\',\'load\',\'resource\']).@pick([\'bcos\',\'bcos_gm\',\'fabric\'])',
                message: 'error'
              }]
            },
            xaTransaction: {
              username: '@word(3,5)',
              xaTransactionID: config.body.data.xaTransactionID,
              status: 'committed',
              startTimestamp: '2384923894',
              commitTimestamp: '2384923894',
              rollbackTimestamp: '0',
              paths: config.body.data.paths,
              xaTransactionSteps: [
                {
                  'username': '@word(3,5)',
                  'xaTransactionSeq': 1,
                  'path': 'a.b.1',
                  'hash': '0x12',
                  'method': 'set',
                  'args': 'hello',
                  'timestamp': '121289384'
                }, {
                  'username': '@word(3,5)',
                  'xaTransactionSeq': 2,
                  'path': 'a.b.2',
                  'hash': '0x123',
                  'method': 'set',
                  'args': 'hello world',
                  'timestamp': '1212893845'
                }

              ]
            }
          }
        })
      }
    }
  },
  {
    url: '/xa/listXATransactions',
    type: 'post',
    response: _ => {
      return {
        ...Mock.mock({
          version: 1,
          errorCode: 0,
          message: 'success',
          data: {
            'finished': false,
            'nextOffsets': {
              'payment.bcos': 1,
              'payment.fabric': 2
            },
            'xaList': [
              {
                'xaTransactionID': '001',
                'username': 'hehe',
                'status': 'processing',
                'timestamp': 8989889
              },
              {
                'xaTransactionID': '002',
                'username': 'hehe',
                'status': 'committed',
                'timestamp': 8989889
              }
            ]

          }
        })
      }
    }
  }, {
    url: '/test/test/test/sendTransaction',
    type: 'post',
    response: _ => {
      return {
        ...Mock.mock({
          version: 1,
          errorCode: 0,
          message: 'success',
          data: {
            'receipt': {
              'errorCode': 0,
              'errorMessage': 'Success',
              'hash': '0x4342748923789',
              'extraHashes': ['xxx', 'xxx'],
              'blockNumber': 123,
              'restult': ['xxx', 'XXX']
            }
          }
        })
      }
    }
  }, {
    url: '/test/test/test/call',
    type: 'post',
    response: _ => {
      return {
        ...Mock.mock({
          version: 1,
          errorCode: 0,
          message: 'success',
          data: {
            'receipt': {
              'errorCode': 0,
              'errorMessage': 'Success',
              'hash': '0x4342748923789',
              'extraHashes': ['xxx', 'xxx'],
              'blockNumber': 123,
              'restult': ['xxx', 'XXX']
            }
          }
        })
      }
    }
  }, {
    url: '/trans/listTransactions',
    type: 'get',
    response: _ => {
      return {
        ...Mock.mock({
            "version": 1,
            "errorCode": 0,
            "message": "Success",
            "data": {
              "nextBlockNumber": 10,
              "nextOffset": 20,
              "transactions": [
                {
                  "txHash": "0x11",
                  "blockNumber": 1
                },
                {
                  "txHash": "0x22",
                  "blockNumber": 2
                }
              ]
            }
        })
      }
    }
  }
]
