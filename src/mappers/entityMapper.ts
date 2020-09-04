import { Entity } from '../entity'

export const EntityMapper = {
  toEntityRequestObject: (entity: Entity): any => {
    return {
      name: entity.name(),
      valueType: entity.valueType()
    }
  }
}
