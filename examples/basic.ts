import { Client, Entity, Feature, FeatureSet, ValueType } from '../src'

const main = async (): Promise<void> => {
  // instantiate a Feast Client
  const feastClient = new Client({ coreUrl: 'localhost:6565', servingUrl: 'localhost:6566' })
  // create a new Feast project
  try {
    await feastClient.createProject('example-project')
  } catch (error) {
    if (error.message.includes('Project already exists') === false) {
      throw error
    }
  }

  // create a new Feast FeatureSet
  const entity = Entity.fromConfig('customerId', ValueType.STRING)
  const orderValue = Feature.fromConfig('orderValueInUSDCents', ValueType.INT32)
  const ageOfCustomer = Feature.fromConfig('ageOfCustomerInYears', ValueType.INT32)
  const featureSet = FeatureSet.fromConfig('example-feature-set', {
    project: 'example-project',
    entities: [entity],
    features: [orderValue, ageOfCustomer]
  })

  // register the FeatureSet with Feast
  await feastClient.applyFeatureSet(featureSet)
}

/* eslint-disable-next-line @typescript-eslint/no-floating-promises */
main()
