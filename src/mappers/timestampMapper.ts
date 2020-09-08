export const TimestampMapper = {

  /**
   * @param   timestamp - milliseconds since Jan 1st 1970
   */
  toGoogleProtobufTimestampObject (timestamp: number): any {
    return {
      seconds: Math.floor(timestamp / 1000),
      nanos: (timestamp % 1000) * 1000000
    }
  },

  toMilliseconds (timestampObject: any): number {
    if (typeof timestampObject.seconds !== 'number') {
      throw new Error('malformed timestampObject. Expected seconds to be a number')
    }
    const nanoSeconds = parseFloat(
      `${timestampObject.seconds as string}.${(timestampObject.nanos ?? 0) as string}`
    )
    return Math.floor(nanoSeconds * 1000)
  }
}
