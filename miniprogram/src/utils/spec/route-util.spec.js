import { describe, it } from 'vitest'
import { customNavigateTo } from '../route-util'

describe('route util', () => {
  it('customNavigateTo', () => {
    customNavigateTo({
      url: "/package_transaction/pages/redeem/redeem",
      data: {
        data: {param: {}},
      },
    })

    customNavigateTo({
      url: "/package_transaction/pages/redeem/redeem",
      data: {
        data: {param: {}},
      },
      mode: "noExistMode"
    })

    my.customUrlQueryData = null
    customNavigateTo({
      url: "/package_transaction/pages/redeem/redeem",
      data: {
        data: {param: {}},
      },
      mode: "noExistMode"
    })
  })
})
