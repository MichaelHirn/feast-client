import { Field } from './field'
import { ValueType } from './types'

export interface IEntityProps {

  /**
   * Name of the entity.
   */
  name: string

  /**
   * Value Type of the entity.
   */
  valueType: ValueType
}

/**
 * Class representing an Entity, a domain object that has associated features
 *
 * @remarks
 *
 * To learn more about Entities: https://docs.feast.dev/user-guide/entities
 *
 * @alpha
 */
export class Entity extends Field<IEntityProps> {
  public static fromConfig (name: IEntityProps['name'], valueType: IEntityProps['valueType']): Entity {
    return new Entity({name, valueType})
  }

  public static fromFeast (object: any): Entity {
    if (typeof object.valueType !== 'undefined') {
      object.valueType = ValueType[object.valueType]
    }
    return new Entity(object)
  }
}
