import { describe, it } from "vitest";
import { generateSignature } from "../signature";

describe("Create signature file",()=>{
  it('execute generate signature function with 32 bit', () => {
    const privKey = 'K8/+PDG831HSJw14QXjINNjixstOYNzflltg0QAlGRQ='
    const pubKey = 'LSAg6l2bKsDr4SCX0dqbHBrPwSrXnyYX6xwbVs3kPAA='
    const body = {a: 'AAA'}
    generateSignature(privKey, pubKey, JSON.stringify(body))
  })

  it('execute generate signature function with 64 bit', () => {
    const privKey = 'D0QOExkDBq2t4QNaqr9XLDuW08vGYKi3fawNHGgmH0ob2lsQxjXPJIL0a9C+a/ovTnSFPTjWfSAcrylZXaklBQ=='
    const pubKey = 'LSAg6l2bKsDr4SCX0dqbHBrPwSrXnyYX6xwbVs3kPAA='
    const body = {a: 'AAA'}
    generateSignature(privKey, pubKey, JSON.stringify(body))
  })
})