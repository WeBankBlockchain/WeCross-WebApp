const Mock = require('mockjs')
module.exports = [{
  url: '/conn/listPeers',
  type: 'get',
  response: _ => {
    return {
      ...Mock.mock({
        version: '1',
        errorCode: 0,
        message: 'success',
        data: {
          size: 1000,
          'data|10': [{
            nodeID: '@id',
            address: '@integer(1,255).@integer(1,255).@integer(1,255).@integer(1,255):@integer(1, 65535)',
            seq: 1,
            chainInfos: [{
              name: '@id',
              stubType: '@pick([\'Fabirc1.4\', \'BCOS2.0\', \'GM_BCOS2.0\'])'
            }]
          }]
        }
      }) }
  }
},
{
  url: '/conn/addPeer',
  type: 'post',
  response: config => {
    /*
    peerData.items.push({
      nodeID: '@id',
      address: config.body.data.address,
      seq: 1,
      chainInfos: [{
        name: 'bcos',
        stubType: 'BCOS2.0'
      }]
    })
    */

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
  response: _ => {
    // for (var i in peerData.items) {
    //   if (peerData.items[i].address === config.body.data.address) {
    //     peerData.items.splice(i, 1)
    //     break
    //   }
    // }
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
  url: '/conn/listChains',
  type: 'get',
  response: param => {
    return {
      'version': '1',
      'errorCode': 0,
      'message': 'success',
      data: {
        size: 1000,
        'data|10': [{
          zone: param.query.zone,
          'chain|1': ['bcos@integer(1,100)', 'bcos_gm@integer(1,100)', 'fabric@integer(1,100)'],
          'type|1': ['BCOS2.0', 'GM_BCOS2.0', 'Fabric1.4'],
          blockNumber: '@integer(1,1000000)',
          isLocal: '@pick(true,false)',
          'properties': {
            'BCOS_PROPERTY_CHAIN_ID': '1',
            'WeCrossProxyABI': 'xxxxxxxxx',
            'BCOS_PROPERTY_GROUP_ID': '1',
            'WeCrossProxy': '0x8f9a2f54ca70f6a3f50b1ed27bdccad363b126f0',
            'BCOS_PROPERTY_STUB_TYPE': 'BCOS2.0',
            'WeCrossHub': '0x894b85761beec3aa08b00b9012c4ccd45c43ed84'
          }
        }]
      }
    }
  }
}, {
  url: '/conn/listZones',
  type: 'get',
  response: _ => {
    return {
      'version': '1',
      'errorCode': 0,
      'message': 'success',
      data: {
        size: 10,
        'data|10': ["@pick([\'payment\',\'load\',\'resource\'])"]
      }
    }
  }
}
]
