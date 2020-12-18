const xaTransactionKey = 'xaTX'

/**
 * @typedef {Object} xaTransaction
 * @property {string} transactionID
 * @property {Array<string>} paths
 */

/**
 * get XA transaction in sessionStorage
 * @return {xaTransaction|null}
 */
export function getXATX() {
  return JSON.parse(sessionStorage.getItem(xaTransactionKey))
}

export function setXATX(xaTX) {
  return sessionStorage.setItem(xaTransactionKey, xaTX)
}

export function removeXATX() {
  return sessionStorage.removeItem(xaTransactionKey)
}

export function buildXAResponseError(response) {
  if (typeof response.data !== 'undefined' && response.data !== null &&
      typeof response.data.xaResponse.chainErrorMessages !== 'undefined' &&
      response.data.xaResponse.chainErrorMessages !== []) {
    let str = ''
    for (const chainErrorMessage of response.data.xaResponse.chainErrorMessages) {
      str += chainErrorMessage.path + ': ' + chainErrorMessage.message + '\n'
    }
    return str
  } else {
    return response.message
  }
}

export function buildXAError(response) {
  if (typeof response.data !== 'undefined' && response.data !== null &&
      typeof response.data.chainErrorMessages !== 'undefined' &&
      response.data.chainErrorMessages !== []) {
    let str = ''
    for (const chainErrorMessage of response.data.chainErrorMessages) {
      str += chainErrorMessage.path + ': ' + chainErrorMessage.message + '\n'
    }
    return str
  } else {
    return response.message
  }
}
