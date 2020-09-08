import { FeatureRow } from './featureRow'
import { SourceType } from './types'

export interface ISourceProps<T> {

  /**
   * The kind of data source Feast should connect to in order to retrieve FeatureRow value
   */
  type: SourceType

  /**
   * Source specific configuration
   */
  config: T
}

export abstract class SourceAbstract<T> {
  protected readonly props: ISourceProps<T>

  protected constructor (props: ISourceProps<T>) {
    this.props = props
  }

  public type (): SourceType {
    return this.props.type
  }

  public config (): T {
    return this.props.config
  }

  public isKafka (): boolean {
    return this.type() === 'KAFKA' as unknown as SourceType
  }

  public abstract async send (messages: FeatureRow[]): Promise<void>
}
