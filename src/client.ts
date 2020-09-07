/* eslint-disable max-lines */
import * as grpc from '@grpc/grpc-js'
import * as util from 'util'
import { ApplyFeatureSetResponseStatus } from './types'
import { FeatureSetMapper, StoreMapper } from './mappers'
import { Feature } from './feature'
import { FeatureSet } from './featureSet'
import { FeatureRow } from './featureRow'
import { Store } from './store'
import { loadClientSync } from './utils'

export interface ClientConfig {

  /**
   * Feast Core URL. Used to manage features.
   */
  coreUrl: string

  /**
   * Feast Serving URL. Used to retrieve features.
   */
  servingUrl?: string

  /**
   * Sets the active project. Optional.
   */
  project?: string

  /**
   * Use client-side SSL/TLS for Core gRPC API
   *
   * @remarks Not yet implemented.
   */
  coreSecure?: undefined

  /**
   * Use client-side SSL/TLS for Serving gRPC API
   *
   * @remarks Not yet implemented.
   */
  servingSecure?: undefined

  /**
   * Enable authentication and authorization.
   *
   * @remarks Not yet implemented.
   */
  enableAuth?: undefined

  /**
   * Authentication provider type
   *
   * @remarks Not yet implemented
   */
  authProvider?: 'google' | 'oauth' | undefined

  /**
   * Mandatory if authProvider = 'oauth'
   *
   * @remarks Not yet implemented
   */
  oauthGrantType?: undefined

  /**
   * Mandatory if authProvider = 'oauth'
   *
   * @remarks Not yet implemented
   */
  oauthClientId?: undefined

  /**
   * Mandatory if authProvider = 'oauth'
   *
   * @remarks Not yet implemented
   */
  oauthClientSecret?: undefined

  /**
   * Mandatory if authProvider = 'oauth'
   *
   * @remarks Not yet implemented
   */
  oauthAudience?: undefined

  /**
   * Mandatory if authProvider = 'oauth'
   *
   * @remarks Not yet implemented
   */
  oauthTokenRequestUrl?: undefined
}

/**
 * Main Class. Client for both Feast Core and any Feast Serving endpoints.
 *
 * @alpha
 */
export class Client {
  public readonly config: ClientConfig
  protected readonly coreStub: grpc.Client
  protected readonly servingStub: grpc.Client

  public constructor (config: ClientConfig) {
    this.config = config

    const CoreClient = loadClientSync('core')
    this.coreStub = new CoreClient(this.config.coreUrl, grpc.credentials.createInsecure(), {})

    if (typeof this.config.servingUrl !== 'undefined') {
      const ServingClient = loadClientSync('serving')
      this.servingStub = new ServingClient(this.config.servingUrl, grpc.credentials.createInsecure(), {})
    }
  }

  /**
   * Returns a list of all Feast project names.
   *
   * @returns list of project names
   *
   * @public
   */
  public async listProjects (): Promise<string[]> {
    const handler = util.promisify((this.coreStub as any).listProjects.bind(this.coreStub))
    const response = await handler({})
    return response.projects
  }

  /**
   * Creates a new Feast project. Will throw if project already exists.
   *
   * @param   name - the name of the new project
   *
   * @public
   */
  public async createProject (name: string): Promise<void> {
    const handler = util.promisify((this.coreStub as any).createProject.bind(this.coreStub))
    await handler({ name })
  }

  /**
   * Archives a project. Project will still continue to function for
   * ingestion and retrieval, but will be in a read-only state. It will
   * also not be visible from the Core API for management purposes.
   *
   * @param   projectName - the name of the project to be archived.
   *
   * @public
   */
  public async archiveProject (projectName: string): Promise<void> {
    const handler = util.promisify((this.coreStub as any).archiveProject.bind(this.coreStub))
    await handler({ name: projectName })
  }

  /**
   * Retrieve feature set details given a filter.
   *
   * @remarks
   *
   * Returns all feature sets matching that filter. If none are found,
   * an empty list will be returned. If no filter is provided in the request,
   * the response will contain all the feature sets currently stored in the registry.
   *
   * @privateRemarks
   *
   * TODO: Fully implement request: https://github.com/feast-dev/feast/blob/35a9afc521fad508bfd30c153107a1cd2cef5698/protos/feast/core/CoreService.proto#L133
   *
   * @param   projectName - Name of project that the feature sets belongs to. This can be one of
   *          [project_name] or '*'. If an asterisk is provided, filtering on projects will be
   *          disabled. All projects will be matched. It is NOT possible to provide an asterisk
   *          with a string in order to do pattern matching. If unspecified this field will
   *          default to the default project 'default'.
   * @param   featureSetName - Name of the desired feature set. Asterisks can be used as wildcards
   *          in the name. Matching on names is only permitted if a specific project is defined.
   *          It is disallowed if the project name is set to "*" e.g.
   *            - * can be used to match all feature sets
   *            - my-feature-set* can be used to match all features prefixed by "my-feature-set"
   *            - my-feature-set-6 can be used to select a single feature set
   *
   * @alpha
   */
  public async listFeatureSets (
    projectName: string,
    featureSetName: string = '*',
  ): Promise<FeatureSet[]> {
    const handler = util.promisify((this.coreStub as any).listFeatureSets.bind(this.coreStub))
    const response = await handler({
      filter: {
        project: projectName,
        featureSetName: featureSetName
      }
    })
    if (response.featureSets instanceof Array) {
      return response.featureSets.map(featureSet => FeatureSet.fromFeast(featureSet))
    }
    return []
  }

  /**
   * Idempotently registers multiple feature set(s) with Feast Core.
   *
   * @privateRemarks
   *
   * See {@link Client.applyFeatureSet} privateRemarks.
   *
   * @alpha
   */
  public async applyFeatureSets (featureSets: FeatureSet[]): ReturnType<Client['applyFeatureSet']> {
    if (featureSets instanceof Array && featureSets.every(elem => elem instanceof FeatureSet)) {
      const maps = await Promise.all(featureSets.map(async (featureSet) => {
        return await this.applyFeatureSet(featureSet)
      }))
      const mapsAsArray = maps.map(map => Array.from(map.entries()))
      /* eslint-disable-next-line prefer-spread, prefer-reflect */
      const flattenedArray = [].concat.apply([], mapsAsArray)
      // returned merged Map
      return new Map(flattenedArray)
    }
    throw new Error(`expected featureSets to be an Array of FeatureSets but got: ${typeof featureSets}`)
  }

  /**
   * Idempotently registers a single feature set with Feast Core.
   *
   * @privateRemarks
   *
   * TODO: Fully implement FeatureSet Mapper. The FeatureSetRequest Mapper is complete but some attributes
   * of the FeatureSet are still missing.
   */
  public async applyFeatureSet (
    featureSet: FeatureSet
  ): Promise<Map<string, { featureSet: FeatureSet, status: ApplyFeatureSetResponseStatus }>> {
    const handler = util.promisify((this.coreStub as any).applyFeatureSet.bind(this.coreStub))
    const featureSetRequest = FeatureSetMapper.toFeatureSetRequest(featureSet)
    const featureSetResponse = await handler(featureSetRequest)
    const responseMap = new Map()
    responseMap.set(featureSet.name(), {
      featureSet: FeatureSetMapper.toFeatureSet(featureSetResponse.featureSet),
      status: ApplyFeatureSetResponseStatus[featureSetResponse.status]
    })
    return responseMap
  }

  /**
   * Returns a specific feature set.
   *
   * @beta
   */
  public async getFeatureSet (
    projectName: string,
    featureSetName: string,
  ): Promise<FeatureSet> {
    const handler = util.promisify((this.coreStub as any).getFeatureSet.bind(this.coreStub))
    const response = await handler({ project: projectName, name: featureSetName })
    return FeatureSet.fromFeast(response.featureSet)
  }

  /**
   * Returns all feature references and respective features matching that filter.
   *
   * @remarks
   *
   * If none are found an empty map will be returned
   * If no filter is provided in the request, the response will contain all the features
   * currently stored in the default project.
   *
   * @param   projectName - Name of project that the feature sets belongs to. Filtering on projects is
   *          disabled. It is NOT possible to provide an asterisk with a string in order to do pattern
   *          matching. If unspecified this field will default to the default project 'default'.
   * @param   entityNames - List of entities contained within the featureSet that the feature belongs to.
   *          Only feature sets with these entities will be searched for features.
   *
   * @privateRemarks
   *
   * TODO: Fully implement Request
   *
   * @alpha
   */
  public async listFeatures (
    projectName: string,
    entityNames: string[]
  ): Promise<Array<{ feature: Feature, project: string, featureSet: string }>> {
    const handler = util.promisify((this.coreStub as any).listFeatures.bind(this.coreStub))
    const response = await handler({
      filter: {
        project: projectName,
        entities: entityNames
      }
    })
    if (response.features instanceof Object) {
      return Object.keys(response.features).map(featureIdentifier => {
        // featureIdentifier: [project]/[featureSetName]:[featureName]
        const [projectName, ...featureSetSlag] = featureIdentifier.split('/')
        const featureSetName = featureSetSlag.join('/').split(':')[0]
        return {
          feature: Feature.fromFeast(response.features[featureIdentifier]),
          project: projectName,
          featureSet: featureSetName
        }
      })
    }
    return []
  }

  /**
   * Loads feature data into Feast for a specific feature set.
   *
   * @param   projectName - the name of a previously created Project.
   * @param   featureSetName - the name of a previously created FeatureSet. The FeatureSet
   *          must belong to the specified Project or will be unable to resolve the FeatureSet.
   */
  public async ingest (
    projectName: string,
    featureSetName: string,
    featureRows: FeatureRow[]
  ): Promise<void> {
    const featureSet = await this.getFeatureSet(projectName, featureSetName)
    if (!(featureSet instanceof FeatureSet)) {
      throw new Error(
        `unable to resolve feature set "${featureSetName}" for project "${projectName}". Make sure it exists.`
      )
    }
    if (!featureSet.isReady()) {
      throw new Error(
        `feature set "${featureSetName}" is not ready yet. current status is ${featureSet.status()}. Try again later.`
      )
    }
    await featureSet
    console.log(JSON.stringify(featureSet, null, 2))
  }

  /**
   * Retrieve store details given a filter.
   *
   * @remarks
   *
   * Returns all stores matching that filter. If none are found, an empty list will be returned.
   * If no filter is provided in the request, the response will contain all the stores currently
   * stored in the registry.
   *
   * @param   storeName - Name of desired store. Regex is not supported in this query. Optional.
   */
  public async listStores (storeName?: string): Promise<ReturnType<typeof StoreMapper['fromListStoresResponse']>> {
    const handler = util.promisify((this.coreStub as any).listStores.bind(this.coreStub))
    const response = await handler({
      filter: {
        name: storeName
      }
    })
    return StoreMapper.fromListStoresResponse(response)
  }

  /**
   * Updates the store with the provided store configuration.
   *
   * @remarks
   *
   * If the changes are valid, core will return the given store configuration in response, and
   * start or update the necessary feature population jobs for the updated store.
   *
   */
  public async updateStore (store: Store): Promise<ReturnType<typeof StoreMapper['fromUpdateStoreResponse']>> {
    const handler = util.promisify((this.coreStub as any).updateStore.bind(this.coreStub))
    const response = await handler({ store })
    return StoreMapper.fromUpdateStoreResponse(response)
  }
}
