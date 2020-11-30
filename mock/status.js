const Mock = require('mockjs')
module.exports = [{
  url: '/sys/systemStatus',
  type: 'get',
  response: param => {
    return {
      'version': '1',
      'errorCode': 0,
      'message': 'Success',
      'data': {
        'osName': 'Linux',
        'osArch': 'amd64',
        'osVersion': '4.4.0-17763-Microsoft',
        'javaVMVersion': '11.0.9.1+1-Ubuntu-0ubuntu1.20.04',
        'javaVMVendor': 'Ubuntu',
        'javaVMName': 'OpenJDK 64-Bit Server VM',
        'providerName': 'SUN',
        'providerVersion': '11',
        'providerInfo': 'SUN (DSA key/parameter generation; DSA signing; SHA-1, MD5 digests; SecureRandom; X.509 certificates; PKCS12, JKS & DKS keystores; PKIX CertPathValidator; PKIX CertPathBuilder; LDAP, Collection CertStores, JavaPolicy Policy; JavaLoginConfig Configuration)',
        'namedGroups': 'secp256k1',
        'disabledNamedGroups': null
      }
    }
  }
},
{
  url: '/sys/routerStatus',
  type: 'get',
  response: param => {
    return {
      'version': '1',
      'errorCode': 0,
      'message': 'Success',
      'data': {
        'version': '1.0.0',
        'supportedStubs': 'BCOS2.0,GM_BCOS2.0',
        'rpcNetInfo': '127.0.0.1:8250',
        'p2pNetInfo': '0.0.0.0:25500',
        'adminAccount': 'monan'
      }
    }
  }
}
]
