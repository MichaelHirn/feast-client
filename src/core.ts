import * as grpc from '@grpc/grpc-js'
import * as util from 'util'
import { loadClientSync } from './utils'

export class Core {
  public readonly model: any

  public constructor (
    address: string,
    credentials: grpc.ChannelCredentials = grpc.credentials.createInsecure(),
    options: grpc.ClientOptions = {}
  ) {
    const CoreClient = loadClientSync('core')
    const coreClient = new CoreClient(address, credentials, options)
    this.model = coreClient
  }

  /**
   * Returns a list of all Feast project names.
   *
   * @returns list of project names
   */
  public async listProjects (): Promise<string[]> {
    const handler = util.promisify(this.model.listProjects.bind(this.model))
    const response = await handler({})
    return response.projects
  }

  /**
   * Creates a new Feast project. Will throw if project already exists.
   *
   * @param   name - the name of the new project
   */
  public async createProject (name: string): Promise<void> {
    const handler = util.promisify(this.model.createProject.bind(this.model))
    await handler({ name })
  }

  /**
   * Archives a project. Project will still continue to function for
   * ingestion and retrieval, but will be in a read-only state. It will
   * also not be visible from the Core API for management purposes.
   *
   * @param   projectName - the name of the project to be archived.
   */
  public async archiveProject (projectName: string): Promise<void> {
    const handler = util.promisify(this.model.archiveProject.bind(this.model))
    await handler({ name: projectName })
  }

}
