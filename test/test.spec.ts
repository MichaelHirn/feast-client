import * as fs from 'fs-extra'
import * as path from 'path'
import { Entity, Feature, FeatureSet, ValueType } from '../src'

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
    const featureSetResponse = fs.readJsonSync(path.join(__dirname, './fixtures/featureSetResponse.example.json'))
    const featureSet = FeatureSet.fromFeast(featureSetResponse)
    expect(featureSet.name()).toBe('testSet')
  })
})
