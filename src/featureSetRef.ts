export interface IFeatureSetRefProps {

  /**
   * Project name as string.
   */
  project: string

  /**
   * Feature set name as string.
   */
  featureSet: string
}

export class FeatureSetRef {
  protected readonly props: IFeatureSetRefProps

  private constructor (props: IFeatureSetRefProps) {
    this.props = props
  }

  public project (): string {
    return this.props.project
  }

  public featureSet (): string {
    return this.props.featureSet
  }

  public id (): string {
    return `${this.project()}/${this.featureSet()}`
  }

  /**
   * Construct a FeatureSetRef from string.
   *
   * @param   ref - Complete reference to the featureSet in the form of '/'.
   */
  public static fromConfig (ref: string): FeatureSetRef {
    const [project, featureSet] = ref.split('/')
    if (typeof project === 'string' && typeof featureSet === 'string') {
      return new FeatureSetRef({project, featureSet})
    }
    throw new Error(`Invalid ref string: ${ref}`)
  }
}
