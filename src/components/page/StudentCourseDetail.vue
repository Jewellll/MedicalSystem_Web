<template>
    <div class="container">

        <!-- 面包屑导航区域 -->
        <div class="add">
            <div style="font-size: 1.5em; text-align: left;margin-left: 0.2em">
                课程详情
            </div>
            <hr>
            <div>
                <div style="font-size: 1em;text-align: left;margin-left: 0.4em;margin-top: 1em">
                    课程名：<div style="display: inline-block">{{courseInfo.courseName}}</div>
                </div>
                <div style="font-size: 1em;text-align: left;margin-left: 0.4em;margin-top: 2em">
                    <div style="display: inline-block; vertical-align: top">
                        课程描述：
                    </div>
                    <div class="descBox">
                        <el-scrollbar>
                            <p>{{courseInfo.desc}}</p>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
        </div>

        <div class="table">

            <div style="font-size: 1.5em; text-align: left;margin-left: 0.2em">
                课程案例
            </div>
            <hr>
            <div class="toolbar">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-input placeholder="请输入案例名" v-model="queryInfo.query" clearable @clear="getCourseDetail">
                            <el-button slot="append" icon="el-icon-search" @click="getCourseDetail()"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" @click="addCase">添加案例</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="caseList" :stripe="true" :border="true" v-loading="listLoading" :header-cell-style="{background:'#F5F6FA',color:'#666E92'}" @selection-change="selsChange">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="case_name" label="案例名称"></el-table-column>
                <el-table-column prop="valueName" label="创建教师" ></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)">案例详情</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDel(scope.$index, scope.row)">删除案例</el-button>
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
            <div class="submit">
                <el-button type="primary" @click="back">返  回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {
  addTeacher, batchRemoveCase,
  batchRemoveTeacher,
  editTeacher, getCourseDetailPage,
  getTeacherListPage, removeCase,
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
        // 课程名
        course_name: '',
        // 当前的页码数
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5
      },
      // 课程
      courseInfo: {
        courseName: '癌细胞转移',
        desc: '国家创新重点课程'
      },
      // 案例
      caseList: [],
      sels: [], // 列表选中列
      // 总数
      total: 0,
      // 列表加载
      listLoading: false,
    }
  },
  created () {
    this.getCourseDetail()
  },
  methods: {
    async getCourseDetail () {
      this.queryInfo.courseName = this.$store.state.courseName
      this.listLoading = true
      getCourseDetailPage(this.queryInfo).then((res) => {
        this.total = res.data.total
        this.courseInfo = res.data
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
      this.getCourseDetail()
    },
    // 监听 页码值  改变的事件
    handleCurrentChange (newPage) {
      //   console.log(newPage)
      //  将监听接受到的页码值的数据 newPage 赋值给 pagenum
      this.queryInfo.pagenum = newPage
      //  修改完以后，重新发起请求获取一次数据
      this.getCourseDetail()
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
    addCase () {
      this.$router.push({ path: '/createCases', query: {} })
    },
    // 显示编辑
    handleEdit: function (index, row) {
      let para = Object.assign({}, row)
      this.$store.commit('setCaseName', para.caseName)
      this.$router.push('/caseDetail')
    },
    // 删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        let para = {id: row.id}
        removeCase(para).then((res) => {
          if (res.data.code == 200) {
            this.listLoading = false
            // NProgress.done();
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.getCourseDetail()
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
        batchRemoveCase(para).then((res) => {
          if (res.data.code == 200) {
            this.listLoading = false
            // NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getCourseDetail()
          }
        })
      }).catch(() => {

      })
    },
    back () {
      this.$router.go(-1)
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

.submit{
    margin-top: 10px;
    text-align: right;
}
.toolbar{
    margin-bottom: 10px;
}
.descBox{
    display: inline-block;
    border: 1px solid #c1c1c1;
    width:32em;
    height: 6em;
    border-radius: 2px;
}
.descBox p {
    left: 0.5em;
    margin-top: 0.5em;
    line-height: 1.2em;
    position: relative;
    width: 90%;
    text-align: justify;
    font-size: 1em;
}
.el-scrollbar {
    height: 100%;
}
.descBox >>> .el-scrollbar__wrap {
    overflow: scroll;
    width: 110%;
    height: 118%;
}

</style>
