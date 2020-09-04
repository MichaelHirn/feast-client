import { Field } from './field'
import { ValueType } from './types'

export interface IFeatureProps {

  /**
   * Name of the feature.
   */
  name: string

  /**
   * Value type of the feature.
   */
  valueType: ValueType

  /**
   * Labels for user defined metadata on a feature.
   */
  labels?: { [key: string]: string }
}

/**
 * Class representing a Feature, a single property used as input into a model (at training and serving).
 *
 * @remarks
 *
 * To learn more: https://docs.feast.dev/user-guide/features
 *
 * @alpha
 */
export class Feature extends Field<IFeatureProps> {
  public static fromConfig (
    name: IFeatureProps['name'],
    valueType: IFeatureProps['valueType'],
    params: Omit<IFeatureProps, 'name' | 'valueType'> = {}
  ): Feature {
    return new Feature({ ...params, name, valueType })
  }

  public static fromFeast (object: any): Feature {
    if (typeof object.valueType !== 'undefined') {
      object.valueType = ValueType[object.valueType]
    }
    return new Feature(object)
  }

}
