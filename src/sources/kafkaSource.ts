import { Kafka } from 'kafkajs'
import { SourceAbstract } from '../sourceAbstract'
import { SourceType } from '../types'

export interface IKafkaSourceConfig {

  // Comma separated list of Kafka bootstrap servers. Used for feature sets without a defined source host[:port]]
  brokers: string[]

  // Kafka topic to use for feature sets without user defined topics
  topic: string

  // Number of Kafka partitions to to use for managed feature stream.
  partitions: number

  // Defines the number of copies of managed feature stream Kafka.
  replicationFactor: number
}

export class KafkaSource extends SourceAbstract<IKafkaSourceConfig> {
  protected _kafkaClient: Kafka

  public brokers (): string[] {
    return this.props.config.brokers
  }

  public topic (): string {
    return this.props.config.topic
  }

  public kafkaClient (): Kafka {
    if (typeof this._kafkaClient === 'undefined') {
      this._kafkaClient = new Kafka({
        brokers: this.brokers()
      })
    }
    return this._kafkaClient
  }

  public async send (messages: any[]): Promise<void> {
    const producer = this.kafkaClient().producer()
    await producer.connect()
    await producer.send({
      topic: this.topic(),
      messages
    })
  }

  public static fromFeast (response: any): KafkaSource {
    response.type = SourceType[response.type] as unknown as SourceType
    response.config = response.kafkaSourceConfig
    response.config.brokers = response.config.bootstrapServers.split(',')
    return new KafkaSource(response)
  }
}
