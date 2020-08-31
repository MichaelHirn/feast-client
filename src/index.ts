export class Test {
  name: string

  constructor (name) {
    this.name = name
  }

  hello (): string {
    return `Hello ${this.name}`
  }
}
