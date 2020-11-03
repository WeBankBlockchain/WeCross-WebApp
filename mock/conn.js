const Mock = require('mockjs')

const peerData = Mock.mock({
  'items|10': [{
    nodeID: '@id',
    address: '@integer(1,255).@integer(1,255).@integer(1,255).@integer(1,255):@integer(1, 65535)',
    seq: 1,
    'chainInfos|2': [{
      name: '@id',
      stubType: '@pick([\'Fabirc1.4\', \'BCOS2.0\', \'GM_BCOS2.0\'])'
    }]
  }]
})

module.exports = [{
  url: '/conn/listPeers',
  type: 'get',
  response: _ => {
    return {
      version: '1',
      errorCode: 0,
      message: 'success',
      data: peerData.items
    }
  }
},
{
  url: '/conn/addPeer',
  type: 'post',
  response: config => {
    console.log(config.body)
    var address = config.body.data.address
    peerData.items.push({
      nodeID: '@id',
      address: address,
      seq: 1,
      chainInfos: [{
        name: 'bcos',
        stubType: 'BCOS2.0'
      }]
    })

    return {
      'version': '1',
      'errorCode': 0,
      'message': 'success',
      'peerData': {
        'errorCode': 0,
        'message': 'success'
      }
    }
  }
}, {
  url: '/conn/removePeer',
  type: 'post',
  response: config => {
    console.log(config.body)
    for (var i in peerData.items) {
      console.log(i + ' ' + peerData.items[i].address + ' ' + config.body.data.address)
      if (peerData.items[i].address === config.body.data.address) {
        console.log('success deleted: ' + i)
        peerData.items.splice(i, 1)
        break
      }
    }
    return {
      'version': '1',
      'errorCode': 0,
      'message': 'success',
      'peerData': {
        'errorCode': 0,
        'message': 'success'
      }
    }
  }
}, {
  url: '/sys/listChains',
  type: 'get',
  response: _ => {
    return {
      'version': '1',
      'errorCode': 0,
      'message': 'success',
      'data': {
        total: 10,
        'chains|10': [{
          path: '@pick([\'payment\',\'resource\']).@pick([\'bcos\',\'fabric\'])',
          stubType: '@pick([\'BCOS2.0\',\'Fabric1.4\'])',
          'properties': {
            'BCOS_PROPERTY_CHAIN_ID': '1',
            'WeCrossProxyABI': 'xxxxxxxxx',
            'BCOS_PROPERTY_GROUP_ID': '1',
            'WeCrossProxy': '0x8f9a2f54ca70f6a3f50b1ed27bdccad363b126f0',
            'BCOS_PROPERTY_STUB_TYPE': 'BCOS2.0',
            'WeCrossHub': '0x894b85761beec3aa08b00b9012c4ccd45c43ed84'
          }
        }
        ]
      }
    }
  }
}
]
