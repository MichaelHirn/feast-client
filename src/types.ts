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
