/* eslint-disable-next-line max-classes-per-file */
import { KafkaSource } from './sources/kafkaSource'
import { SourceAbstract } from './sourceAbstract'

export const Source = {
  fromFeast (response: any): SourceAbstract<any> {
    switch (response.type) {
      case 0: throw new Error('invalid source')
      case 1: return KafkaSource.fromFeast(response)
      default: throw new Error(`invalid response type: ${response.type as string}`)
    }
  }
}
