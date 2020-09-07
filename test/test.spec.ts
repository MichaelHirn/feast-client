import * as feast from '../src'
import * as fs from 'fs-extra'
import * as path from 'path'
import { FeatureRowMapper } from '../src/mappers/featureRowMapper'

describe('FeatureSet', () => {
  test('can construct a FeatureSet with one entity and multiple features', () => {
    const entity = feast.Entity.fromConfig('customerId', feast.ValueType.STRING)
    const orderValue = feast.Feature.fromConfig('orderValueInUSDCents', feast.ValueType.INT32)
    const ageOfCustomer = feast.Feature.fromConfig('ageOfCustomerInYears', feast.ValueType.INT32)
    /* eslint-disable-next-line no-new */
    feast.FeatureSet.fromConfig('testSet', {
      project: 'testProject',
      entities: [entity],
      features: [orderValue, ageOfCustomer]
    })
  })

  test('can construct a FeatureSet from Feast Response Object', () => {
    const responseObject = fs.readJsonSync(path.join(__dirname, './fixtures/featureSetResponse.example.json'))
    const featureSet = feast.FeatureSet.fromFeast(responseObject)
    expect(featureSet.name()).toBe('testSet')
  })
})

describe('Store', () => {
  test('can construct Store(s) from Store Response Object', () => {
    const responseObject = fs.readJsonSync(path.join(__dirname, './fixtures/storeResponse.example.json'))
    const store = feast.Store.fromFeast(responseObject)
    expect(store.name()).toBe('online')
    expect(store.type()).toBe('REDIS')
    expect(store.isRedis()).toBe(true)
  })
})

describe('Source', () => {
  test('can construct Source from Source Response Object', () => {
    const responseObject = fs.readJsonSync(path.join(__dirname, './fixtures/sourceResponse.example.json'))
    const source = feast.Source.fromFeast(responseObject)
    expect(source).toBeInstanceOf(feast.KafkaSource)
    expect(source.type()).toBe('KAFKA')
    expect(source.isKafka()).toBe(true)
  })
})

describe('FeatureRow', () => {
  test('can construct a FeatureRow from config', () => {
    const featureRow = feast.FeatureRow.fromConfig({
      fields: {
        'testFeature': 100
      },
      featureSet: 'testProject/testSet',
      eventTimestamp: 1
    })
    expect(featureRow.featureSetRef().project()).toBe('testProject')
    expect(featureRow.featureSetRef().featureSet()).toBe('testSet')
    expect(featureRow.fields()).toEqual({'testFeature': 100})
    expect(featureRow.eventTimestamp()).toBe(1)
    expect(typeof featureRow.ingestionId()).toBe('undefined')
  })

  test('can map a FeatureRow to a FeatureRow Request Object', () => {
    const featureRow = feast.FeatureRow.fromConfig({
      fields: {
        'testFeature': 100
      },
      featureSet: 'testProject/testSet',
      eventTimestamp: 1
    })
    featureRow.setIngestionId('abc')
    const featureRowObject = FeatureRowMapper.toRequestObject(featureRow)
    expect(featureRowObject).toEqual({
      fields: [
        {
          name: 'testFeature',
          value: 100
        }
      ],
      eventTimestamp: 1,
      featureSet: 'testProject/testSet',
      ingestionId: 'abc'
    })
  })
})
