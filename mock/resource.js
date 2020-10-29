const Mock = require('mockjs')

const data = Mock.mock({
  'items|100': [{
    id: '@id',
    path: '@pick([\'payment\',\'load\',\'resource\']).@pick([\'bcos\',\'bcos_gm\',\'fabric\']).@word(3,5)',
    checksum: 'checksum',
    'stubtype|1': ['BCOS2.0', 'GM_BCOS2.0', 'Fabric1.4'],
    properties: '@sentence(3,3)',
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
