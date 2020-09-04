import { Client, Entity, Feature, FeatureSet, ValueType } from '../src'

const main = async (): Promise<void> => {
  const coreClient = new Client({ coreUrl: 'localhost:6565'})
  console.log(await coreClient.listProjects())
  const featureSets = await coreClient.listFeatureSets('test')
  console.log(featureSets[3])

  const entity = Entity.fromConfig('customerId', ValueType.STRING)
  const orderValue = Feature.fromConfig('orderValueInUSDCents', ValueType.INT32)
  const ageOfCustomer = Feature.fromConfig('ageOfCustomerInYears', ValueType.INT32)
  const featureSet = FeatureSet.fromConfig('testSet4', {
    project: 'test',
    entities: [entity],
    features: [orderValue, ageOfCustomer]
  })
  await coreClient.applyFeatureSet(featureSet)
  console.log(await coreClient.getFeatureSet('test', 'testSet4'))
  console.log(await coreClient.listFeatures('test', ['customerId']))
}

/* eslint-disable-next-line @typescript-eslint/no-floating-promises */
main()
