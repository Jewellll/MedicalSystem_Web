import axios from 'axios'
import router from '../router/index'
import {Message} from 'element-ui'


axios.defaults.timeout = 5000; // 超时时间
axios.defaults.baseURL = 'http://192.168.43.242:8443/api'
// axios.defaults.baseURL = 'http://172.20.10.11:8443/api'
// axios.defaults.baseURL = 'http://localhost:8443/api'
// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (localStorage.token) { //判断token是否存在
            config.headers.Authorization = localStorage.token;  //将token设置成请求头
        }
        return config;
    },
    err => {
        router.push({path: "/NotFound"});
        return Promise.reject(err);
    }
);

// http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.code === 999) {
            this.$router.push({path:'/login'})
            console.log("token过期");
        }
        return response;
    },
    error => {
        // // 对响应错误做点什么
        // if (error.response) {
        //     switch (error.response.data.code) {
        //         case 404:
        //             router.push({path: "/NotFound1"});
        //             break;
        //         case 500:
        //             router.push({path: "/NotFound2"});
        //             break;
        //         case 503:
        //             router.push({path: "/NotFound3"});
        //             break;
        //     }
        // } else {
        //     router.push({path: "/NotFound"});
        // }
        return Promise.reject(error);
    }
);
export default axios;

