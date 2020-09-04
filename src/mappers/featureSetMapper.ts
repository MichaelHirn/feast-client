import { EntityMapper } from './entityMapper'
import { FeatureMapper } from './featureMapper'
import { FeatureSet } from '../featureSet'

export const FeatureSetMapper = {
  toFeatureSetObject: (featureSet: FeatureSet): any => {
    return {
      spec: {
        project: featureSet.project(),
        name: featureSet.name(),
        entities: featureSet.entities().map(entity => {
          return EntityMapper.toEntityRequestObject(entity)
        }),
        features: featureSet.features().map(feature => {
          return FeatureMapper.toFeatureRequestObject(feature)
        })
      }
    }
  },

  toFeatureSetRequest: (featureSet: FeatureSet): any => {
    return { featureSet: FeatureSetMapper.toFeatureSetObject(featureSet) }
  },

  toFeatureSet: (featureSetResponse: any): FeatureSet => {
    return FeatureSet.fromFeast(featureSetResponse)
  }
}
