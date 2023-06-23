const { defineConfig } = require('@vue/cli-service')
module.exports = {
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://pro-api.coinmarketcap.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/v1/cryptocurrency/listings/latest'
        },
        headers: {
          'X-CMC_PRO_API_KEY': 'dc735c28-dcdc-402e-a7eb-f64d6fce85c1'
        }
      }
    }
  }
};
