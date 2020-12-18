/**
 * @typedef {Object} ChainErrorMessage
 * @property {string} chain
 * @property {string} message
 *
 */
/**
 * @typedef {Object} ResourceDetail
 * @property {string} path - the path of resource
 * @property {number} distance - the distance of this resource
 * @property {Object} properties
 * @property {string} checksum
 */
/**
 * @typedef {Object} CallRequest
 * @property {string} version - the version of request
 * @property {string|*} path
 * @property {Object} data - the main body data of request
 * @property {string|*} data.method - call method
 * @property {Array<string>|*} args - call args
 * @property {Object|*} options - sendTransaction options
 */
/**
 * @typedef {Object} CustomRequest
 * @property {string} version - the version of request
 * @property {string} path
 * @property {Object} data - the main body data of request
 * @property {string} data.command - the command of request
 * @property {Array<string>|null} data.args - the args of command
 */
/**
 * @typedef {Object} xaRequest
 * @property {string} version - the version of request
 * @property {Object} data - the main body data of request
 * @property {string|null} data.xaTransactionID - the xa transaction ID
 * @property {Array<string>|null} data.paths - the paths of xa transaction
 */
/**
 * @typedef {Object} Response
 * @property {string} version - the version of response
 * @property {number} errorCode - the system layer error code, 0 means success
 * @property {string} message
 * @property {Object|string} data - the main body data of response
 */
/**
 * @typedef {Object} resourceResponse
 * @property {string} version - the version of response
 * @property {number} errorCode - the system layer error code, 0 means success
 * @property {string} message
 * @property {Object|string} data - the main body data of response
 * @property {number} data.total - the total number of 'listResources'
 * @property {Array<ResourceDetail>} data.resourceDetails - list of resources in 'listResources'
 */
/**
 * @typedef {Object} xaResponse
 * @property {string} version - the version of response
 * @property {number} errorCode - the system layer error code, 0 means success
 * @property {string} message
 * @property {Object} data - the main body data of response
 * @property {number} data.status - the status of this XA transaction
 * @property {Array<ChainErrorMessage>|null} chainErrorMessages
 */
/**
 * @typedef {Object} xaListResponse
 * @property {string} version - the version of response
 * @property {number} errorCode - the system layer error code, 0 means success
 * @property {string} message
 * @property {Object} data - the main body data of response
 * @property {Object} data.xaResponse
 * @property {number} data.xaResponse.status
 * @property {Array<ChainErrorMessage>|null} chainErrorMessages
 * @property {Object} xaTransaction
 */
