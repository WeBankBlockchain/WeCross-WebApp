const Mock = require('mockjs')

const data = Mock.mock({
  'items|100': [{
    nodeID: "@id",
    address: "127.0.0.1:25501",
    seq: 1,
    chainInfos: [{
      name: "fabric",
      stubType: "Fabirc1.4"
    }]
  }]
})

module.exports = [{
  url: '/conn/listPeers',
  type: 'get',
  response: config => {
    const items = data.items
    return {
      version: "1",
      errorCode: 0,
      message: "success",
      data: items
    }
  }
}]
