// 二次封装axios
import Vue from 'vue'
import axios from 'axios'
export const request = (options) => {
    const inst = axios.create({
        baseURL: 'api/private/v1'
    })

    // 请求拦截
    inst.interceptors.request.use(config => {
        config.headers.Authorization = sessionStorage.getItem('token')
        return config
    })

    // 响应拦截
    inst.interceptors.response.use(data => {
        const {data:result, meta} = data.data
        if (meta.status == 200) {
            meta.type = 'success'
        }
        if (meta.status == 400 || meta.status == 404 ) {
            meta.type = 'error'
        }
        Vue.prototype.$message({
            showClose: true,
            message: meta.msg,
            type: meta.type,
            center: true
        })
        return result
    })

    return inst(options)
}