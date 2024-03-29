module.exports = {
  roots: ["<rootDir>/src/test"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__test__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  verbose: true,
  collectCoverage: false,
  collectCoverageFrom: ["<rootDir>/src/app/**/*.ts"],
};
