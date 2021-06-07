<template>
    <div class="container">
        <!-- 面包屑导航区域 -->
        <div class="crumb">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 5px">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统参数管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- 卡片视图区域 -->
        <div class="table">
            <!-- 搜索与添加区域 -->
            <div class="toolbar">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList()">
                            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" @click="addFormVisible=true">添加参数</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="userList" :stripe="true" :border="true" v-loading="listLoading"
                      @selection-change="selsChange"
                      :header-cell-style="{background:'#F5F6FA',color:'#666E92'}">
                <el-table-column type="selection" ></el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="parameter" label="系统参数名" ></el-table-column>
                <el-table-column prop="value" label="系统参数值" ></el-table-column>
                <el-table-column prop="remark" label="备注" ></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="handleEdit(scope.$index, scope.row)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="handleDel(scope.$index, scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <div class="page">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 添加用户的对话框 -->
        <el-dialog
            title="添加教师"
            :visible.sync="addFormVisible"
            width="40%"
            @close="addDialogClosed">
            <!-- 内容的主体区域 -->
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
                <el-form-item label="系统参数名" prop="parameter">
                    <el-col :span="8">
                        <el-input v-model="addForm.parameter" auto-complete="off"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="系统参数值" prop="value">
                    <el-col :span="8">
                        <el-input v-model="addForm.value" auto-complete="off"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-col :span="14">
                        <el-input v-model="addForm.remark" auto-complete="off"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取 消</el-button>
                <el-button type="primary" :loading="addLoading" @click.native="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑" width="40%" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                <el-form-item label="系统参数名" prop="parameter">
                    <el-col :span="8">
                        <el-input v-model="editForm.parameter" auto-complete="off"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="系统参数值" prop="value">
                    <el-col :span="8">
                        <el-input v-model="editForm.value"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-col :span="14">
                        <el-input v-model="editForm.remark" auto-complete="off"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    addTeacher,
    batchRemoveTeacher,
    editTeacher, getParaListPage,
    getTeacherListPage,
    removeTeacher
} from '../../api/api'

export default {
    data () {
        // 验证邮箱的校验规则
        var checkEmail = (rule, value, callback) => {
            // 验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                // 验证通过，合法的邮箱
                return callback()
            }
            // 验证不通过，不合法
            callback(new Error('请输入合法的邮箱'))
        }
        // 验证手机号的验证规则
        var checkMobile = (rule, value, callback) => {
            // 验证手机号的正则表达式
            const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
            if (regMobile.test(value)) {
                // 验证通过，合法的手机号
                return callback()
            }
            // 验证不通过，不合法
            callback(new Error('请输入合法的手机号'))
        }
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                // 查询参数
                query: '',
                // 当前的页码数
                pagenum: 1,
                // 每页显示多少条数据
                pagesize: 5
            },
            // 获取的用户列表
            userList: [],
            sels: [],//列表选中列
            // 总数
            total: 0,
            //列表加载
            listLoading: false,
            // 控制添加用户对话框的显示与隐藏，默认为隐藏
            addFormVisible: false,
            addLoading: false,
            // 添加用户的表单数据
            addForm: {
                parameter: '',
                value: '',
                remark: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                parameter: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                ],
                value: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                ]
            },
            //编辑
            editLoading: false,
            editFormVisible: false,
            editForm: {
                parameter: '',
                value: '0',
                remark: ''
            },
            editFormRules: {
                parameter: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                ],
                value: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                ]
            },
        }
    },
    created () {
        this.getUserList()
    },
    methods: {
        //性别显示转换
        formatSex: function (row, column) {
            return row.sex == 1 ? '男' : row.sex == 2 ? '女' : '未知'
        },
        async getUserList () {
            this.listLoading = true
            getParaListPage(this.queryInfo).then((res) => {
                console.log(res)
                this.total = res.data.total
                this.userList = res.data.users
                this.listLoading = false
            })
        },
        // 监听 pageSize 改变的事件
        handleSizeChange (newSize) {
            //   console.log(newSize)
            //  将监听接受到的每页显示多少条的数据 newSzie 赋值给 pagesize
            this.queryInfo.pagesize = newSize
            //  修改完以后，重新发起请求获取一次数据
            this.getUserList()
        },
        // 监听 页码值  改变的事件
        handleCurrentChange (newPage) {
            //   console.log(newPage)
            //  将监听接受到的页码值的数据 newPage 赋值给 pagenum
            this.queryInfo.pagenum = newPage
            //  修改完以后，重新发起请求获取一次数据
            this.getUserList()
        },
        // 监听 switch 开关状态的改变
        async userStateChange (userInfo) {
            console.log(userInfo)
            const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            if (res.meta.status !== 200) {
                // 更新失败，将状态返回初始状态
                this.userInfo.mg_state = !this.userInfo.mg_state
                this.$message.error('更新用户状态失败！')
            }
            this.$message.success('更新用户状态成功！')
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed () {
            this.$refs.addFormRef.resetFields()
            this.$refs.editForm.resetFields()
        },
        // 点击按钮，添加新用户
        addUser () {
            this.$refs.addFormRef.validate(async valid => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true
                        let para = Object.assign({}, this.addForm)
                        addTeacher(para).then((res) => {
                            if (res.data.code == 200) {
                                this.addLoading = false
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                })
                                this.addFormVisible = false
                                this.getUserList()
                            }
                        })
                    })
                }
            })
        },
        //显示编辑
        handleEdit: function (index, row) {
            this.editFormVisible = true
            this.editForm = Object.assign({}, row)
        },
        //编辑提交
        editSubmit: function () {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true
                        let para = Object.assign({}, this.editForm)
                        editTeacher(para).then((res) => {
                            if (res.data.code == 200) {
                                this.editLoading = false
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                })
                                this.editFormVisible = false
                                this.getUserList()
                            }
                        })
                    })
                }
            })
        },
        //删除
        handleDel: function (index, row) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true
                let para = {id: row.id}
                removeTeacher(para).then((res) => {
                    if (res.data.code == 200) {
                        this.listLoading = false
                        //NProgress.done();
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        })
                        this.getUserList()
                    }
                })
            }).catch(() => {

            })
        },
        //选择多行
        selsChange: function (sels) {
            this.sels = sels
        },
        //批量删除
        batchRemove: function () {
            var ids = this.sels.map(item => item.id).toString()
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true
                let para = {ids: ids}
                batchRemoveTeacher(para).then((res) => {
                    if (res.data.code == 200) {
                        this.listLoading = false
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.getUserList()
                    }
                })
            }).catch(() => {

            })
        }
    }
}
</script>

<style scoped>

.container {
    margin-top: 8px;
    margin-left: 10px;
    margin-right: 10px;
    padding: 10px 10px;
    background-color: #FFFFFF;
    height: 100vh;
    border-radius: 5px;
}

.crumb {
    margin-left: 2px;
}

.table {
    margin-top: 20px;
}

.toolbar {
    margin-bottom: 10px;
}

.page {
    margin-top: 10px;
}
</style>

<!--<template>-->
<!--    <div class="container">-->
<!--        <section>-->
<!--            &lt;!&ndash;工具条&ndash;&gt;-->
<!--            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-bottom: 10px">-->
<!--                <el-form :inline="true" :model="filters">-->
<!--                    <el-form-item>-->
<!--                        <el-input v-model="filters.name" placeholder="参数名"></el-input>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item>-->
<!--                        <el-button type="primary" v-on:click="getUsers">查询参数</el-button>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item>-->
<!--                        <el-button type="primary" @click="handleAdd">新增参数</el-button>-->
<!--                    </el-form-item>-->
<!--                </el-form>-->
<!--            </el-col>-->

<!--            &lt;!&ndash;列表&ndash;&gt;-->
<!--            <el-table :data="users" :header-cell-style="{background:'#F5F6FA',color:'#666E92'}"-->
<!--                      :row-style="{height:'25px'}" :cell-style="{padding:'1px'}"-->
<!--                      highlight-current-row v-loading="listLoading" @selection-change="selsChange" class="table">-->
<!--                <el-table-column type="selection" width="55">-->
<!--                </el-table-column>-->
<!--                <el-table-column type="index" width="60">-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="parameter" label="系统参数名" width="300" >-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="value" label="系统参数值" width="300" >-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="remark" label="备注" width="300" >-->
<!--                </el-table-column>-->
<!--                <el-table-column label="操作" width="150">-->
<!--                    <template scope="scope">-->
<!--                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
<!--                        <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--            </el-table>-->

<!--            &lt;!&ndash;工具条&ndash;&gt;-->
<!--            <el-col :span="24" class="toolbar2">-->
<!--                <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0"-->
<!--                           style="position: relative;left: -450px ">批量删除-->
<!--                </el-button>-->
<!--                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="6"-->
<!--                               :total="total" style="float:right;">-->
<!--                </el-pagination>-->
<!--            </el-col>-->

<!--            &lt;!&ndash;编辑界面&ndash;&gt;-->
<!--            <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">-->
<!--                <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">-->
<!--                    <el-form-item label="系统参数名" prop="parameter">-->
<!--                        <el-input v-model="editForm.parameter" auto-complete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="系统参数值" prop="value">-->
<!--                        <el-input v-model="editForm.value" auto-complete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="备注" prop="remark">-->
<!--                        <el-input v-model="editForm.remark" auto-complete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-form>-->
<!--                <div slot="footer" class="dialog-footer">-->
<!--                    <el-button @click.native="editFormVisible = false">取消</el-button>-->
<!--                    <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>-->
<!--                </div>-->
<!--            </el-dialog>-->

<!--            &lt;!&ndash;新增界面&ndash;&gt;-->
<!--            <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">-->
<!--                <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">-->
<!--                    <el-form-item label="系统参数名" prop="parameter">-->
<!--                        <el-input v-model="addForm.parameter" auto-complete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="系统参数值" prop="value">-->
<!--                        <el-input v-model="addForm.value" auto-complete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="备注" prop="remark">-->
<!--                        <el-input v-model="addForm.remark" auto-complete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                </el-form>-->
<!--                <div slot="footer" class="dialog-footer">-->
<!--                    <el-button @click.native="addFormVisible = false">取消</el-button>-->
<!--                    <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>-->
<!--                </div>-->
<!--            </el-dialog>-->
<!--        </section>-->
<!--    </div>-->
<!--</template>-->

<!--<script>-->
<!--import {-->
<!--    addPara,-->
<!--    batchRemovePara,-->
<!--    editPara,-->
<!--    getParaListPage,-->
<!--    removePara-->
<!--} from '../../api/api'-->

<!--export default {-->
<!--    data () {-->
<!--        return {-->
<!--            filters: {-->
<!--                name: ''                           //需要查询的名字-->
<!--            },-->
<!--            users: [],-->
<!--            total: 0,-->
<!--            page: 1,-->
<!--            listLoading: false,-->
<!--            sels: [],//列表选中列-->

<!--            editFormVisible: false,//编辑界面是否显示-->
<!--            editLoading: false,-->
<!--            editFormRules: {-->
<!--                name: [-->
<!--                    {required: true, message: '请输入姓名', trigger: 'blur'}-->
<!--                ]-->
<!--            },-->
<!--            //编辑界面数据-->
<!--            editForm: {-->
<!--                id: 0,-->
<!--                name: '',-->
<!--                sex: -1,-->
<!--                age: 0,-->
<!--                birth: '',-->
<!--                addr: ''-->
<!--            },-->

<!--            addFormVisible: false,//新增界面是否显示-->
<!--            addLoading: false,-->
<!--            addFormRules: {-->
<!--                name: [-->
<!--                    {required: true, message: '请输入姓名', trigger: 'blur'}-->
<!--                ]-->
<!--            },-->
<!--            //新增界面数据-->
<!--            addForm: {-->
<!--                name: '',-->
<!--                sex: -1,-->
<!--                age: 0,-->
<!--                birth: '',-->
<!--                addr: ''-->
<!--            }-->

<!--        }-->
<!--    },-->
<!--    methods: {-->
<!--        //翻页-->
<!--        handleCurrentChange (val) {-->
<!--            this.page = val-->
<!--            this.getUsers()-->
<!--        },-->
<!--        //获取用户列表-->
<!--        getUsers () {-->
<!--            let para = {-->
<!--                page: this.page,-->
<!--                name: this.filters.name-->
<!--            }-->
<!--            this.listLoading = true-->
<!--            getParaListPage(para).then((res) => {-->
<!--                this.total = res.data.total-->
<!--                this.users = res.data.users-->
<!--                this.listLoading = false-->
<!--                //NProgress.done();-->
<!--            })-->
<!--        },-->
<!--        //删除-->
<!--        handleDel: function (index, row) {-->
<!--            this.$confirm('确认删除该记录吗?', '提示', {-->
<!--                type: 'warning'-->
<!--            }).then(() => {-->
<!--                this.listLoading = true-->
<!--                let para = {id: row.id}-->
<!--                removePara(para).then((res) => {-->
<!--                    this.listLoading = false-->
<!--                    //NProgress.done();-->
<!--                    this.$message({-->
<!--                        message: '删除成功',-->
<!--                        type: 'success'-->
<!--                    })-->
<!--                    this.getUsers()-->
<!--                })-->
<!--            }).catch(() => {-->

<!--            })-->
<!--        },-->
<!--        //显示编辑界面-->
<!--        handleEdit: function (index, row) {-->
<!--            this.editFormVisible = true-->
<!--            this.editForm = Object.assign({}, row)-->
<!--        },-->
<!--        //显示新增界面-->
<!--        handleAdd: function () {-->
<!--            this.addFormVisible = true-->
<!--            this.addForm = {-->
<!--                name: '',-->
<!--                sex: -1,-->
<!--                age: 0,-->
<!--                birth: '',-->
<!--                addr: ''-->
<!--            }-->
<!--        },-->
<!--        //编辑-->
<!--        editSubmit: function () {-->
<!--            this.$refs.editForm.validate((valid) => {-->
<!--                if (valid) {-->
<!--                    this.$confirm('确认提交吗？', '提示', {}).then(() => {-->
<!--                        this.editLoading = true-->
<!--                        //NProgress.start();-->
<!--                        let para = Object.assign({}, this.editForm)-->
<!--                        editPara(para).then((res) => {-->
<!--                            this.editLoading = false-->
<!--                            //NProgress.done();-->
<!--                            this.$message({-->
<!--                                message: '编辑成功',-->
<!--                                type: 'success'-->
<!--                            })-->
<!--                            this.$refs['editForm'].resetFields()-->
<!--                            this.editFormVisible = false-->
<!--                            this.getUsers()-->
<!--                        })-->
<!--                    })-->
<!--                }-->
<!--            })-->
<!--        },-->
<!--        //新增-->
<!--        addSubmit: function () {-->
<!--            this.$refs.addForm.validate((valid) => {-->
<!--                if (valid) {-->
<!--                    this.$confirm('确认提交吗？', '提示', {}).then(() => {-->
<!--                        this.addLoading = true-->
<!--                        let para = Object.assign({}, this.addForm)-->
<!--                        para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd')-->
<!--                        addPara(para).then((res) => {-->
<!--                            this.addLoading = false-->
<!--                            this.$message({-->
<!--                                message: '新增成功',-->
<!--                                type: 'success'-->
<!--                            })-->
<!--                            this.$refs['addForm'].resetFields()-->
<!--                            this.addFormVisible = false-->
<!--                            this.getUsers()-->
<!--                        })-->
<!--                    })-->
<!--                }-->
<!--            })-->
<!--        },-->
<!--        selsChange: function (sels) {-->
<!--            this.sels = sels-->
<!--        },-->
<!--        //批量删除-->
<!--        batchRemove: function () {-->
<!--            var ids = this.sels.map(item => item.id).toString()-->
<!--            this.$confirm('确认删除选中记录吗？', '提示', {-->
<!--                type: 'warning'-->
<!--            }).then(() => {-->
<!--                this.listLoading = true-->
<!--                let para = {ids: ids}-->
<!--                batchRemovePara(para).then((res) => {-->
<!--                    this.listLoading = false-->
<!--                    //NProgress.done();-->
<!--                    this.$message({-->
<!--                        message: '删除成功',-->
<!--                        type: 'success'-->
<!--                    })-->
<!--                    this.getUsers()-->
<!--                })-->
<!--            }).catch(() => {-->

<!--            })-->
<!--        }-->
<!--    },-->
<!--    mounted () {-->
<!--        this.getUsers()-->
<!--    }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.container {-->
<!--    margin-top: 8px;-->
<!--    margin-left: 10px;-->
<!--    margin-right: 10px;-->
<!--    padding: 10px 10px;-->
<!--    background-color: #FFFFFF;-->
<!--    height: 100vh;-->
<!--    border-radius: 5px;-->
<!--}-->

<!--.toolbar {-->
<!--    width: 100%;-->
<!--    background-color: #f1f1f1;-->
<!--    margin-right: 10px;-->
<!--    padding-top: 10px;-->
<!--    padding-left: 0px;-->
<!--    height: 60px;-->
<!--}-->

<!--.toolbar2 {-->
<!--    width: 100%;-->
<!--    margin-top: 10px;-->
<!--    background-color: #f1f1f1;-->
<!--    margin-right: 10px;-->
<!--    padding-top: 10px;-->
<!--    padding-left: 0px;-->
<!--    height: 60px;-->
<!--}-->

<!--.table {-->
<!--    width: 100%;-->
<!--    height: 405px;-->
<!--}-->
<!--</style>-->
