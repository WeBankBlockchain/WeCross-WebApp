const Mock = require('mockjs')

module.exports = [
  {
    url: '/auth/listAccount',
    type: 'post',
    response: config => {
      return {
        ...Mock.mock({
          version: 0,
          errorCode: 0,
          message: 'success',
          data: {
            'username': 'org1-admin',
            'uaID': '3059301306072a8648ce3d020106082a811ccf5501822d034200047cfc7f4488a171e4a80051cdf93e2febc3066181b17bccd81264b79e346affc1f684738aa565485a459bbc00f03bd1df3df7dac985e6a740a3ed5533d5a60874',
            'pubKey': '3059301306072a8648ce3d020106082a811ccf5501822d034200047cfc7f4488a171e4a80051cdf93e2febc3066181b17bccd81264b79e346affc1f684738aa565485a459bbc00f03bd1df3df7dac985e6a740a3ed5533d5a60874',
            'admin': true,
            'chainAccounts': [
              {
                'keyID': 0,
                'identity': '0x6c51a6cef228f784636c690d8b13f956e177cc76',
                'type': 'BCOS2.0',
                'pubKey': '-----BEGIN PUBLIC KEY-----\nmock 1111\n-----END PUBLIC KEY-----\n',
                'secKey': '-----BEGIN PRIVATE KEY-----\nmock xxxx\n-----END PRIVATE KEY-----\n',
                'ext': '0x6c51a6cef228f784636c690d8b13f956e177cc76',
                'isDefault': true
              },
              {
                'keyID': 3,
                'identity': '-----BEGIN CERTIFICATE-----\nmock 2222\n-----END CERTIFICATE-----\n',
                'type': 'Fabric1.4',
                'pubKey': '-----BEGIN CERTIFICATE-----\nmock 2222\n-----END CERTIFICATE-----\n',
                'secKey': '-----BEGIN PRIVATE KEY-----\nmock xxxx\n-----END PRIVATE KEY-----\n',
                'ext': 'Org1MSP',
                'isDefault': false
              },
              {
                'keyID': 2,
                'identity': '-----BEGIN CERTIFICATE-----\nmock 3333\n-----END CERTIFICATE-----\n',
                'type': 'Fabric1.4',
                'pubKey': '-----BEGIN CERTIFICATE-----\nmock 3333\n-----END CERTIFICATE-----\n',
                'secKey': '-----BEGIN PRIVATE KEY-----\nmock xxxx\n-----END PRIVATE KEY-----\n',
                'ext': 'Org2MSP',
                'isDefault': false
              },
              {
                'keyID': 1,
                'identity': '-----BEGIN CERTIFICATE-----\nmock 4444\n-----END CERTIFICATE-----\n',
                'type': 'Fabric1.4',
                'pubKey': '-----BEGIN CERTIFICATE-----\nmock 4444\n-----END CERTIFICATE-----\n',
                'secKey': '-----BEGIN PRIVATE KEY-----\nmock xxxx\n-----END PRIVATE KEY-----\n',
                'ext': 'Org1MSP',
                'isDefault': true
              }
            ]
          }
        })
      }
    }
  },
  {
    url: '/auth/setDefaultAccount',
    type: 'post',
    response: config => {
      return {
        ...Mock.mock({
          version: 0,
          errorCode: 0,
          message: 'success',
          data: {
            errorCode: 0,
            message: 'success'
          }
        })
      }
    }
  },
  {
    url: '/auth/addChainAccount',
    type: 'post',
    response: config => {
      return {
        ...Mock.mock({
          version: 0,
          errorCode: 0,
          message: 'success',
          data: {
            errorCode: 0,
            message: 'success'
          }
        })
      }
    }
  }
]
