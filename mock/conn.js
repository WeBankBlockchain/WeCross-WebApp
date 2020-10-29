const Mock = require('mockjs')

const response = Mock.mock({
  'data|100': [{
    id: '@id',
    zone: '@pick([\'payment\',\'load\', \'resource\'])',
    chain: '@pick([\'bcos\',\'fabric\',\'bcos_gm\'])',
    'type|1': ['BCOS2.0', 'GM_BCOS2.0', 'Fabric1.4'],
    properties: '@sentence(3,3)'
  }]
})

module.exports = [
  {
    url: '/conn/listChains',
    type: 'get',
    response: config => {
      const data = response.data
      return {
        code: 20000,
        data: {
          total: data.length,
          items: data
        }
      }
    }
  }
]
