import { FeatureSetRef } from './featureSetRef'

export interface IFeatureRowConfig {

  /**
   * Object of features and their names.
   *
   * @example
   *
   * ```typescript
   * {
   *   'orderValueinUSD': 100
   *   'customerFlag': 'priority'
   * }
   * ```
   */
  fields: { [featureName: string]: any }

  /**
   * Complete reference to the featureSet this featureRow belongs to, in the form of /.
   *
   * @example
   *
   * `[projectName]/[featureSetName]`
   *
   * @remarks
   *
   * This value will be used by the feast ingestion job to filter rows, and write the
   * values to the correct tables.
   */
  featureSet: string

  /**
   * Timestamp of the feature row. While the actual definition of this timestamp may
   * vary depending on the upstream feature creation pipelines, this is the timestamp
   * that Feast will use to perform joins, determine latest values, and coalesce rows.
   */
  eventTimestamp: number

  /**
   * Identifier tying this feature row to a specific ingestion job.
   */
  ingestionId?: string
}

export interface IFeatureRowProps {

  /**
   * {@inheritDoc IFeatureRowConfig.fields}
   */
  fields: { [featureName: string]: any }

  /**
   * {@inheritDoc IFeatureRowConfig.featureSet}
   */
  featureSetRef: FeatureSetRef

  /**
   * {@inheritDoc IFeatureRowConfig.eventTimestamp}
   */
  eventTimestamp: number

  /**
   * {@inheritDoc IFeatureRowConfig.ingestionId}
   */
  ingestionId?: string
}

export class FeatureRow {
  protected props: IFeatureRowProps

  private constructor (props: IFeatureRowProps) {
    this.props = props
  }

  public fields (): IFeatureRowProps['fields'] {
    return this.props.fields
  }

  public featureSetRef (): FeatureSetRef {
    return this.props.featureSetRef
  }

  public eventTimestamp (): number {
    return this.props.eventTimestamp
  }

  public ingestionId (): string | undefined {
    return this.props.ingestionId
  }

  public setIngestionId (ingestionId: string): void {
    this.props.ingestionId = ingestionId
  }

  public static fromConfig (config: IFeatureRowConfig): FeatureRow {
    return new FeatureRow({
      fields: config.fields,
      featureSetRef: FeatureSetRef.fromConfig(config.featureSet),
      eventTimestamp: config.eventTimestamp,
      ingestionId: config.ingestionId
    })
  }
}
