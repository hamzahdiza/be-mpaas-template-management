import { describe, expect, it } from "vitest";
import { encryptAPIData, decryptAPIData, encryptMPIN, encryptSessionKey, createKey } from "../e2ee";

describe('e2ee functions', () => {

  const handleError = vi.fn()

  it('execute encryptAPIData', () => {
    encryptAPIData(createKey(), JSON.stringify({}))
  })

  it('execute decryptAPIData', () => {
    expect(decryptAPIData('64E5144EEC32266790649A8D8DDA3C18', '98EE570CA22BCEF462A4AC0A455C76BCBCF60EB92FC68554D4176FB75AB1FC9E95D6435CBBD0E1AC6256')).toBe("{}")
  })

  it('execute encryptMPIN', () => {
    const beEncryptPublicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApT1V46InQw+6YcsDbj9q/H8m1WEl78Vw/jAWK8ko8zNlYkmAqExnpDwkJvmNTk8R9qgzJKVQmXZavR4fQ0RuLk1n3Lp2leBFr33yc3R2bFgMkhdJmWo1V5y9jDoal19UCLVgXMmPro4BNgDaF4mQs/7jcvnju1MODWtPI9dlKwsuDswT65qQOxRIZCTerUvs8YsAlwep4sLufA/dTopKFOHsJctyTyMuIG1Cz1sD8pZK3jcTWhk6azWaSX6swTZCLXG3pPusheCwyL6b6Ral+EZft1pFrzcInMd2jDN709nGTrILP48XN/SS/pOr4HhDrFBFNWUwkfbx5zQ7636LUQIDAQAB'
    const userId = 'f7b8w6jwFw_BOunLT0VDu'
    const mp = '123456'
    try {
      encryptMPIN(beEncryptPublicKey, userId, mp)  
    } catch (error) {
      handleError(error)
    }
  })

  it('execute encryptSessionKey', () => {
    const pubKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApT1V46InQw+6YcsDbj9q/H8m1WEl78Vw/jAWK8ko8zNlYkmAqExnpDwkJvmNTk8R9qgzJKVQmXZavR4fQ0RuLk1n3Lp2leBFr33yc3R2bFgMkhdJmWo1V5y9jDoal19UCLVgXMmPro4BNgDaF4mQs/7jcvnju1MODWtPI9dlKwsuDswT65qQOxRIZCTerUvs8YsAlwep4sLufA/dTopKFOHsJctyTyMuIG1Cz1sD8pZK3jcTWhk6azWaSX6swTZCLXG3pPusheCwyL6b6Ral+EZft1pFrzcInMd2jDN709nGTrILP48XN/SS/pOr4HhDrFBFNWUwkfbx5zQ7636LUQIDAQAB'
    try {
      encryptSessionKey(pubKey, createKey())
    } catch (error) {
      handleError(error)
    }
  })

  it('execute createKey', () => {
    createKey()
  })
})