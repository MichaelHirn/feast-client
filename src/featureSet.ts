import { Entity } from './entity'
import { Feature } from './feature'
import { FeatureSetStatus } from './types'
import { Source } from './source'
import { SourceAbstract } from './sourceAbstract'

export interface IFeatureSetConstructorParams {

  /**
   * See {@link IFeatureSetProps.spec.project}
   */
  project: string

  /**
   * See {@link IFeatureSetProps.spec.entities}
   */
  entities: Entity[]

  /**
   * See {@link IFeatureSetProps.spec.features}
   */
  features?: Feature[]

  /**
   * See {@link IFeatureSetProps.spec.maxAge}
   */
  maxAge?: number

  /**
   * See {@link IFeatureSetProps.spec.source}
   */
  source?: SourceAbstract<any>

  /**
   * See {@link IFeatureSetProps.spec.labels}
   */
  labels?: { [key: string]: string }
}

export interface IFeatureSetProps {

  /**
   * User-specified specifications of this feature set.
   */
  spec: {

    /**
     * Name of project that this feature set belongs to.
     */
    project: string

    /**
     * Name of the feature set. Must be unique.
     */
    name: string

    // List of entities contained within this featureSet.
    // This allows the feature to be used during joins between feature sets.
    // If the featureSet is ingested into a store that supports keys, this value
    // will be made a key.
    entities: Entity[]

    // List of features contained within this featureSet.
    features: Feature[]

    // Features in this feature set will only be retrieved if they are found
    // after [time - max_age]. Missing or older feature values will be returned
    // as nulls and indicated to end user
    maxAge?: number

    // Optional. Source on which feature rows can be found.
    // If not set, source will be set to the default value configured in Feast Core.
    source?: SourceAbstract<any>

    // User defined metadata
    labels?: { [key: string]: string }

    // Read-only self-incrementing version that increases monotonically
    // when changes are made to a feature set
    version?: number
  }

  /**
   * System-populated metadata for this feature set.
   */
  meta?: {

    /**
     * Timestamp when this specific feature set was created.
     */
    createdTimestamp: number

    /**
     * Status of the feature set. Used to indicate wheter the feature set is ready for consumption or ingestion.
     */
    status: FeatureSetStatus
  }
}

/**
 * Class representing a Feature Set, a way to organize {@link Feature | Features} and manage schemas.
 *
 * @remarks
 *
 * To learn more: https://docs.feast.dev/user-guide/feature-sets
 *
 * @alpha
 */
export class FeatureSet {
  protected readonly props: IFeatureSetProps

  private constructor (props: IFeatureSetProps) {
    this.props = props
  }

  public name (): IFeatureSetProps['spec']['name'] {
    return this.props.spec.name
  }

  public project (): IFeatureSetProps['spec']['project'] {
    return this.props.spec.project
  }

  public entities (): IFeatureSetProps['spec']['entities'] {
    return this.props.spec.entities
  }

  public features (): IFeatureSetProps['spec']['features'] {
    return this.props.spec.features
  }

  public source (): SourceAbstract<any> {
    return this.props.spec.source
  }

  public status (): FeatureSetStatus | 'UNKNOWN' {
    if (this.props.meta instanceof Object) {
      return this.props.meta.status
    }
    return 'UNKNOWN'
  }

  public isInvalid (): boolean {
    return this.status() === 'STATUS_INVALID' as unknown as FeatureSetStatus
  }

  public isPending (): boolean {
    return this.status() === 'STATUS_PENDING' as unknown as FeatureSetStatus
  }

  public isReady (): boolean {
    return this.status() === 'STATUS_READY' as unknown as FeatureSetStatus
  }

  public isJobStarting (): boolean {
    return this.status() === 'STATUS_JOB_STARTING' as unknown as FeatureSetStatus
  }

  public hasUnknownStatus (): boolean {
    return this.status() === 'UNKNOWN'
  }

  public version (): number {
    return this.props.spec.version
  }

  public static fromConfig (name: IFeatureSetProps['spec']['name'], params: IFeatureSetConstructorParams): FeatureSet {
    const props = {
      spec: {
        project: params.project,
        name,
        entities: params.entities,
        features: params.features,
        maxAge: params.maxAge,
        source: params.source,
        labels: params.labels,
      }
    }
    return new FeatureSet(props)
  }

  public static fromFeast (response: any): FeatureSet {
    if (response.spec instanceof Object) {
      response.spec.entities = response.spec.entities.map(object => Entity.fromFeast(object))
      if (response.spec.features instanceof Array) {
        response.spec.features = response.spec.features.map(object => Feature.fromFeast(object))
      }
      if (response.spec.source instanceof Object) {
        response.spec.source = Source.fromFeast(response.spec.source)
      }
    }
    if (response.meta instanceof Object) {
      response.meta.createdTimestamp = response.meta.createdTimestamp?.seconds?.low
      response.meta.status = FeatureSetStatus[response.meta.status] as unknown as FeatureSetStatus
    }

    return new FeatureSet(response)
  }
}
