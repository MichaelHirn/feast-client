import { FeatureRow } from '../featureRow'
import { FeatureSetRefMapper } from './featureSetRefMapper'

export const FeatureRowMapper = {
  toRequestObject (featureRow: FeatureRow): any {
    const fieldArray = Object.keys(featureRow.fields()).map(fieldName => {
      return { name: fieldName, value: featureRow.fields()[fieldName] }
    })
    return {
      fields: fieldArray,
      eventTimestamp: featureRow.eventTimestamp(),
      featureSet: FeatureSetRefMapper.toString(featureRow.featureSetRef()),
      ingestionId: featureRow.ingestionId()
    }
  }
}
