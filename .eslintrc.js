module.exports = {
  extends: [
    'eslint-config-crazymax',
    'eslint-config-crazymax/typescript',
    'eslint-config-crazymax/jest',
  ],
  rules: {
    'no-console': 'off',
    'linebreak-style': 0,
    "prettier/prettier": 'off'
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
