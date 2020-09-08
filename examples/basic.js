const feast = require('../dist/src')

const main = async () => {
  // instantiate a Feast Client
  const feastClient = new feast.Client({ coreUrl: 'localhost:6565', servingUrl: 'localhost:6566' })

  // create a new Feast project
  try {
    await feastClient.createProject('example-project')
  } catch (error) {
    if (error.message.includes('Project already exists') === false) {
      throw error
    }
  }

  // create a new Feast FeatureSet
  const entity = feast.Entity.fromConfig('customerId', ValueType.STRING)
  const orderValue = feast.Feature.fromConfig('orderValueInUSDCents', ValueType.INT32)
  const ageOfCustomer = feast.Feature.fromConfig('ageOfCustomerInYears', ValueType.INT32)
  const featureSet = feast.FeatureSet.fromConfig('example-feature-set', {
    project: 'example-project',
    entities: [entity],
    features: [orderValue, ageOfCustomer]
  })

  // register the FeatureSet with Feast
  await feastClient.applyFeatureSet(featureSet)

  // create a feature row ...
  const featureRow = feast.FeatureRow.fromConfig({
    fields: {
      orderValueInUSDCents: 995,
      ageOfCustomerInYears: 30
    },
    eventTimestamp: Date.now(),
    featureSet: 'example-project/example-feature-set'
  })

  // ... and submit to the server
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const ingestionId = await feastClient.ingest([featureRow])
}

main()
