module.exports = {
  apps: [
    {
      name: 'MX-EsiChat',
      script: './src/index.js',
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
