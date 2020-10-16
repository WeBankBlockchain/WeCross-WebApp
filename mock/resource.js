const Mock = require('mockjs')

const data = Mock.mock({
  'items|10': [{
    id: '@id',
    path: '@word(5).@pick([\'bcos\',\'fabric\']).@word(3,5)',
    checksum: 'checksum',
    'stubtype|1': ['BCOS2.0', 'GM_BCOS2.0', 'Fabric1.4'],
    properties: '@sentence(3,5)',
    distance: '@integer(0, 3)'
  }]
})

module.exports = [
  {
    url: '/resource/listResources',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
