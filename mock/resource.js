const Mock = require('mockjs')

module.exports = [{
  url: '/sys/listResources',
  type: 'post',
  response: config => {
    return {
      ...Mock.mock({
        version: 0,
        errorCode: 0,
        message: 'success',
        data: {
          total: 1000,
          'resourceDetails|10': [{
            id: '@id',
            path: config.query.path ? config.query.path + '.@word(3,5)' : '@pick([\'payment\',\'load\',\'resource\']).@pick([\'bcos\',\'bcos_gm\',\'fabric\']).@word(3,5)',
            checksum: 'checksum',
            'stubType|1': ['BCOS2.0', 'GM_BCOS2.0', 'Fabric1.4', 'BCOS3_ECDSA_EVM', 'BCOS3_GM_EVM'],
            properties: '@sentence(3,3)',
            distance: '@integer(0, 3)'
          }]
        }
      })
    }
  }
},
{
  url: '/customCommand',
  type: 'post',
  response: config => {
    return {
      ...Mock.mock({
        'version': 1,
        'errorCode': 0,
        'message': 'Success: ' + config.body.command,
        'data': 'result'
      })
    }
  }
},
{
  url: '/detail',
  type: 'post',
  response: config => {
    return {
      ...Mock.mock({
        'version': 1,
        'errorCode': 0,
        'message': 'Success: ' + config.body.command,
        'data': {
          'stubType': 'BCOS2.0'
        }
      })
    }
  }
}
]
