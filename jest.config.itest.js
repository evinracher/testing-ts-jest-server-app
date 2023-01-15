module.exports = {
  roots: ["<rootDir>/src/itest"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__test__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  verbose: true,
  testEnvironment: "node",
  // collectCoverage: false,
  // collectCoverageFrom: ["<rootDir>/src/app/**/*.ts"],
};
