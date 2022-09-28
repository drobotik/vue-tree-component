module.exports = {
    moduleFileExtensions: [
        "js",
        "jsx",
        "json",
        "vue"
    ],
    transform: {
        "^.+\\.vue$": "vue-jest",
        ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
        "^.+\\.jsx?$": "babel-jest"
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    snapshotSerializers: ["jest-serializer-vue"],
    testMatch: [
        "**/specs/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)"
    ],
    testURL: "http://localhost/",
    collectCoverageFrom: [
        "<rootDir>/src/*.js",
    ],
    // testEnvironment: "node",
    transformIgnorePatterns: [
        "node_modules/(?!(babel-jest|jest-vue-preprocessor|vue)/)"
    ],
};