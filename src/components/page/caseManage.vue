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
                    <el-col :span="4">
                        <el-input placeholder="请输入案例名" v-model="queryInfo.query" clearable @clear="getUserByUserName()">
                            <el-button slot="append" icon="el-icon-search" @click="getUserByUserName()"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="caseList" :stripe="true" :border="true" v-loading="listLoading" @selection-change="selsChange"
                      :header-cell-style="{background:'#F5F6FA',color:'#666E92'}">
                <el-table-column type="selection" width="40px">
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="caseId" label="案例号" width="100px"></el-table-column>
                <el-table-column prop="caseName" label="案例名" width="120px"></el-table-column>
                <el-table-column prop="courseName" label="课程名" width="120px"></el-table-column>
                <el-table-column prop="teacherName" label="创建老师" width="200px"></el-table-column>
                <el-table-column prop="creatTime" label="创建时间"width="170px"></el-table-column>
<!--                <el-table-column prop="desc" label="案例是否发布" width="50px"></el-table-column>-->
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">编辑案例</el-button>
                        <el-button type="primary"  size="mini" @click="caseDetail(scope.$index, scope.row)">案例详情</el-button>
                        <el-button type="primary"  size="mini" @click="fileView(scope.$index, scope.row)">查看提交文件</el-button>
                        <el-button type="primary"  size="mini" @click="imageView(scope.$index, scope.row)">查看提交图片</el-button>
                        <!-- 删除按钮 -->
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
    </div>
</template>

<script>
import {
    addTeacher, batchRemoveCase,
    batchRemoveTeacher,
    editTeacher, getCaseListByCaseName, getCaseListPage, getUserListByUserName, removeCase,
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
      caseList: [],
      sels: [], // 列表选中列
      // 总数
      total: 0,
      // 列表加载
      listLoading: false,
      // 控制添加用户对话框的显示与隐藏，默认为隐藏
      addFormVisible: false,
      addLoading: false,
      // 添加用户的表单数据
      addForm: {
        caseId: '',
        caseName: '',
        teacherId: '',
        createTime: '',
        desc: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
          caseId: [
          {required: true, message: '请输入案例号', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        caseName: [
          {required: true, message: '请输入案例名', trigger: 'blur'},
          {min: 9, max: 9, trigger: 'blur'}
        ],
        teacherId: [
          {required: true, message: '请输入创建老师', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ]

      },
      // 编辑
      editLoading: false,
      editFormVisible: false,
      editForm: {
          caseId: '',
          caseName: '',
          teacherId: '',
          createTime: '',
          desc: ''
      },
      editFormRules: {
        caseId: [
          {required: true, message: '请输入案例号', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        caseName: [
          {required: true, message: '请输入案例名', trigger: 'blur'},
          {min: 9, max: 9, trigger: 'blur'}
        ],
        teacherId: [
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
    async getCaseList () {
      this.listLoading = true
        var param = {pageNum: this.queryInfo.pagenum, pageSize: this.queryInfo.pagesize }
      getCaseListPage(param).then((res) => {
          console.log(res)
        this.total = res.count
        this.caseList = res.data
        this.listLoading = false
      })
    },
      //查找
      getUserByUserName(){
          this.listLoading = true
          var param = {caseName: this.queryInfo.query,pageNum:this.queryInfo.pagenum,pageSize:this.queryInfo.pagesize}
          getCaseListByCaseName(param).then((res) => {
              if(res.code==='200') {
                  if(res.data.length==0){
                      this.$message.warning('没有相应搜索结果')
                      this.getCaseList()
                  }else {
                      console.log(res)
                      this.$message.success(res.msg)
                      this.total = res.count
                      this.caseList = res.data
                      this.listLoading = false
                  }
              }
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
      this.getCaseList()
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
    // 编辑
    handleEdit: function (index, row) {
      let para = Object.assign({}, row)
        this.$router.push({path:'/editCases',query:{caseId:para.caseId}})
    },
      // 查看
      caseDetail: function (index, row) {
          let para = Object.assign({}, row)
          this.$router.push({path:'/replyCase',query:{caseId:para.caseId}})
      },
      fileView: function (index, row) {
        console.log(row)
          let para = Object.assign({}, row)
          console.log(para.caseId)
          console.log(row.caseId)
          this.$router.push({path:'/fileView',query:{caseId:para.caseId}})
      },
    // 删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        let para = {caseId: row.caseId}
        removeCase(para).then((res) => {
          if (res.code == 200) {
            this.listLoading = false
            this.$message.success(res.msg)
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.getCaseList()
          }
        })
      }).catch(() => {

      })
    },
      imageView: function (index, row) {
          let para = Object.assign({}, row)
          this.$router.push({ path: '/imageView', query: {caseId: para.caseId, caseName: para.caseName} })
      },
    // 选择多行
    selsChange: function (sels) {
      this.sels = sels
    },
    // 批量删除
    batchRemove: function () {
      var ids = this.sels.map(item => item.caseId)
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        let para = ids
        console.log(para)
        batchRemoveCase(para).then((res) => {
            console.log(res)
          if (res.code == '200') {
            this.listLoading = false
            this.$message.success(res.msg)
            this.getCaseList()
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
