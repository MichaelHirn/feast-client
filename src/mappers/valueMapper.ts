export const ValueMapper = {
  toValueObject (value: any): any {
    if (typeof value === 'boolean') {
      return { boolVal: value }
    }
    if (typeof value === 'string' || value instanceof String) {
      return { stringVal: value }
    }
    if (typeof value === 'number') {
      return { doubleVal: value }
    }
    if (value instanceof Array) {
      if (value.every(element => typeof element === 'boolean')) {
        return { boolListVal: value }
      }
      if (value.every(element => typeof element === 'string' || element instanceof String)) {
        return { stringListVal: value }
      }
      if (value.every(element => typeof element === 'number')) {
        return { doubleListVal: value }
      }
      throw new Error('invalid value provided: does not support this array')
    }
    throw new Error(`invalid value provided: does not support type: ${typeof value}`)
  }
}
