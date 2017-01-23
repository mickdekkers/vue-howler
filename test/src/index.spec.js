import { expect } from 'chai'
import { helloworld } from '../../dist/my-module'

describe('helloworld method', () => {
  it ('should return \'hello world!\'', () => {
    expect(helloworld()).to.equal('hello world!')
  })
})
