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
      console.log(config.body);
      var address = config.body.data.address;
      data.items.push({
        nodeID: "@id",
        address: address,
        seq: 1,
        chainInfos: [{
          name: "bcos",
          stubType: "BCOS2.0",
        }]
      });

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
  }, {
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
  }, {
    url: '/conn/listChains',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          "version": "1",
          "errorCode": 0,
          "message": "success",
          "data": [{
              "zone": "payment",
              "chain": "fabric",
              "type": "Fabric1.4",
              "properties": {
                "ChannelName": "mychannel"
              }
            },
            {
              "zone": "payment",
              "chain": "bcos",
              "type": "BCOS2.0",
              "properties": {
                "BCOS_PROPERTY_CHAIN_ID": "1",
                "WeCrossProxyABI": "xxxxxxxxx",
                "BCOS_PROPERTY_GROUP_ID": "1",
                "WeCrossProxy": "0x8f9a2f54ca70f6a3f50b1ed27bdccad363b126f0",
                "BCOS_PROPERTY_STUB_TYPE": "BCOS2.0",
                "WeCrossHub": "0x894b85761beec3aa08b00b9012c4ccd45c43ed84"
              }
            }, {
              "zone": "payment",
              "chain": "bcos_gm",
              "type": "BCOS2.0_GM",
              "properties": {
                "BCOS_PROPERTY_CHAIN_ID": "1",
                "WeCrossProxyABI": "xxxxxxxxx",
                "BCOS_PROPERTY_GROUP_ID": "1",
                "WeCrossProxy": "0x8f9a2f54ca70f6a3f50b1ed27bdccad363b126f0",
                "BCOS_PROPERTY_STUB_TYPE": "BCOS2.0_GM",
                "WeCrossHub": "0x894b85761beec3aa08b00b9012c4ccd45c43ed84"
              }
            }
          ]
        }
      }
    }
  }
]
