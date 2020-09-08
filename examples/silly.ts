import * as feast from '../src'

const main = async (): Promise<void> => {
  const coreClient = new feast.Client({ coreUrl: 'localhost:6565'})
  try {
    await coreClient.createProject('test')
  } catch (err) { }
  console.log('\nProjects:')
  const projectNames = await coreClient.listProjects()
  projectNames.forEach(projectName => console.log(`  - ${projectName}\n`))

  console.log('Stores:')
  const stores = await coreClient.listStores()
  stores.forEach(store => console.log(`  - ${store.name()} (${store.type()})\n`))

  console.log('Feature Sets:')
  const featureSets = await coreClient.listFeatureSets(projectNames[0])
  featureSets.forEach(featureSet => console.log(`  - ${featureSet.name()} (version: ${featureSet.version()})`))

  const entity = feast.Entity.fromConfig('customerId', feast.ValueType.STRING)
  const orderValue = feast.Feature.fromConfig('orderValueInUSDCents', feast.ValueType.INT32)
  const ageOfCustomer = feast.Feature.fromConfig('ageOfCustomerInYears', feast.ValueType.INT32)
  let featureSet = feast.FeatureSet.fromConfig('testSet4', {
    project: projectNames[0],
    entities: [entity],
    features: [orderValue, ageOfCustomer]
  })
  await coreClient.applyFeatureSet(featureSet)

  const featureRow = feast.FeatureRow.fromConfig({
    fields: {
      orderValueInUSDCents: 100,
      ageOfCustomerInYears: 23
    },
    eventTimestamp: 1,
    featureSet: 'test/testSet4'
  })
  const ingestionId = await coreClient.ingest([featureRow])
  console.log(`\nIngestion ID: ${ingestionId}`)
}

/* eslint-disable-next-line @typescript-eslint/no-floating-promises */
main()
