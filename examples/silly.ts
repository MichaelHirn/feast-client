import * as feast from '../src'

const main = async (): Promise<void> => {
  const coreClient = new feast.Client({ coreUrl: 'localhost:6565'})
  try {
    await coreClient.createProject('test')
  } catch (err) {
    console.log(err.message)
  }
  /* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */
  console.log(`Project: ${await coreClient.listProjects()}`)
  console.log(`Stores: ${JSON.stringify(await coreClient.listStores(), null, 2)}`)
  const featureSets = await coreClient.listFeatureSets('test')
  console.log(featureSets[3])

  const entity = feast.Entity.fromConfig('customerId', feast.ValueType.STRING)
  const orderValue = feast.Feature.fromConfig('orderValueInUSDCents', feast.ValueType.INT32)
  const ageOfCustomer = feast.Feature.fromConfig('ageOfCustomerInYears', feast.ValueType.INT32)
  let featureSet = feast.FeatureSet.fromConfig('testSet4', {
    project: 'test',
    entities: [entity],
    features: [orderValue, ageOfCustomer]
  })
  //await coreClient.applyFeatureSet(featureSet)
  console.log(featureSet = await coreClient.getFeatureSet('test', 'testSet4'))
  console.log(await coreClient.listFeatures('test', ['customerId']))

  const featureRow = feast.FeatureRow.fromConfig({
    fields: {
      orderValueInUSDCents: 100,
      ageOfCustomerInYears: 23
    },
    eventTimestamp: 1,
    featureSet: 'test/testSet4'
  })
  const ingestionId = await coreClient.ingest('test', 'testSet4', [featureRow])
  await featureSet.source().send([{value: '1'}])
}

/* eslint-disable-next-line @typescript-eslint/no-floating-promises */
main()
