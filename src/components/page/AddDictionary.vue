    <template>
        <div class="container">

            <!-- 面包屑导航区域 -->
            <div class="add">
                <div style="text-align: left;margin-left: 5px">
                数据字典
                </div>
                <hr>
                <el-form :model="dicForm" label-width="80px" :rules="dicFormRules" ref="editForm">
                    <el-form-item label="中文标识" prop="typeName">
                        <el-col :span="8">
                            <el-input v-model="dicForm.typeName"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="英文标识" prop="typeCode">
                        <el-col :span="8">
                            <el-input v-model="dicForm.typeCode"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-col :span="14">
                            <el-input type="textarea" :rows="4" v-model="dicForm.remark"></el-input>
                        </el-col>
                    </el-form-item>
                </el-form>
            </div>

            <div class="table">
                <div style="text-align: left;margin-top: 10px;margin-left: 5px">
                    数据项
                </div>
                <hr>
                <el-table :data="userList" :stripe="true" :border="true" v-loading="listLoading" :header-cell-style="{background:'#F5F6FA',color:'#666E92'}">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="valueId" label="数据数值"></el-table-column>
                    <el-table-column prop="valueName" label="数值名称" ></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" ></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!-- 修改按钮 -->
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)"></el-button>
                            <!-- 删除按钮 -->
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDel(scope.$index, scope.row)"></el-button>
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
                <el-button  @click="addFormVisible=true" class="button">创建数据项</el-button>
                <div class="submit">
                    <el-button @click="addFormVisible = false">重  置</el-button>
                    <el-button type="primary" :loading="addLoading" @click.native="addUser">提  交</el-button>
                </div>
            </div>

            <!-- 添加用户的对话框 -->
            <el-dialog
                title="添加数据项"
                :visible.sync="addFormVisible"
                width="40%"
                @close="addDialogClosed" >
                <!-- 内容的主体区域 -->
                <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
                    <el-form-item label="数据数值" prop="valueId">
                        <el-col :span="8">
                            <el-input v-model="addForm.valueId" ></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="数据名称" prop="valueName">
                        <el-col :span="8">
                            <el-input v-model="addForm.valueName"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="createTime">
                        <el-col :span="14">
                            <el-input  v-model="addForm.createTime"></el-input>
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
            <el-dialog title="编辑"  width="40%" :visible.sync="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                    <el-form-item label="数据数值" prop="valueId">
                        <el-col :span="8">
                            <el-input v-model="editForm.valueId"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="数据名称" prop="valueName">
                        <el-col :span="8">
                            <el-input v-model="editForm.valueName"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="创建时间" prop="createTime">
                        <el-col :span="14">
                            <el-input  v-model="editForm.createTime"></el-input>
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
            editTeacher,
            getTeacherListPage,
            removeTeacher
        } from '../../api/api'
        import dicList from './Dictionary'

        export default {
            data () {
                return {
                    // 获取用户列表的参数对象
                    queryInfo: {
                        // 查询参数
                        query: '',
                        //数据字典
                        dicCode:'',
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
                    listLoading:false,
                    // 控制添加用户对话框的显示与隐藏，默认为隐藏
                    addFormVisible: false,
                    addLoading:false,
                    //数据字典
                    dicForm:{
                        typeName:'',
                        typeCode:'',
                        remark:''
                    },
                    dicFormRules: {
                        typeName: [
                            {required: true, message: '请输入用户名', trigger: 'blur'},
                        ],
                        typeCode: [
                            {required: true, message: '请输入密码', trigger: 'blur'},
                        ]
                    },
                    // 添加用户的表单数据
                    addForm: {
                        valueName:'',
                        valueId:'',
                        CreateTime:''
                    },
                    // 添加表单的验证规则对象
                    addFormRules: {
                        valueName: [
                            {required: true, message: '请输入用户名', trigger: 'blur'},
                        ],
                        valueId: [
                            {required: true, message: '请输入密码', trigger: 'blur'},
                        ]
                    },
                    //编辑
                    editLoading: false,
                    editFormVisible:false,
                    editForm: {
                        valueName:'',
                        valueId:'',
                        CreateTime:''
                    },
                    editFormRules: {
                        valueName: [
                            {required: true, message: '请输入用户名', trigger: 'blur'},
                        ],
                        valueId: [
                            {required: true, message: '请输入密码', trigger: 'blur'},
                        ]
                    },
                }
            },
            created () {
                this.getUserList()
            },
            methods: {
                async getUserList () {
                    this.queryInfo.dicCode=this.$store.state.dicCode
                    this.listLoading=true
                    getTeacherListPage(this.queryInfo).then((res) => {
                        this.total = res.data.total
                        this.dicForm=res.data
                        this.userList = res.data.users
                        this.listLoading=false
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
                                    if(res.data.code==200) {
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
                                    if(res.data.code==200) {
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
                            if(res.data.code==200) {
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
            height: 100%;
            border-radius: 5px;
        }
        .table{
            margin-top: 20px;
        }

        .button {
            margin-top: 10px;
            width: 100%;
            boder: 1px dashed;
        }
        .submit{
            margin-top: 10px;
            text-align: right;
        }

    </style>


