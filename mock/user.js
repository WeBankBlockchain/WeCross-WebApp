module.exports = [
  // user login
  {
    url: '/auth/login',
    type: 'post',
    response: config => {
      const token = 'admin-token'

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        version: '1',
        errorCode: 0,
        message: 'xxx',
        data: {
          errorCode: 0,
          message: 'success',
          credential: 'Bearer XXXXX',
          universalAccount: {
            username: 'xxx',
            pubKey: 'xxx',
            uaID: 'xxx'
          }
        }
      }
    }
  },
  // user logout
  {
    url: '/auth/logout',
    type: 'post',
    response: _ => {
      return {
        code: 200
      }
    }
  },

  // user register
  {
    url: '/auth/register',
    type: 'post',
    response: _ => {
      return {
        "version": "1",
        "errorCode": 0,
        "message": "xxx",
        "data": {
          "errorCode": 0,
          "message": "success",
          "universalAccount": {
            "username": "xxx",
            "pubKey": "xxx",
            "uaID": "xxx"
          }
        }
      }
  }
}
]
