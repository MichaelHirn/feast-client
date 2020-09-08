import { StoreType } from './types'

export interface IStoreProps {

  /**
   * Name of the store.
   */
  name: string

  /**
   * Type of the store.
   *
   * @remarks
   *
   * For more, see {@link StoreType}
   */
  type: StoreType

  /**
   * Feature sets to subscribe to.
   */
  subscriptions: any[]

  /**
   * Configuration to connect to the store. Required.
   */
  config: any
}

export class Store {
  protected readonly props: IStoreProps

  private constructor (props: IStoreProps) {
    this.props = props
  }

  public name (): string {
    return this.props.name
  }

  public type (): StoreType {
    return this.props.type
  }

  public isInvalid (): boolean {
    return this.type() === 'INVALID' as unknown as StoreType
  }

  public isRedis (): boolean {
    return this.type() === 'REDIS' as unknown as StoreType
  }

  public isBigQuery (): boolean {
    return this.type() === 'BIGQUERY' as unknown as StoreType
  }

  public isCassandra (): boolean {
    return this.type() === 'CASSANDRA' as unknown as StoreType
  }

  public isRedisCluster (): boolean {
    return this.type() === 'REDIS_CLUSTER' as unknown as StoreType
  }

  public static fromFeast (response: any): Store {
    if (typeof response.type !== 'undefined') {
      response.type = StoreType[response.type] as unknown as StoreType
    }

    return new Store(response)
  }
}
