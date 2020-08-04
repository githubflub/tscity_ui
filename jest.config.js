module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ["<rootDir>test/configure.ts"],
  transformIgnorePatterns: [`/node_modules/(?!@tscity)`],
};