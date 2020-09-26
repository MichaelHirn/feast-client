import * as grpc from '@grpc/grpc-js'
import { BaseConfig, Configurable } from 'ts-configurable'

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

@Configurable({ })
export class Config extends BaseConfig<Config> {

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
   * Authentication token
   */
  /* eslint-disable-next-line no-undefined */
  authToken?: string = undefined

  /**
   * Mandatory if authProvider = 'oauth'
   */
  /* eslint-disable-next-line no-undefined */
  oauthProviderConfig?: IOAuthProviderConfig = undefined

  public createCoreGRPCClient (Client: typeof grpc.Client): grpc.Client {
    if (this.coreSecure) {
      var channelCredentials = grpc.credentials.createSsl()
      if (this.enableAuth) {
        const callCredentials = this.tryToGenerateCallCredentials()
        channelCredentials = grpc.credentials.combineChannelCredentials(channelCredentials, callCredentials)
      }
      return new Client(this.coreUrl, channelCredentials, {})
    }
    return new Client(this.coreUrl, grpc.credentials.createInsecure(), {})
  }

  public createServingGRPCClient (Client: typeof grpc.Client): grpc.Client {
    if (this.servingSecure) {
      var channelCredentials = grpc.credentials.createSsl()
      if (this.enableAuth) {
        const callCredentials = this.tryToGenerateCallCredentials()
        channelCredentials = grpc.credentials.combineChannelCredentials(channelCredentials, callCredentials)
      }
      return new Client(this.servingUrl, channelCredentials, {})
    }
    return new Client(this.servingUrl, grpc.credentials.createInsecure(), {})
  }

  protected tryToGenerateCallCredentials (): grpc.CallCredentials {
    switch (this.authProvider) {
      case 'oauth': return this.tryToGenerateOAuthCredentials()
      case 'google': return this.tryToGenerateGoogleCredentials()
      default: throw new Error(`invalid 'authProvider': ${this.authProvider as string}`)
    }
  }

  protected tryToGenerateOAuthCredentials (): grpc.CallCredentials {
    if (typeof this.authToken !== 'undefined') {
      const token = this.authToken
      return grpc.credentials.createFromMetadataGenerator((context, callback) => {
        const meta = new grpc.Metadata()
        meta.add('authorization', `Bearer ${token}`)
        callback(new Error('test'), meta)
      })
    } else if (this.oauthProviderConfig instanceof Object) {
      throw new Error('OAuth credentials via oauthProviderConfig is not yet implemented.')
    }
    throw new Error('unable to create OAuth credentials: expected either \'authToken\' or \'oauthProviderConfig\' to be provided.')
  }

  /* eslint-disable-next-line class-methods-use-this */
  protected tryToGenerateGoogleCredentials (): grpc.CallCredentials {
    throw new Error('authentication via google authProvider is not yet implemented.')
  }
}
