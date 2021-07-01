<template>
    <div class="header">
<!--        <div class="logo">-->
<!--            医疗</div>-->
        <div class="user">
            <div class="username">
                你好，{{ userInfo.realName }}！
            </div>
            <div class="user-img">
                <img :src="this.userInfo.avatar"/>
            </div>
            <el-col :span="12">
                <el-dropdown>
                <span class="el-dropdown-link">
                <i class="el-icon-user" style="color: white"></i>
                <i class="el-icon-arrow-down el-icon--right" style="color: white"></i>
                </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-user" @click.native="view = true">个人信息</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-close" @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </div>
        <!--        展示个人信息-->
        <el-drawer
            :visible.sync="view"
            :direction="direction"
            :before-close="handleClose"
            style="color: #333333">
            <div class="info-container">
                <div slot="header" class="clearfix">
                    <span>个人中心</span>
                </div>
                <div class="name-role">
                    <el-avatar :size="90" src="" @error="errorHandler">
                        <img :src="this.userInfo.avatar"/>
                    </el-avatar>
                    <span class="sender">姓名： {{ userInfo.realName }}</span>
                    <span class="sender">角色：  {{ role}}</span>
                    <span class="sender">科室：  {{ userInfo.department }}</span>
                    <span class="sender">职称：  {{ userInfo.title }}</span>
                </div>
                <el-divider></el-divider>
                <div class="Info">
                    <span class="sender">用户名： {{ userInfo.userName }}</span>
                    <span class="sender">性别：  {{ sex }}</span>
                    <span class="sender">手机号： {{ userInfo.phone }}</span>
                    <span class="sender">邮箱： {{ userInfo.email }}</span>
                </div>
            </div>
            <el-button size="small" style="width: 40%;margin-top: 100px;display: inline-block" @click.native="edit = true" type="primary">修改信息</el-button>
            <el-button size="small" style="width: 40%;margin-top: 20px;display: inline-block" @click.native="editPassword = true" type="primary">修改密码</el-button>
        </el-drawer>
        <!--        编辑个人信息-->
        <el-drawer
            title="修改信息"
            :visible.sync="edit"
            :direction="direction"
            :before-close="handleClose">
            <el-form :model="userForm" :rules="rules" label-width="80px" ref="userForm">
                <div class="item_bock head_p">
                    <div class="head_img">
                        <img :src="userForm.avatar"/>
                    </div>
                    <div class="setting_right" @click.stop="uploadHeadImg">
                        <div class="caption">更改头像</div>
                    </div>
                    <input type="file" accept="image/*" @change="handleFile" class="hiddenInput"/>
                </div>
                <el-form-item label="姓名" prop="realName">
                    <el-col :span="8">
                    <el-input v-model="userForm.realName" auto-complete="off"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-col :span="8">
                    <el-input v-model="userForm.userName" auto-complete="off"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-col :span="14">
                    <el-radio-group v-model="userForm.sex">
                        <el-radio class="radio" label="1">男</el-radio>
                        <el-radio class="radio" label="0">女</el-radio>
                    </el-radio-group>
                    </el-col>
                </el-form-item>
                <el-form-item label="职称" prop="title">
                    <el-col :span="14">
                    <el-select v-model="userForm.title" placeholder="请选择职称">
                        <el-option
                            v-for="item in title"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="科室" prop="department">
                    <el-col :span="14">
                    <el-select v-model="userForm.department" placeholder="请选择科室">
                        <el-option
                            v-for="item in department"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-col :span="14">
                    <el-input v-model="userForm.phone" auto-complete="off"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-col :span="14">
                    <el-input v-model="userForm.email" auto-complete="off"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="edit = false">返回</el-button>
                    <el-button type="primary" @click.native="editSubmit">提交</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
<!--        修改密码-->
        <el-drawer
            title="修改密码"
            :visible.sync="editPassword"
            :direction="direction"
            :before-close="handleClose">
            <el-form :model="editForm" :rules="rules1" label-width="80px" ref="editForm">
                <el-form-item label="邮箱" prop="email">
                    <el-col :span="14">
                    <el-input type="text" v-model="editForm.email" auto-complete="off" placeholder="请输入邮箱"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="验证码" prop="verifyNum">
                    <el-col :span="14">
                    <div class="iden">
                        <el-input type="text" v-model="editForm.verifyNum" style=""
                                  auto-complete="off"
                                  placeholder="请输入验证码"></el-input>
                        <el-button :style="{background:btnColor?'#2E9AFE':'#617079',color:'#FFF',width:'50%'}"
                                   v-on:click="sendSmsCode"
                                   class="verify-btn" v-model="btnContent"
                                   v-bind="{'disabled':disabled}">
                            {{ btnContent }}
                        </el-button>
                    </div>
                    </el-col>
                </el-form-item>
                <el-form-item label="密码"  prop="newPassword">
                    <el-col :span="14">
                        <el-input type="password" v-model="editForm.newPassword" placeholder="请输入密码"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPassword">
                    <el-col :span="14">
                        <el-input type="password" v-model="editForm.checkPassword" placeholder="再次输入密码"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="editPassword = false">返回</el-button>
                    <el-button type="primary" @click.native="verificationCode">提交</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<script>
import {editPwd, editUserInfo, requestLogin, requestMss, requestTitle} from '../../api/api'

export default {
    name: 'Header',
    data () {
        var checkEmail = (rule, value, cb) => {
            // 验证邮箱的正则表达式
            const regEmail = /^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}$/

            if (regEmail.test(value)) {
                // 合法的邮箱
                return cb()
            }

            cb(new Error('请输入合法的邮箱'))
        };
        var validatePass = (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入新密码"));
            } else if (value.toString().length < 6 || value.toString().length > 18) {
                callback(new Error("密码长度为6-18位"));
            } else {
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.editForm.newPassword) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            title: [],
            department:[],
            userInfo: {
                name: '',
                userName:'',
                avatar: '',
                sex: -1,
                title:'',
                phone: '',
                email: '',
                creatTime: '',
                roleId: -1
            },
            userForm: {
                name: '',
                userName:'',
                avatar: '',
                title:'',
                department:'',
                sex: -1,
                phone: '',
                email: '',
                creatTime: '',
                roleId: -1
            },
            rules: {
                name: [
                    {required: true, message: '请输入姓名', trigger: 'blur'}
                ],
                username: [
                    {required: true, message: '请输入姓名', trigger: 'blur'}
                ],
                avatar: [
                    {required: true, message: '请上传头像', trigger: 'blur'}
                ],
                sex: [
                    {required: true, message: '请选择性别', trigger: 'blur'}
                ],
                department: [
                    {required: true, message: '请选择科室', trigger: 'blur'}
                ],
                telphone: [
                    {required: true, message: '请输入手机号', trigger: 'blur'}
                ]
            },
            editForm:{
                verifyNum:"",
                email:"",
                newPassword:"",
                checkPassword:"",
            },
            rules1:{
                verifyNum: [{ required: true, message: "请输入验证码", trigger: "blur" }],
                email: [{ required: true, message: "请输入邮箱", trigger: "blur" },
                    { validator: checkEmail, trigger: 'blur' }],
                newPassword: [{ required: true, message: "请输入密码", trigger: "blur" },{ validator: validatePass, trigger: "blur" }],
                checkPassword: [{ required: true, message: "请再次输入密码", trigger: "blur" },{ validator: validatePass2, trigger: "blur" }],
            },
            btnContent: '获取验证码', //获取验证码按钮内文字
            time: 0, //发送验证码间隔时间
            disabled: false, //按钮状态
            btnColor: true,
            role:'',
            sex: '',
            edit: false,    //修改个人信息
            editPassword:false,
            view: false,     //展示个人信息
            direction: 'rtl',
        }
    },
    methods: {
        getTitle(){
            this.title=[]
            var param={typeCode:'title'}
            requestTitle(param).then(res => {
                console.log(res)
                let {msg, code,} = res
                if (code !== '200') {
                    this.$message.error(msg);
                } else if(code === '200'){
                    for(var i=0;i<res.data.length;i++){
                        var item={value:'',label:''}
                        item.label=res.data[i].name
                        item.value=res.data[i].name
                        this.title.push(item)
                    }
                }
            })
        },
        getDepartment(){
            this.department=[]
            var param={typeCode:'department'}
            requestTitle(param).then(res => {
                console.log(res)
                let {msg, code,} = res
                if (code !== '200') {
                    this.$message.error(msg);
                } else if(code === '200'){
                    for(var i=0;i<res.data.length;i++){
                        var item={value:'',label:''}
                        item.label=res.data[i].name
                        item.value=res.data[i].name
                        this.department.push(item)
                    }
                }
            })
        },
        logout: function () {
            var _this = this
            this.$confirm('确认退出吗?', '提示', {
                //type: 'warning'
            }).then(() => {
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                _this.$router.push('/login')
            }).catch(() => {

            })
        },
        // 获取验证码
        sendSmsCode () {
            this.time = 60
            this.btnColor = false
            this.timer()
            const phoneParams={mail: this.editForm.email}
            requestMss(phoneParams).then(res => {
                let {msg, code} = res;
                if (code === '200') {
                    this.$message.success(msg)
                } else if (code === '400') {
                    this.$message.error(msg);
                }
            });
        },
        timer () {
            if (this.time > 0) {
                this.time--
                this.btnContent = this.time + 's后重新获取'
                this.disabled = true
                var timer = setTimeout(this.timer, 1000)
            } else if (this.time == 0) {
                this.btnContent = '获取验证码'
                clearTimeout(timer)
                this.disabled = false
                this.btnColor = true
            }
        },
        // 修改密码
        verificationCode () {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    const regParams = {code:this.editForm.verifyNum,email:this.editForm.email,password:this.editForm.newPassword}
                    console.log(regParams)
                    editPwd(regParams).then(res => {
                        let {msg, code} = res
                        if (code !== '200') {
                            this.$message.error(msg);
                        } else if(code==='200'){
                            this.$message.success(msg)
                           this.$router.push('/login')
                            console.log('111')
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        editSubmit() {
            this.$refs.userForm.validate((valid) => {
                if (valid) {
                    this.logining = true
                    const editParams =this.userForm
                    editUserInfo(editParams).then(data => {
                        console.log(data)
                        this.logining = false
                        let {msg, code, user, token} = data
                        if (code !== '200') {
                            this.$message.error('修改失败')
                        } else if(code==='200'){
                            this.$message.success('修改成功')
                            console.log( this.userForm)
                            this.$store.commit('login', this.userForm);
                            this.formatSex(this.userForm)
                            this.edit=false
                        }
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        formatSex: function (user) {
            if (user.sex == 1) {
                this.sex = '男'
            } else if (user.sex == 0) {
                this.sex = '女'
            } else {
                this.sex = '未知'
            }
        },
        formatRoleId: function (user) {
            if (user.roleId === 1) {
                this.role = '教师'
            } else if (user.roleId === 2) {
                this.roleId = '学生'
            } else if(user.roleId === 0){
                this.role= '管理员'
            }
        },
        handleClose (done) {
            done()
        },
        // 打开图片上传
        uploadHeadImg: function () {
            this.$el.querySelector('.hiddenInput').click()
        },
        errorHandler () {
            return true
        },
        // 将头像显示
        handleFile: function (e) {
            let $target = e.target
            let file = $target.files[0]
            var reader = new FileReader()
            reader.onload = (data) => {
                let res = data.target
                this.userForm.avatar = res.result
                console.log(this.userForm.avatar)
                this.userInfo.avatar=this.userForm.avatar
                console.log(this.userInfo.avatar)
            }
            reader.readAsDataURL(file)
        }
    },
    mounted () {
        var user = localStorage.getItem('user')
        if (user) {
            user = JSON.parse(user)
            this.userInfo = user
            this.formatSex(user)
            this.formatRoleId(user)
            this.userForm = this.userInfo
        }
        this.getDepartment()
        this.getTitle()

    }
}
</script>
<style scoped>
.iden {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}
.item_bock {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 94px;
    width: 300px;
    padding: 0px 24px 0px 38px;
    border-bottom: 1px solid #f7f7f7;
    background: #fff;
}

.head_p {
    height: 132px;
}

.head_img {
    height: 90px;
}

.head_img img {
    width: 90px;
    height: 90px;
    border-radius: 50px
}

.setting_right {
    display: flex;
    height: 37px;
    justify-content: flex-end;
    align-items: center;
}

.hiddenInput {
    display: none;
}

.caption {
    color: #8F8F8F;
    font-size: 26px;
    height: 37px;
}

.header {
    margin: 0px;
    position: relative;
    width: 100%;
    height: 40px;
    background-color: #04315c;
    font-size: 30px;
    color: #fff;
}

.logo {
    float: left;
    width: 157px;
    text-align: center;
    line-height: 40px;
    background-color: #0a4b84;
    height: 40px;
}

.user {
    float: right;
    display: flex;
    height: 40px;
    width: 200px;
    align-items: center;
}

.username {
    color: #fff;
    font-size: 14px;
    white-space: nowrap; /*在同一行显示*/
}

.user-img img {
    display: block;
    width:30px;
    height: 30px;
    padding-right: 2px;
}

.el-dropdown-link {
    cursor: pointer;
    color: #505458;
}

.el-icon-arrow-down {
    font-size: 12px;
}

.name-role {
    font-size: 16px;
    margin-top: 20px;
    padding: 5px;
    text-align: center;
}

.name-role .sender {
    margin-top: 10px;
    text-align: center;
    display: block;
}

.personal-relation {
    font-size: 16px;
    padding: 0px 5px 15px;
    margin-right: 1px;
    width: 100%
}

/*relation-item {*/
/*    padding: 12px;*/

/*}*/
.Info{
    font-size: 16px;
    margin-top: 20px;
    padding: 5px;
    text-align: center;
}
.Info .sender{
    margin-top: 10px;
    text-align: center;
    display: block;
}
</style>
