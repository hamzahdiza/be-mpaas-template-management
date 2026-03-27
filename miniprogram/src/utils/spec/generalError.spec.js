import { describe, it, vi } from "vitest";
import generalError from "../generalError.js"


describe('generalError.js', () => {
  it('execute generalError', () => {
    vi.unmock('../generalError.js')
    generalError({
      err: {data: {errorCode: 'GNR-000-997'}}
    })
    vi.mock('../utils/generalError.js', () => ({
      default: vi.fn()
    }));
  })
})
