import * as grpc from '@grpc/grpc-js'
import { Configurable, BaseConfig } from 'ts-configurable'

export interface IOAuthProviderConfig {

  /**
   * Mandatory if authProvider = 'oauth'
   *
   * @remarks Not yet implemented
   */
  grantType: string

  /**
   * Mandatory if authProvider = 'oauth'
   *
   * @remarks Not yet implemented
   */
  clientId: string

  /**
   * Mandatory if authProvider = 'oauth'
   *
   * @remarks Not yet implemented
   */
  clientSecret: string

  /**
   * Mandatory if authProvider = 'oauth'
   *
   * @remarks Not yet implemented
   */
  audience: string

  /**
   * Mandatory if authProvider = 'oauth'
   *
   * @remarks Not yet implemented
   */
  tokenRequestUrl: string
}

export interface IBaseConfig {

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
   */
  coreSecure?: boolean

  /**
   * Use client-side SSL/TLS for Serving gRPC API
   */
  servingSecure?: boolean

  /**
   * Enable authentication and authorization.
   */
  enableAuth?: boolean

  /**
   * Authentication provider type
   */
  authProvider?: 'google' | 'oauth'

  /**
   * Mandatory if authProvider = 'oauth'
   */
  oauthProviderConfig?: IOAuthProviderConfig
}

@Configurable({ })
export class Config extends BaseConfig<IBaseConfig> {

  /**
   * Feast Core URL. Used to manage features.
   */
  coreUrl: string = ''

  /**
   * Feast Serving URL. Used to retrieve features.
   */
  /* eslint-disable-next-line no-undefined */
  servingUrl?: string = undefined

  /**
   * Sets the active project. Optional.
   */
  /* eslint-disable-next-line no-undefined */
  project?: string = undefined

  /**
   * Use client-side SSL/TLS for Core gRPC API
   */
  /* eslint-disable-next-line no-undefined */
  coreSecure?: boolean = undefined

  /**
   * Use client-side SSL/TLS for Serving gRPC API
   */
  /* eslint-disable-next-line no-undefined */
  servingSecure?: boolean = undefined

  /**
   * Enable authentication and authorization.
   */
  /* eslint-disable-next-line no-undefined */
  enableAuth?: boolean = undefined

  /**
   * Authentication provider type
   */
  /* eslint-disable-next-line no-undefined */
  authProvider?: 'google' | 'oauth' = undefined

  /**
   * Mandatory if authProvider = 'oauth'
   */
  /* eslint-disable-next-line no-undefined */
  oauthProviderConfig?: IOAuthProviderConfig = undefined

  public createCoreGRPCClient (Client: typeof grpc.Client): grpc.Client {
    if (this.coreSecure) {
      var channelCredentials = grpc.credentials.createSsl()
      if (this.enableAuth) {

      }
      return new Client(this.coreUrl, channelCredentials, {})
    }
    return new Client(this.coreUrl, grpc.credentials.createInsecure(), {})
  }

  public createServingGRPCClient (Client: typeof grpc.Client): grpc.Client {
    if (this.servingSecure) {
      var channelCredentials = grpc.credentials.createSsl()
      if (this.enableAuth) {

      }
      return new Client(this.servingUrl, channelCredentials, {})
    }
    return new Client(this.servingUrl, grpc.credentials.createInsecure(), {})
  }
}
