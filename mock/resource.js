const Mock = require('mockjs')

module.exports = [
  {
    url: '/resource/listResources',
    type: 'get',
    response: config => {
      return {
        ...Mock.mock({
          version: 0,
          errorCode: 0,
          message: 'success',
          data: {
            total: 100,
            'resourceDetails|100': [{
              id: '@id',
              path: '@pick([\'payment\',\'load\',\'resource\']).@pick([\'bcos\',\'bcos_gm\',\'fabric\']).@word(3,5)',
              checksum: 'checksum',
              'stubtype|1': ['BCOS2.0', 'GM_BCOS2.0', 'Fabric1.4'],
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
          version: 0,
          errorCode: 0,
          message: 'success',
          data: {
            total: 100,
            'resourceDetails|100': [{
              id: '@id',
              path: '@pick([\'payment\',\'load\',\'resource\']).@pick([\'bcos\',\'bcos_gm\',\'fabric\']).@word(3,5)',
              checksum: 'checksum',
              'stubtype|1': ['BCOS2.0', 'GM_BCOS2.0', 'Fabric1.4'],
              properties: '@sentence(3,3)',
              distance: '@integer(0, 3)'
            }]
          }
        })
      }
    }
  }
]
