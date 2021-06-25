<template>
    <div class="container">

        <!-- 面包屑导航区域 -->
        <div class="add" style="height: 300px">
            <div style="float: left">
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

            <div style="float: right; text-align: center;width: 50%">
                <div style="font-size: 1.5em; text-align: left;">
                    团队信息
                </div>
                <hr>
                <el-table
                    :data="teamInfo"
                    style="margin-top: 10px"
                    v-loading="teamLoading"
                    border>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="teamId" align="center" label="团队编号"></el-table-column>
                    <el-table-column prop="studentName" align="center" label="成员"></el-table-column>
                </el-table>
            </div>
        </div>

        <div class="table" >
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
                </el-row>
            </div>
            <el-table :data="caseList" :stripe="true" :border="true" v-loading="listLoading" :header-cell-style="{background:'#F5F6FA',color:'#666E92'}" @selection-change="selsChange">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="caseName" label="案例名称"></el-table-column>
                <el-table-column prop="teacherName" label="创建教师" ></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)">案例详情</el-button>
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
  batchRemoveCase,
  getCaseListByCourse, getCourseDetailPage,
  getTeamMembers
} from '../../api/api'
import dicList from './Dictionary'

export default {
  data () {
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
      // 课程
      courseInfo: {
        courseId: '',
        courseName: '',
        desc: ''
      },
      teamInfo: [],
      // 案例
      caseList: [],
      sels: [], // 列表选中列
      // 总数
      total: 0,
      // 列表加载
      listLoading: false,
      teamLoading: false
    }
  },
  created () {
    this.getCourseDetail()
    this.getCaseList()
    this.getTeamInfo()
  },
  methods: {
    async getCourseDetail () {
      this.courseInfo.courseId = this.$route.query.courseId

      getCourseDetailPage(this.courseInfo).then((res) => {
        this.courseInfo.courseName = res.data.courseName
        this.courseInfo.desc = res.data.courseDesc
      })
    },
    getCaseList () {
      this.listLoading = true
      let para = {courseId: this.courseInfo.courseId, pageNum: this.queryInfo.pagenum, pageSize: this.queryInfo.pagesize}
      this.listLoading = true
      getCaseListByCourse(para).then((res) => {
        this.caseList = res.data
        this.listLoading = false
        this.total = res.count
      })
    },
    getTeamInfo () {
      this.teamLoading = true
      let para = {courseId: this.courseInfo.courseId, studentId: JSON.parse(localStorage.getItem('user')).userId}
      getTeamMembers(para).then((res) => {
        if (res.code == '200') {
          this.teamLoading = false
          this.teamInfo = res.data
        } else if (res.code == '200') {
          this.teamLoading = false
          alert('您尚未组队')
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
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
      this.$refs.editForm.resetFields()
    },

    // 案例详情
    handleEdit: function (index, row) {
      let para = Object.assign({}, row)
      this.$router.push({path: '/replyCase', params: {caseId: para.caseId, caseName: para.caseName}})
    },
    // 选择多行
    selsChange: function (sels) {
      this.sels = sels
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
    clear: both;
    height: 100vh;
    border-radius: 5px;
}
.table{
    width: 100%;
    float: left;
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
