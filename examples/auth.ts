import * as feast from '../src'

const main = async (): Promise<void> => {
  const coreClient = new feast.Client({ coreUrl: 'localhost:6565', coreSecure: true })
  try {
    await coreClient.createProject('test')
  } catch (err) {
    console.log(`WARNING: ${err.message as string}`)
  }
  console.log('\nProjects:')
  const projectNames = await coreClient.listProjects()
  projectNames.forEach(projectName => console.log(`  - ${projectName}\n`))
}

/* eslint-disable-next-line @typescript-eslint/no-floating-promises */
main()
