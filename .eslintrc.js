module.exports = {
    env: {
        es6: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
    parserOptions: {
        ecmaVersion: 2018,
    },
    rules: {},
    plugins: ['prettier'],
}
