module.exports = {
    extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
    plugins: ['react', 'prettier'],
    rules: {
      'prettier/prettier': 'error',
      // Add your project-specific ESLint rules here
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };