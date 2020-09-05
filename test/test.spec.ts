import * as fs from 'fs-extra'
import * as path from 'path'
import { Entity, Feature, FeatureSet, Store, ValueType } from '../src'

describe('FeatureSet', () => {
  test('can construct a FeatureSet with one entity and multiple features', () => {
    const entity = Entity.fromConfig('customerId', ValueType.STRING)
    const orderValue = Feature.fromConfig('orderValueInUSDCents', ValueType.INT32)
    const ageOfCustomer = Feature.fromConfig('ageOfCustomerInYears', ValueType.INT32)
    /* eslint-disable-next-line no-new */
    FeatureSet.fromConfig('testSet', {
      project: 'testProject',
      entities: [entity],
      features: [orderValue, ageOfCustomer]
    })
  })

  test('can construct a FeatureSet from Feast Response Object', () => {
    const responseObject = fs.readJsonSync(path.join(__dirname, './fixtures/featureSetResponse.example.json'))
    const featureSet = FeatureSet.fromFeast(responseObject)
    expect(featureSet.name()).toBe('testSet')
  })
})

describe('Store', () => {
  test('can construct Store(s) from Store Response Object', () => {
    const responseObject = fs.readJsonSync(path.join(__dirname, './fixtures/storeResponse.example.json'))
    const store = Store.fromFeast(responseObject)
    expect(store.name()).toBe('online')
    expect(store.type()).toBe('REDIS')
    expect(store.isRedis()).toBe(true)
  })
})
