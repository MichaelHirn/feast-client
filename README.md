# Feast Client SDK (Node.js)

This is a client for the Feature Store [Feast][feast_github], written in TypeScript.

It stays close to the [Python SDK][feast_python_sdk], but diverges from it in a few ways - see more on that below.

## Install

```bash
npm install feast-client --save
```

## Usage

### TypeScript

```typescript
import * as feast from 'feast-client'

// instantiate a Feast Client
const feastClient = new feast.Client({ coreUrl: 'localhost:6565', servingUrl: 'localhost:6566' })

// create a new Feast project
await feastClient.createProject('example-project')

  // create a new Feast FeatureSet
const entity = feast.Entity.fromConfig('customerId', feast.ValueType.STRING)
const orderValue = feast.Feature.fromConfig('orderValueInUSDCents', feast.ValueType.INT32)
const ageOfCustomer = feast.Feature.fromConfig('ageOfCustomerInYears', feast.ValueType.INT32)
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
const ingestionId = await feastClient.ingest([featureRow])
```

### JavaScript

```javascript
const feast = require('feast-client')

// instantiate a Feast Client
const feastClient = new feast.Client({ coreUrl: 'localhost:6565', servingUrl: 'localhost:6566' })

// create a new Feast project
await feastClient.createProject('example-project')

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
const ingestionId = await feastClient.ingest([featureRow])
```

For more see the [examples](./examples) directory.

## Notes on differences between the Python SDK and Node.js SDK

- `client.apply` - due to `apply` being an inherited function for all Objects in JS, `client.apply` is `client.applyFeatureSet` for this SDK. To apply (i.e. create or update) multiple feature sets at once use `applyFeatureSets`.
- `new FeatureSet (also Entity and Feature)` - there are two common flows for instantiating a feature set - manually instantiating it (when it is not yet registered with Feast) and receiving a feature set that is registered with Feast. To support each flow conveniently, there are two constructor methods `FeatureSet.fromConfig` and `FeatureSet.fromFeast` - the constructor (i.e. `new FeatureSet`) is set to `private` and can not be called directly. The same applies to `Entity` and `Feature`.

[feast_github]: https://github.com/feast-dev/feast
[feast_python_sdk]: https://github.com/feast-dev/feast/tree/master/sdk/python

## ToDo

- Implement Authentication and Authorization features
- Implement support for tags (aka. labels)
- Implement `Statistics` features
