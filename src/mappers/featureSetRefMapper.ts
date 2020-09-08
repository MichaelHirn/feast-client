import { FeatureSetRef } from '../featureSetRef'

export const FeatureSetRefMapper = {
  toString (featureSetRef: FeatureSetRef): any {
    return `${featureSetRef.project()}/${featureSetRef.featureSet()}`
  }
}
