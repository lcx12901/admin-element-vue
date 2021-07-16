const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    
    chainWebpack : (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('views', resolve('src/views'))
            .set('network', resolve('src/network'))
            .set('utils', resolve('src/utils'))
    },

    devServer: {
        // host: '192.168.0.145',
        open: true, //配置自动启动浏览器
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8888',
                changerOrigin: true, // 是否跨域

            }
        }
    }
}