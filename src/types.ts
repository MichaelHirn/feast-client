/**
 * Feature and Entity value type. Used to define data types in Feature Sets.
 *
 * @remarks
 *
 * To learn more: https://github.com/feast-dev/feast/blob/master/sdk/python/feast/value_type.py
 *
 * @public
 */
export enum ValueType {
  UNKNOWN = 0,
  BYTES = 1,
  STRING = 2,
  INT32 = 3,
  INT64 = 4,
  DOUBLE = 5,
  FLOAT = 6,
  BOOL = 7,
  BYTES_LIST = 11,
  STRING_LIST = 12,
  INT32_LIST = 13,
  INT64_LIST = 14,
  DOUBLE_LIST = 15,
  FLOAT_LIST = 16,
  BOOL_LIST = 17
}

export enum ApplyFeatureSetResponseStatus {
  // Latest feature set is consistent with provided feature set
  NO_CHANGE = 0,

  // New feature set created
  CREATED = 1,

  // Error occurred while trying to apply changes
  ERROR = 2,

  // Changes detected and updated successfully
  UPDATED = 3
}

export enum FeatureSetStatus {
  STATUS_INVALID = 0,

  // A feature set is in pending state if Feast has not spun up the jobs
  // necessary to push rows for this feature set to stores subscribing to this feature set.
  STATUS_PENDING = 1,

  // Feature set is ready for consumption or ingestion
  STATUS_READY = 2,

  STATUS_JOB_STARTING = 3
}

export enum StoreType {
  INVALID = 0,

  // Redis stores a FeatureRow element as a key, value pair.
  //
  // The Redis data types used (https://redis.io/topics/data-types):
  // - key: STRING
  // - value: STRING
  //
  // Encodings:
  // - key: byte array of RedisKey (refer to feast.storage.RedisKey)
  // - value: byte array of FeatureRow (refer to feast.types.FeatureRow)
  //
  REDIS = 1,

  // BigQuery stores a FeatureRow element as a row in a BigQuery table.
  //
  // Table name is derived is the same as the feature set name.
  //
  // The entities and features in a FeatureSetSpec corresponds to the
  // fields in the BigQuery table (these make up the BigQuery schema).
  // The name of the entity spec and feature spec corresponds to the column
  // names, and the value_type of entity spec and feature spec corresponds
  // to BigQuery standard SQL data type of the column.
  //
  // The following BigQuery fields are reserved for Feast internal use.
  // Ingestion of entity or feature spec with names identical
  // to the following field names will raise an exception during ingestion.
  //
  //   column_name       | column_data_type | description
  // ====================|==================|================================
  // - event_timestamp   | TIMESTAMP        | event time of the FeatureRow
  // - created_timestamp | TIMESTAMP        | processing time of the ingestion of the FeatureRow
  // - ingestion_id      | STRING           | unique id identifying groups of rows that have been ingested together
  // - job_id            | STRING           | identifier for the job that writes the FeatureRow to the corresponding BigQuery table
  //
  // BigQuery table created will be partitioned by the field "event_timestamp"
  // of the FeatureRow (https://cloud.google.com/bigquery/docs/partitioned-tables).
  //
  // The following table shows how ValueType in Feast is mapped to
  // BigQuery Standard SQL data types
  // (https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types):
  //
  // BYTES       : BYTES
  // STRING      : STRING
  // INT32       : INT64
  // INT64       : IN64
  // DOUBLE      : FLOAT64
  // FLOAT       : FLOAT64
  // BOOL        : BOOL
  // BYTES_LIST  : ARRAY
  // STRING_LIST : ARRAY
  // INT32_LIST  : ARRAY
  // INT64_LIST  : ARRAY
  // DOUBLE_LIST : ARRAY
  // FLOAT_LIST  : ARRAY
  // BOOL_LIST   : ARRAY
  //
  // The column mode in BigQuery is set to "Nullable" such that unset Value
  // in a FeatureRow corresponds to NULL value in BigQuery.
  BIGQUERY = 2,

  // Unsupported in Feast 0.3
  CASSANDRA = 3,

  REDIS_CLUSTER = 4
}

export enum UpdateStoreStatus {

  // Existing store config matching the given store id is identical to the given store config.
  NO_CHANGE = 0,

  // New store created or existing config updated.
  UPDATED = 1
}
