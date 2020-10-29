const Mock = require('mockjs')

const data = Mock.mock({
  'items|10': [{
    nodeID: "@id",
    address: '@integer(1,255)' + '.' + '@integer(1,255)' + '.' + '@integer(1,255)' + '.' + '@integer(1,255)' +
      ':' + '@integer(1, 65535)',
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
      return {
        code: 20000,
        data: {
          version: "1",
          errorCode: 0,
          message: "success",
          data: data.items,
        }
      }
    }
  },
  {
    url: '/conn/addPeer',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: {
          "version": "1",
          "errorCode": 0,
          "message": "success",
          "data": {
            "errorCode": 0,
            "message": "success"
          }
        }
      }
    }
  },
  {
    url: '/conn/removePeer',
    type: 'post',
    response: config => {
      console.log(config.body);
      for (var i in data.items) {
        console.log(i + " " + data.items[i].address + " " + config.body.data.address);
        if (data.items[i].address === config.body.data.address) {
          console.log("success deleted: " + i);
          data.items.splice(i, 1);
          break;
        }
      }
      return {
        code: 20000,
        data: {
          "version": "1",
          "errorCode": 0,
          "message": "success",
          "data": {
            "errorCode": 0,
            "message": "success"
          }
        }
      }
    }
  }
]
