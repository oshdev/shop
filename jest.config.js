/** @type {import('@jest/types').Config.InitialOptions} */
const commonSettings = {
  roots: ['<rootDir>'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/dist/'],
  testEnvironment: 'jsdom',
}
module.exports = commonSettings
//
// const serverTestsPath = '^src\\/server\\/.+\\.spec\\.ts$'
// const clientTestsPath = '^src\\/client\\/.+\\.spec\\.tsx?$'
//
// /** @type {import('@jest/types').Config.InitialOptions} */
// const serverTests = {
//   ...commonSettings,
//   displayName: 'Server',
//   testRegex: serverTestsPath,
// }
//
// /** @type {import('@jest/types').Config.InitialOptions} */
// const clientTests = {
//   ...commonSettings,
//   displayName: 'Client',
//   testRegex: clientTestsPath,
//   testEnvironment: 'jsdom',
// }
//
ma// switch (process.env.TEST_MODE) {
//   case 'server':
//     module.exports = { ...commonSettings, projects: [serverTests] }
//     break
//   case 'client':
//     module.exports = { ...commonSettings, projects: [clientTests] }
//     break
//   default:
//     module.exports = { ...commonSettings, projects: [clientTests, serverTests] }
// }
