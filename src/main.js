// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/index'
import http from './store/http';  //此处问http文件的路径
import Mock from './mock'

Vue.config.productionTip = false

Vue.prototype.$http = http;

Mock.bootstrap()            //模拟数据测试

Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (localStorage.token) {  // 获取当前的token是否存在
            console.log("token存在");
            next();
        } else {
            console.log("token不存在");
            next({
                path: '/login', // 将跳转的路由path作为参数，登录成功后跳转到该路由
                query: {redirect: to.fullPath}
            })
        }
    }
    else { // 如果不需要权限校验，直接进入路由界面
        next();
    }
})
/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(App),
    store,
    router,
    components: {App},
    template: '<App/>'
})
