import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import LoginHome from '../components/LoginHome'
import ForgetPassword from '../components/layout/ForgetPassword'
import Login from '../components/layout/Login'
import CheckPhone from '../components/page/CheckPhone'
import Register from '../components/layout/Register'
import Manage from '../components/page/Manage'
import StudentManage from '../components/page/StudentManage'
import TeacherManage from '../components/page/TeacherManage'
import error from '../components/page/404'
import Dictionary from '../components/page/Dictionary'
import UserInformation from '../components/page/UserInformation'
import UserManage from '../components/page/UserManage'
import SystemManage from '../components/page/SystemManage'
import CourseManage from '../components/page/CourseManage'
import PhoneLogin from '../components/page/PhoneLogin'
import Test from '../components/page/Test'
import RoleManage from '../components/page/RoleManage'
import AddDictionary from '../components/page/AddDictionary'

Vue.use(Router)

export default new Router({
    mode: 'history', // 去除#路由，即hash
    routes: [
        {
            path: '/',
            name: 'Login',
            redirect: '/login'
        },
        {
            // home页面并不需要被访问，只是作为其它组件的父组件
            path: '/home',
            name: 'Home',
            component: Home,
            redirect: '/manage',
            children: [
                {
                    path: '/manage',
                    name: 'Manage',
                    component: Manage,
                    meta: {
                        title:'系统首页',
                        hideclose:true,
                        requireAuth: true
                    }
                },
                {
                    path: '/studentmanage',
                    name: 'StudentManage',
                    component: StudentManage,
                    meta: {
                        title:'学生管理',
                        requireAuth: true
                    }
                },
                {
                    path: '/teachermanage',
                    name: 'TeacherManage',
                    component: TeacherManage,
                    meta: {
                        title:'教师管理',
                        requireAuth: true
                    }
                },
                {
                    path: '/courseManage',
                    name: 'courseManage',
                    component: CourseManage,
                    meta: {
                        title:'课程管理',
                        requireAuth: true
                    }
                },
                {
                    path: '/dictionary',
                    name: 'Dictionary',
                    component: Dictionary,
                    meta: {
                        title:'数据字典',
                        requireAuth: true
                    }
                },
                {
                    path: '/addDictionary',
                    name: 'AddDictionary',
                    component: AddDictionary,
                    meta: {
                        title:'数据字典',
                        requireAuth: true
                    }
                },
                {
                    path: '/userManage',
                    name: 'UserManage',
                    component: UserManage,
                    meta: {
                        title:'用户管理',
                        requireAuth: true
                    }
                },
                {
                    path: '/systemManage',
                    name: 'systemManage',
                    component: SystemManage,
                    meta: {
                        title:'系统参数管理',
                        requireAuth: true
                    }
                },
                {
                    path: '/userInformation',
                    name: 'UserInformation',
                    component: UserInformation,
                    meta: {
                        title:'个人信息',
                        requireAuth: true
                    }
                },
                {
                    path: '/roleManage',
                    name: 'RoleManage',
                    component: RoleManage,
                    meta: {
                        title:'角色管理',
                        requireAuth: true
                    }
                },
                {
                    path: '/test',
                    name: 'Test',
                    component: Test,
                    meta: {
                        title:'测试页面',
                        requireAuth: true
                    }
                },
                {
                    path: '/500',
                    name: '500',
                    component: () =>
                        import (  '../components/page/500.vue'),
                    meta:{
                        title:'服务异常'
                    }
                },
                {
                    path: '/403',
                    name: '403',
                    component: () =>
                        import (  '../components/page/403.vue'),
                    meta:{
                        title:'服务异常'
                    }
                },
                {
                    path: '/404',
                    name: '404',
                    component: error,
                    meta:{
                        title:'页面走丢了'
                    }
                }
            ]
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginHome,
            children: [
                {
                    path: '/login',
                    name: 'Login',
                    component: Login
                },
                {
                    path: '/forgetpassword',
                    name: 'ForgetPassword',
                    component: ForgetPassword
                },
                {
                    path: '/checkphone',
                    name: 'CheckPhone',
                    component: CheckPhone
                },
                {
                    path: '/register',
                    name: 'Register',
                    component: Register
                },
                {
                    path: '/phoneLogin',
                    name: 'PhoneLogin',
                    component: PhoneLogin
                }
            ]
        },
        {
            path: '*',
            name: '404',
            component: error,
            meta:{
                title:'页面走丢了'
            }
        }
    ]
})
