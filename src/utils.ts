import * as grpc from '@grpc/grpc-js'
import * as path from 'path'
import * as protoLoader from '@grpc/proto-loader'

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
