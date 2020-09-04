import { ValueType } from './types'

export interface IFieldProps {

  /**
   * Name of the field.
   */
  name: string

  /**
   * Value Type of the field.
   */
  valueType: ValueType
}

export class Field<T extends IFieldProps> {
  protected readonly props: T

  protected constructor (props: T) {
    this.props = props
  }

  public name (): IFieldProps['name'] {
    return this.props.name
  }

  public valueType (): IFieldProps['valueType'] {
    return this.props.valueType
  }
}
