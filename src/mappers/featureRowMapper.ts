import * as protobuf from 'protobufjs'
import { FeatureRow } from '../featureRow'
import { FeatureSetRefMapper } from './featureSetRefMapper'
import { TimestampMapper } from './timestampMapper'
import { ValueMapper } from './valueMapper'

export const FeatureRowMapper = {
  toRequestObject (featureRow: FeatureRow): any {
    const fieldArray = Object.keys(featureRow.fields()).map(fieldName => {
      return {
        name: fieldName,
        value: ValueMapper.toValueObject(featureRow.fields()[fieldName])
      }
    })
    return {
      fields: fieldArray,
      eventTimestamp: TimestampMapper.toGoogleProtobufTimestampObject(featureRow.eventTimestamp()),
      featureSet: FeatureSetRefMapper.toString(featureRow.featureSetRef()),
      ingestionId: featureRow.ingestionId()
    }
  },

  toProtobufEncoding (featureRow: FeatureRow, protoType: protobuf.Type): Buffer {
    const errorMessage = protoType.verify(featureRow)
    if (typeof errorMessage === 'string') {
      throw new Error(`invalid feature row: ${errorMessage}`)
    }
    return Buffer.from(protoType.encode(FeatureRowMapper.toRequestObject(featureRow)).finish())
  }
}
