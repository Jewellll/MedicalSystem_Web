<template>
    <div class="container">
        <!-- 面包屑导航区域 -->
        <div class="crumb">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 5px">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>案例管理</el-breadcrumb-item>
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
                        <el-button type="primary" @click="addFormVisible=true">添加课程</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="caseList" :stripe="true" :border="true" v-loading="listLoading" @selection-change="selsChange"
                      :header-cell-style="{background:'#F5F6FA',color:'#666E92'}">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="case_id" label="课程号" width="100px"></el-table-column>
                <el-table-column prop="casename" label="课程名" width="150px"></el-table-column>
                <el-table-column prop="teacher_id" label="创建老师" width="150px"></el-table-column>
                <el-table-column prop="createtime" label="创建时间" width="200px"></el-table-column>
                <el-table-column prop="desc" label="课程状态" width="100px"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">查看课程</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="primary"  size="mini" @click="addStudent(scope.$index, scope.row)">添加学生</el-button>
                        <el-button type="primary"  size="mini" @click="handleDel(scope.$index, scope.row)">添加老师</el-button>
                        <el-button type="primary"  size="mini" @click="handleDel(scope.$index, scope.row)">添加案例</el-button>
                        <el-button type="danger"  size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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

        <!-- 添加课程 -->
        <el-dialog
            title="添加案例"
            :visible.sync="addFormVisible"
            width="40%"
            @close="addDialogClosed" >
            <!-- 内容的主体区域 -->
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
                <el-form-item label="案例号" prop="case_id">
                    <el-col :span="8">
                        <el-input v-model="addForm.case_id" ></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="案例名">
                    <el-col :span="8">
                        <el-input v-model="addForm.casename"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="创建老师">
                    <el-col :span="14">
                        <el-input v-model="addForm.teacher_id"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取 消</el-button>
                <el-button type="primary" :loading="addLoading" @click.native="addUser">确 定</el-button>
            </span>
        </el-dialog>

<!--        添加学生-->
        <el-dialog
            title="添加学生"
            :visible.sync="addStudentVisible"
            width="100%"
            @close="addDialogClosed" >
            <!-- 内容的主体区域 -->
            <el-transfer
                style="text-align: left; display: inline-block"
                v-model="value"
                filterable
                :render-content="renderFunc"
                :titles="['Source', 'Target']"
                :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
                @change="handleChange"
                :data="data">
            </el-transfer>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑"  width="40%" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="案例号" prop="case_id">
                    <el-col :span="8">
                        <el-input v-model="editForm.case_id"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="案例号" prop="card">
                    <el-col :span="8">
                        <el-input v-model="editForm.casename"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="创建老师" prop="teacher_id">
                    <el-col :span="14">
                        <el-input v-model="editForm.teacher_id"></el-input>
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
  editTeacher, getCaseListPage,
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
    // data初始化
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `学生 ${i}`,
          disabled: i % 4 === 0
        })
      }
      return data
    }
    return {
      data: generateData(),
      value: [],
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
      caseList: [],
      sels: [], // 列表选中列
      // 总数
      total: 0,
      // 列表加载
      listLoading: false,
      // 控制添加用户对话框的显示与隐藏，默认为隐藏
      addFormVisible: false,
      addStudentVisible: false,
      addLoading: false,
      // 添加用户的表单数据
      addForm: {
        case_id: '',
        casename: '',
        teacher_id: '',
        create_time: '',
        desc: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        case_id: [
          {required: true, message: '请输入案例号', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        casename: [
          {required: true, message: '请输入案例名', trigger: 'blur'},
          {min: 9, max: 9, trigger: 'blur'}
        ],
        teacher_id: [
          {required: true, message: '请输入创建老师', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ]

      },
      // 编辑
      editLoading: false,
      editFormVisible: false,
      editForm: {
        case_id: '',
        casename: '',
        teacher_id: '',
        create_time: '',
        desc: ''
      },
      editFormRules: {
        case_id: [
          {required: true, message: '请输入案例号', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        casename: [
          {required: true, message: '请输入案例名', trigger: 'blur'},
          {min: 9, max: 9, trigger: 'blur'}
        ],
        teacher_id: [
          {required: true, message: '请输入创建老师', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.getCaseList()
  },
  methods: {
    // 性别显示转换
    formatSex: function (row, column) {
      // eslint-disable-next-line eqeqeq
      return row.sex == 1 ? '男' : row.sex == 2 ? '女' : '未知'
    },
    async getCaseList () {
      this.listLoading = true
      getCaseListPage(this.queryInfo).then((res) => {
        console.log(res)
        this.total = res.data.total
        this.caseList = res.data.users
        this.listLoading = false
      })
    },
    // 监听 pageSize 改变的事件
    handleSizeChange (newSize) {
      //   console.log(newSize)
      //  将监听接受到的每页显示多少条的数据 newSzie 赋值给 pagesize
      this.queryInfo.pagesize = newSize
      //  修改完以后，重新发起请求获取一次数据
      this.getCaseList()
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
              // eslint-disable-next-line eqeqeq
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
    // 添加学生
    addStudent (index, row) {
      this.addStudentVisible = true
    },
    // 显示编辑
    handleEdit: function (index, row) {
      let para = Object.assign({}, row)
      this.$store.commit('setCourseName', para.courseName)
      this.$router.push({ path: '/courseDetail', query: {} })
    },
    // 删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        let para = {id: row.id}
        removeTeacher(para).then((res) => {
          if (res.data.code == 200) {
            this.listLoading = false
            // NProgress.done();
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
    // 选择多行
    selsChange: function (sels) {
      this.sels = sels
    },
    // 批量删除
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
            // NProgress.done();
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
.crumb{
    margin-left: 2px;
}
.table{
    margin-top: 20px;
}
.toolbar{
    margin-bottom: 10px;
}
.page{
    margin-top: 10px;
}
</style>
