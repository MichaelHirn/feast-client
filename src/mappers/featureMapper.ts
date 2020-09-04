import { Feature } from '../feature'

export const FeatureMapper = {
  toFeatureRequestObject: (feature: Feature): any => {
    return {
      name: feature.name(),
      valueType: feature.valueType()
    }
  }
}
