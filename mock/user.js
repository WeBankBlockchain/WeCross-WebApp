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
        'version': '1',
        'errorCode': 0,
        'message': 'xxx',
        'data': {
        }
      }
    }
  },

  // user register
  {
    url: '/auth/register',
    type: 'post',
    response: _ => {
      return {
        'version': '1',
        'errorCode': 0,
        'message': 'xxx',
        'data': {
          'errorCode': 0,
          'message': 'success',
          'universalAccount': {
            'username': 'xxx',
            'pubKey': 'xxx',
            'uaID': 'xxx'
          }
        }
      }
    }
  },
  // user imageAuthCode
  {
    url: '/auth/imageAuthCode',
    type: 'get',
    response: _ => {
      return {
        version: '1.0',
        errorCode: 0,
        message: 'success',
        data: {
          errorCode: 0,
          message: 'success',
          imageAuthCodeInfo: {
            imageToken: 'ad4b480b9585eaee7368a8260e28a198119bb88073f6f3b1aa03ede49ef1214e',
            imageBase64: 'iVBORw0KGgoAAAANSUhEUgAAAJsAAAA8CAIAAAD+Gl+NAAADQUlEQVR42u3cMW7kMAwFUB1im9S5xQLpUi9yhhxiq82Vttw+N0q53WSAAQzDGtGfFClSGgpqknFsj58lk7Sd8vX/kn2lXi6N9u/zL/FjNqN2Pc6yvq2hIJyJOkyxf20M0XQNPkxvPUVXa0Ugl6gpmi2AaIZIa4pmGrOgqEWEnc1fNFuKZkvRbCmaLUVTdJ4mvllRt/ffP/c9Rc/b25/XQwf/8OXXE9gF+dgB8m5P0dCoxLic1zVF2ZzBUT2vo1zUbZIMghrTdRrR7WqHc+KiMs4UlYvuQ9Mxorj6o4se2EDUQ7LRGQSJUVuurA19PP+49YlFa7YNDxGtc0dHUdaStWKrLyJKSNOiNerhN1qoBBjrruKpqKJricaJiFrko0h8JBMFObVQI4oqopqWGkBUlmi/q5so8ik+6yoWBdUTGBpsMlFk/LmI0oV7Lip9A+AUTHfi9Rmj3NwUR6W995Z2xd56E2OiXDdR2WKnl1LEW/bYm3gG3lwXj3W1RAU1ffWcFcxzrn1YuOuTj4oX47pa1CJ66oIWES/0JlNYURy1dZdGsXjUCoy1khlQ0aeuq4tKXFbrBexQb5sQV3rFrnRk5yYqiHjrL9bSou/VyKbT1iklTlL36wFFkSg9kCiozgpoZdUG4gIJPpoEjsj6/COW6Xoj2MUVrAhqJaa6ySg4RokhSAxWVg7tL8qt8Q6oCI4UPe3c8N7hjre6qEXhXlbj1c1e6MgoxKwrdtVF5T6iPaB2j4iCj48HerqTeLahp6SgVV5QfJYMryIJXtt1fktCxnZ6vOxKRZ3Pj9U2BGTcKuD4FvBFdALp7kBMUSpkCMtJQ8r2vKxk2Rqpjq6tHaN3uAe1LGnZOuUHu7YsWVeK6PnoSM7WQRlGy9ouvUv4Ny1BVASHmPUn9SasUfHN4V8fuR4Xd06xUP+YtkMFOcWnMhEilCCcrEPcKbE/oy1QTy/eKkF4aw0lDieopWhgkd7Qc4DW5qYZo50fRaAlkkvFs4cY9yUg58Xjf8Fuk3BndUJrPeJDN5moaYBKh5GK/13H7rh1ifbstCCJvAyp1vZHKwMmkhQdLeo4QOWi1pyd2aoX6oOKLow68aw7XtS9yD7LGP0G/T53V67Tc1kAAAAASUVORK5CYII='
          }
        }
      }
    }
  }
]
