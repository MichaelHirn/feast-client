import * as fs from 'fs'
import * as grpc from '@grpc/grpc-js'
import * as path from 'path'
import * as protoLoader from '@grpc/proto-loader'
import * as protobuf from 'protobufjs'

const protoDir = path.join(__dirname, '../protos/')
const LATEST_FEAST_VERSION = '0.6.2'

const parseProto = async (feastVersion: string, feastFilePath: string, options): Promise<grpc.GrpcObject> => {
  const protoFeastVersionDir = path.join(protoDir, `feast_${feastVersion}`)

  const packageDefinition = await protoLoader.load(
    path.join(protoFeastVersionDir, `feast/${feastFilePath}`),
    { ...options, ...{ includeDirs: [protoFeastVersionDir] } }
  )
  return grpc.loadPackageDefinition(packageDefinition)
}

const parseProtoSync = (feastVersion: string, feastFilePath: string, options): grpc.GrpcObject => {
  const protoFeastVersionDir = path.join(protoDir, `feast_${feastVersion}`)

  const packageDefinition = protoLoader.loadSync(
    path.join(protoFeastVersionDir, `feast/${feastFilePath}`),
    { ...options, ...{ includeDirs: [protoFeastVersionDir] } }
  )
  return grpc.loadPackageDefinition(packageDefinition)
}

export const loadClient = async (type: 'core' | 'serving', feastVersion: string = LATEST_FEAST_VERSION): Promise<typeof grpc.Client> => {
  switch (type) {
    case 'core': return await (async () => {
      const lib: any = await parseProto(feastVersion, 'core/CoreService.proto', {})
      return lib.feast.core.CoreService
    })()
    case 'serving': return await (async () => {
      const lib: any = await parseProto(feastVersion, 'serving/ServingService.proto', {})
      return lib.feast.serving.ServingService
    })()
    default: throw new Error(`Invalid type: ${type as string}`)
  }
}

export const loadClientSync = (type: 'core' | 'serving', feastVersion: string = LATEST_FEAST_VERSION): typeof grpc.Client => {
  switch (type) {
    case 'core': return (() => {
      const lib: any = parseProtoSync(feastVersion, 'core/CoreService.proto', {})
      return lib.feast.core.CoreService
    })()
    case 'serving': return (() => {
      const lib: any = parseProtoSync(feastVersion, 'serving/ServingService.proto', {})
      return lib.feast.serving.ServingService
    })()
    default: throw new Error(`Invalid type: ${type as string}`)
  }
}

export const loadProtoType = async (type: string, feastVersion: string = LATEST_FEAST_VERSION): Promise<protobuf.Type> => {

  const addIncludePathResolver = (root: protobuf.Root, includePaths: string[]): void => {
    const originalResolvePath = root.resolvePath
    root.resolvePath = (origin: string, target: string) => {
      if (path.isAbsolute(target)) {
        return target
      }
      for (const directory of includePaths) {
        const fullPath: string = path.join(directory, target)
        try {
          fs.accessSync(fullPath, fs.constants.R_OK)
          return fullPath
        } catch (err) {
          /* eslint-disable-next-line no-continue */
          continue
        }
      }
      /* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */
      process.emitWarning(`${target} not found in any of the include paths ${includePaths}`)
      return originalResolvePath(origin, target)
    }
  }

  const protoFeastVerstionTypeDir = path.join(protoDir, `feast_${feastVersion}/feast/types/${type}.proto`)
  const root: protobuf.Root = new protobuf.Root()
  addIncludePathResolver(root, [path.join(protoDir, `feast_${feastVersion}`)])
  const loadedRoot = await root.load(protoFeastVerstionTypeDir)
  loadedRoot.resolveAll()
  return loadedRoot.lookupType(`feast.types.${type}`)
}
