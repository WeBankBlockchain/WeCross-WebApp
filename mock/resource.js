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
            path: '@pick([\'payment\',\'load\',\'resource\']).@pick([\'bcos\',\'bcos_gm\',\'fabric\']).@word(3,5)',
            checksum: 'checksum',
            'stubType|1': ['BCOS2.0', 'GM_BCOS2.0', 'Fabric1.4'],
            properties: '@sentence(3,3)',
            distance: '@integer(0, 3)'
          }]
        }
      })
    }
  }
},
{
  url: '/customCommand/deploy',
  type: 'post',
  response: config => {
    return {
      ...Mock.mock({
        'version': 1,
        'errorCode': 0,
        'message': 'Success',
        'data': 'result'
      })
    }
  }
},
{
  url: '/customCommand/register',
  type: 'post',
  response: config => {
    return {
      ...Mock.mock({
        'version': 1,
        'errorCode': 0,
        'message': 'Success',
        'data': 'result'
      })
    }
  }
},
{
  url: '/customCommand/install',
  type: 'post',
  response: config => {
    return {
      ...Mock.mock({
        'version': 1,
        'errorCode': 0,
        'message': 'Success',
        'data': 'result'
      })
    }
  }
}, {
  url: '/customCommand/instantiate',
  type: 'post',
  response: config => {
    return {
      ...Mock.mock({
        'version': 1,
        'errorCode': 0,
        'message': 'Success',
        'data': 'result'
      })
    }
  }
}, {
  url: '/customCommand/upgrade',
  type: 'post',
  response: config => {
    return {
      ...Mock.mock({
        'version': 1,
        'errorCode': 0,
        'message': 'Success',
        'data': 'result'
      })
    }
  }
}
]
