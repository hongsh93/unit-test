module.exports = {
    testMatch: ['**/*.spec.[jt]s?(x)', '**/*.test.[jt]s?(x)'],
    setupFilesAfterEnv: ['<rootDir>/tests/jest-setup.js'],
    verbose: true,
    testURL: "http://localhost/",

    // 일치하는 경로에서는 모듈을 가져오지 않습니다.
    // `<rootDir>` 토큰을 사용해 루트 경로를 참조할 수 있습니다.
    // TODO: 프로젝트에 맞는 경로로 수정하세요!
    modulePathIgnorePatterns: [
        '<rootDir>/node_modules'
    ],

    moduleFileExtensions: [
        "js",
        "ts",
        "json",
        // tell Jest to handle `*.vue` files
        "vue"
    ],

    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },

    // 정규식과 일치하는 파일의 변환 모듈을 지정합니다.
    transformIgnorePatterns: ['/node_modules/'],
    transform: {
        ".*\\.(vue)$": "vue-jest",
        "^.+\\.js?$": "babel-jest",
    },

    // Jest Snapshot 테스트에 필요한 모듈을 지정합니다.
    snapshotSerializers: [
        'jest-serializer-vue'
    ],

    preset: '@vue/cli-plugin-unit-jest'
}
