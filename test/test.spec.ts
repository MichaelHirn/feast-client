import * as feast from '../src'
import * as fs from 'fs-extra'
import * as path from 'path'
import { FeatureRowMapper, TimestampMapper, ValueMapper } from '../src/mappers'
import { loadProtoType } from '../src/utils'

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
          value: {
            doubleVal: 100
          }
        }
      ],
      eventTimestamp: {
        seconds: 0,
        nanos: 1000000
      },
      featureSet: 'testProject/testSet',
      ingestionId: 'abc'
    })
  })

  test('can map a FeatureRow to Protobuf encoding', async () => {
    const featureRow = feast.FeatureRow.fromConfig({
      fields: {
        'testFeature': 100
      },
      featureSet: 'testProject/testSet',
      eventTimestamp: 1,
      ingestionId: 'abc'
    })
    const encoding = FeatureRowMapper.toProtobufEncoding(featureRow, await loadProtoType('FeatureRow'))
    expect(encoding).toBeInstanceOf(Buffer)
  })
})

describe('Timestamp', () => {
  test('can map between milliseconds and google.protobuf.Timestamp objects', () => {
    const startTimestamp = 1599551338591
    const object = TimestampMapper.toGoogleProtobufTimestampObject(startTimestamp)
    const milliseconds = TimestampMapper.toMilliseconds(object)
    expect(milliseconds).toBe(startTimestamp)
  })
})

describe('Value', () => {
  test('maps boolean to correct Value object', () => {
    expect(ValueMapper.toValueObject(true)).toEqual({ boolVal: true })
  })

  test('maps boolean list to correct Value object', () => {
    expect(ValueMapper.toValueObject([true])).toEqual({ boolListVal: [true] })
  })

  test('maps string to correct Value object', () => {
    expect(ValueMapper.toValueObject('string')).toEqual({ stringVal: 'string' })
  })

  test('maps string list to correct Value object', () => {
    expect(ValueMapper.toValueObject(['string'])).toEqual({ stringListVal: ['string'] })
  })

  test('maps integer to correct Value object', () => {
    expect(ValueMapper.toValueObject(123)).toEqual({ doubleVal: 123 })
  })

  test('maps integer list to correct Value object', () => {
    expect(ValueMapper.toValueObject([123])).toEqual({ doubleListVal: [123] })
  })

  test('maps float to correct Value object', () => {
    expect(ValueMapper.toValueObject(1.23)).toEqual({ doubleVal: 1.23 })
  })

  test('maps float list to correct Value object', () => {
    expect(ValueMapper.toValueObject([1.23])).toEqual({ doubleListVal: [1.23] })
  })
})
