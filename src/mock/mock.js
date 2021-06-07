import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {LoginUsers, Users, Teacher, Dictionary, Parameter} from './data/user'

let _Users = Users
let _Teacher = Teacher
let _Dictionary = Dictionary
let _Parameter = Parameter
export default {
    /**
     * mock bootstrap
     */
    bootstrap () {
        let mock = new MockAdapter(axios)

        // mock success request
        mock.onGet('/success').reply(200, {
            msg: 'success'
        })

        // mock error request
        mock.onGet('/error').reply(400, {
            msg: 'failure'
        })

        //登录
        mock.onPost('/login').reply(config => {
            let {username, password} = JSON.parse(config.data)
            return new Promise((resolve, reject) => {
                let user = null
                setTimeout(() => {
                    let hasUser = LoginUsers.some(u => {
                        if (u.username === username && u.password === password) {
                                user = JSON.parse(JSON.stringify(u))
                            user.password = undefined
                            return true
                        }
                    })

                    if (hasUser) {
                        console.log(user.username)
                        resolve([200, {code: 200, msg: '登录成功',token:'222',user}])
                    } else {
                        resolve([200, {code: 400, msg: '账号或密码错误'}])
                    }
                }, 1000)
            })
        })
        mock.onPost('/phoneLogin').reply(config => {
            let {phoneNum, verifyNum} = JSON.parse(config.data)
            return new Promise((resolve, reject) => {
                let user = null
                setTimeout(() => {
                    let hasUser = LoginUsers.some(u => {
                        if ('180' === phoneNum && '180' === verifyNum) {
                            // user = JSON.parse(JSON.stringify(u))
                            // user.password = undefined
                            return true
                        }
                    })

                    if (hasUser) {
                        resolve([200, {code: 200, msg: '登录成功',token:'222',user}])
                    } else {
                        resolve([200, {code: 400, msg: '账号或密码错误'}])
                    }
                }, 1000)
            })
        })

        //获取用户列表
        mock.onGet('/user/list').reply(config => {
            let {name} = config.params
            let mockUsers = _Users.filter(user => {
                if (name && user.name.indexOf(name) == -1) return false
                return true
            })
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        users: mockUsers
                    }])
                }, 1000)
            })
        })

        //获取用户列表（分页）
        mock.onGet('/user/listpage').reply(config => {
            console.log('ss')
            let {pagenum,pagesize,query} = config.params
            let mockUsers = _Users.filter(user => {
                if (query && user.name.indexOf(query) == -1) return false
                return true
            })
            let total = mockUsers.length
            mockUsers = mockUsers.filter((u, index) => index < pagesize * pagenum && index >= pagesize * (pagenum - 1))
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        users: mockUsers
                    }])
                }, 1000)
            })
        })

        //获取教师列表（分页）
        mock.onGet('/teacher/listpage').reply(config => {
            let {pagenum,pagesize,query} = config.params
            let mockUsers = _Teacher.filter(user => {
                if (query && user.name.indexOf(query) == -1) return false
                return true
            })
            let total = mockUsers.length
            mockUsers = mockUsers.filter((u, index) => index < pagesize * pagenum && index >= pagesize * (pagenum - 1))
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        users: mockUsers
                    }])
                }, 1000)
            })
        })
        //获取字典
        mock.onGet('/dictionary/listpage').reply(config => {
            let {page, name} = config.params
            let mockUsers = _Dictionary.filter(user => {
                if (name && user.name.indexOf(name) == -1) return false
                return true
            })
            let total = mockUsers.length
            mockUsers = mockUsers.filter((u, index) => index < 10 * page && index >= 10 * (page - 1))
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        users: mockUsers
                    }])
                }, 1000)
            })
        })
        //获取系统参数
        mock.onGet('/systemManage/listpage').reply(config => {
            let {pagenum,pagesize,query} = config.params
            let mockUsers = _Parameter.filter(user => {
                if (query && user.name.indexOf(query) == -1) return false
                return true
            })
            let total = mockUsers.length
            mockUsers = mockUsers.filter((u, index) => index < pagesize * pagenum && index >= pagesize * (pagenum - 1))
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        users: mockUsers
                    }])
                }, 1000)
            })
        })


        //删除用户
        mock.onGet('/user/remove').reply(config => {
            let {id} = config.params
            _Users = _Users.filter(u => u.id !== id)
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }])
                }, 500)
            })
        })

        //删除教师
        mock.onGet('/teacher/remove').reply(config => {
            let {id} = config.params
            _Teacher = _Teacher.filter(u => u.id !== id)
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }])
                }, 500)
            })
        })

        //批量删除用户
        mock.onGet('/user/batchremove').reply(config => {
            let {ids} = config.params
            ids = ids.split(',')
            _Users = _Users.filter(u => !ids.includes(u.id))
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }])
                }, 500)
            })
        })

        //批量删除教师
        mock.onGet('/teacher/batchremove').reply(config => {
            let {ids} = config.params
            ids = ids.split(',')
            _Teacher = _Teacher.filter(u => !ids.includes(u.id))
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }])
                }, 500)
            })
        })

        //编辑用户
        mock.onGet('/user/edit').reply(config => {
            console.log('sdsd')
            let {id,username, telphone, sex, email,loginType} = config.params
            console.log(config.params)
            _Users.some(u => {
                if (u.id === id) {
                    u.username = username
                    u.sex = sex
                    u.telphone = telphone
                    u.email = email
                    u.loginType = loginType
                    return true
                }
            })
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '编辑成功'
                    }])
                }, 500)
            })
        })
        //编辑教师
        mock.onGet('/teacher/edit').reply(config => {
            let {id,card,sex,mobile,email, name, course} = config.params
            _Teacher.some(u => {
                if (u.id === id) {
                    u.card=card
                    u.sex=sex
                    u.email=email
                    u.mobile=mobile
                    u.name = name
                    u.course = course
                    return true
                }
            })
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '编辑成功'
                    }])
                }, 500)
            })
        })

        //新增用户
        mock.onGet('/user/add').reply(config => {
            let {name, addr, age, birth, sex} = config.params
            _Users.push({
                name: name,
                addr: addr,
                age: age,
                birth: birth,
                sex: sex
            })
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '新增成功'
                    }])
                }, 500)
            })
        })

        //新增教师
        mock.onGet('/teacher/add').reply(config => {
            let {card,sex,mobile,email, name, course} = config.params
            _Teacher.push({
                sex:sex,
                mobile:mobile,
                email:email,
                card:card,
                name: name,
                course: course
            })
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '新增成功'
                    }])
                }, 500)
            })
        })

    }
}
