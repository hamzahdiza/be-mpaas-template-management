  var tools = require('./e2ee/e2ee.wsx')
  /**
   *  Encrypt API request and response body
   * @param {*} sessionKey
   * @param {*} data 
   */
  export function encryptAPIData(sessionKey, data) {
    return tools.encryptData(sessionKey, data)
  }

  /**
   * Decrypt API request and response body
   * @param {*} sessionKey
   * @param {*} data
   */
  export function decryptAPIData(sessionKey, data) {
    return tools.decryptData(sessionKey, data)
  }

  /**
   * Encrypt MP
   * @param {*} beE2EEPublicKey
   * @param {*} userId
   * @param {*} mp
   */
  export function encryptMPIN(beE2EEPublicKey, userId, mp) {
    return tools.encryptPassword(beE2EEPublicKey, userId, mp)
  }

  /**
   * Encrypt sessionKey
   * @param {*} beEncryptPublicKey 
   * @param {*} data 
   */
  export function encryptSessionKey(beEncryptPublicKey, data) {
    return tools.encryptKey(beEncryptPublicKey, data)
  }

  /**
   * Create sessionKey
   */
  export function createKey() {
    return tools.createKey()
  }