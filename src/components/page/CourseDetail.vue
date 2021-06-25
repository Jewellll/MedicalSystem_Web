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

        <div class="table" style="margin-top: 40px">
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
                <el-table-column prop="caseName" label="案例名称"></el-table-column>
                <el-table-column prop="teacherName" label="创建教师" ></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">编辑案例</el-button>
                        <el-button type="primary"  size="mini" @click="caseView(scope.$index, scope.row)">案例详情</el-button>
                        <el-button type="primary"  size="mini" @click="fileView(scope.$index, scope.row)">查看提交文件</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger"  size="mini" @click="handleDelCase(scope.$index, scope.row)">删除案例</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <div class="page">
                <el-pagination
                    @size-change="handleCaseSizeChange"
                    @current-change="handleCaseCurrentChange"
                    :current-page="queryInfo.pagenum_case"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize_case"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total_case">
                </el-pagination>
            </div>
        </div>

        <div style="margin-top: 20px">
            <div style="font-size: 1.5em; text-align: left;margin-left: 0.2em">
               团队管理
            </div>
            <hr>
            <div class="table">
                <!-- 搜索与添加区域 -->
                <el-table :data="teamList" :stripe="true" :border="true" v-loading="teamListLoading"
                          :header-cell-style="{background:'#F5F6FA',color:'#666E92'}" style="width: 100%" >
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="teamId" label="团队编号" width="100px" align="center"></el-table-column>
                    <el-table-column prop="members" label="成员" align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary"  size="mini" @click="handleTeam(scope.$index, scope.row)">管理</el-button>
                            <el-button type="danger"  size="mini" @click="handleDelTeam(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button  @click="addTeam" class="button">创建团队</el-button>
            </div>
            <!-- 分页区域 -->
            <div class="page">
                <el-pagination
                    @size-change="handleTeamSizeChange"
                    @current-change="handleTeamCurrentChange"
                    :current-page="queryInfo.pagenum_team"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize_team"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total_team">
                </el-pagination>
            </div>
            <!--            创建团队页面-->
            <el-dialog width="60%" title="创建团队" :visible.sync="addTeamVisible" >
                <el-form label-width="100px"  :model="addForm" :rules="addFormRules">
                    <el-form-item label="团队编号" prop="teamId">
                        <el-input v-model="addForm.teamId"></el-input>
                    </el-form-item>
                    <el-form-item label="请选择学生" prop="students">
                        <el-transfer
                            style="text-align: left; display: inline-block"
                            v-model="addForm.members"
                            filterable
                            :titles="['Source', 'Target']"
                            :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
                            :data="addForm.students">
                        </el-transfer>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addTeamVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addTeamSubmit" :loading="addLoading">提交</el-button>
                </div>
            </el-dialog>

            <!--            管理页面-->
            <el-dialog
                title="管理团队"
                width="60%"
                :visible.sync="editTeamVisible">
                <el-form
                    label-width="100px">
                    <el-form-item label="团队编号" prop="teamId">
                        <el-input v-model="editTeam.teamId"></el-input>
                    </el-form-item>
                    <el-table
                        class="dicTable"
                        :data="editTeam.members"
                        border>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="studentName" label="学生"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary"  size="mini" @click="changeStudent(scope.$index, scope.row)">移动分组</el-button>
                                <el-button type="danger"  size="mini" @click="handleDelStudent(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button @click="addRow">添加</el-button>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editTeamVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmit" :loading="addLoading">确认</el-button>
                </div>
            </el-dialog>
            <!--            在已有团队中添加学生-->
            <el-dialog width="60%" title="添加学生" :visible.sync="addStudentVisible">
                    <el-transfer
                        style="text-align: left; display: inline-block"
                        v-model="editTeam.newMembers"
                        filterable
                        :titles="['Source', 'Target']"
                        :format="{
                        noChecked: '${total}',
                        hasChecked: '${checked}/${total}'
                      }"
                        :data="addForm.students">
                    </el-transfer>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addStudentVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addStudent" :loading="addLoading">提交</el-button>
                </div>
            </el-dialog>

<!--            更改学生分组-->
            <el-dialog width="40%" title="更改分组" :visible.sync="changeTeamVisible">
                <el-form :model="modifyTeam"
                    label-width="100px" ref="change" :rules="changeTeamRules">
                    <el-form-item label="新团队编号" prop="teamId_change">
                        <el-input v-model="modifyTeam.teamId_change"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="changeTeamVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="handlChangeStudent" >提交</el-button>
                </div>
            </el-dialog>
            <div class="submit">
                <el-button type="primary" @click="back">返  回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {
  batchRemoveCase, changeTeam,
  createTeam, delStudent,
  getCaseListByCourse, getCourseDetailPage, getCourseStudents,
  getTeamListByCourse, getTeamStudent, removeCase, removeTeam

} from '../../api/api'
import dicList from './Dictionary'

export default {
  data () {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 查询参数
        queryCase: '',
        queryTeam: '',
        // 课程名
        course_name: '',
        // 当前的页码数
        pagenum_case: 1,
        // 每页显示多少条数据
        pagesize_case: 5,
        // 当前的页码数
        pagenum_team: 1,
        // 每页显示多少条数据
        pagesize_team: 5
      },
      // 课程
      courseInfo: {
        courseName: '',
        desc: ''
      },
      // 案例
      caseList: [],
      sels: [], // 列表选中列
      // 总数
      total_case: 0,
      total_team: 0,
      modifyTeam: {
        teamId_change: '',
        studentId: ''
      },
      changeTeamRules: {
          teamId_change: [{required: true, message: '请输入新的团队编号', trigger: 'blur'}]
      },
      courseId: '',
      courseName: '',
      // 列表加载
      listLoading: false,
      teamListLoading: false,
      // 团队
      addTeamVisible: false,
      addStudentVisible: false,
      editTeamVisible: false,
      changeTeamVisible: false,
      addLoading: false,
      editLoading: false,
      teamList: [],
      addForm: {
        teamId: '',
        students: [],
        members: []
      },
      addFormRules: {
        teamId: [{required: true, message: '请输入团队编号 ', trigger: 'blur'}]
      },
      editTeam: {
        teamId: '',
        members: [],
        newMembers: []
      }
    }
  },
  created () {
    this.getParams()
    this.getCourseDetail()
    this.getCaseList()
    this.getTeamList()
  },
  methods: {
    getParams () {
      this.courseId = this.$route.query.courseId
      this.courseName = this.$route.query.courseName
    },
    async getCourseDetail () {
      let para = {courseId: this.courseId}
      getCourseDetailPage(para).then((res) => {
        this.courseInfo.courseName = res.data.courseName
        this.courseInfo.desc = res.data.courseDesc
      })
    },
    getCaseList () {
      let para = {courseId: this.courseId, pageNum: this.queryInfo.pagenum_case, pageSize: this.queryInfo.pagesize_case}
      this.listLoading = true
      getCaseListByCourse(para).then((res) => {
        this.caseList = res.data
        this.listLoading = false
        this.total_case = res.count
      })
    },
    getTeamList () {
      let para = {courseId: this.courseId, pageNum: this.queryInfo.pagenum_team, pageSize: this.queryInfo.pagesize_team}
      this.teamListLoading = true
      getTeamListByCourse(para).then((res) => {
        this.teamList = res.data.list
        for (let i = 0; i < res.data.list.length; i++) {
          let temp = res.data.list[i].courseStudents
          let data = ''
          for (let j = 0; j < temp.length; j++) {
            data += temp[j].studentName + ' '
          }
          this.teamList[i].members = data
        }
        this.teamListLoading = false
      })
    },
    // 监听 pageSize 改变的事件
    handleCaseSizeChange (newSize) {
      //  将监听接受到的每页显示多少条的数据 newSzie 赋值给 pagesize
      this.queryInfo.pagesize_case = newSize
      //  修改完以后，重新发起请求获取一次数据
      this.getCaseList()
    },
    // 监听 页码值  改变的事件
    handleCaseCurrentChange (newPage) {
      //  将监听接受到的页码值的数据 newPage 赋值给 pagenum
      this.queryInfo.pagenum_case = newPage
      //  修改完以后，重新发起请求获取一次数据
      this.getCaseList()
    },
    // 监听 pageSize 改变的事件
    handleTeamSizeChange (newSize) {
      //  将监听接受到的每页显示多少条的数据 newSzie 赋值给 pagesize
      this.queryInfo.pagesize_team = newSize
      //  修改完以后，重新发起请求获取一次数据
      this.getTeamList()
    },
    // 监听 页码值  改变的事件
    handleTeamCurrentChange (newPage) {
      //  将监听接受到的页码值的数据 newPage 赋值给 pagenum
      this.queryInfo.pagenum_team = newPage
      //  修改完以后，重新发起请求获取一次数据
      this.getTeamList()
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
    // 点击按钮，添加新案例
    addCase () {
      // this.$store.commit('setCourseName', this.courseInfo.courseName)
      this.$router.push({ path: '/createCases', query: {courseId: this.courseId, courseName: this.courseName} })
    },
    // 编辑
    handleEdit: function (index, row) {
      let para = Object.assign({}, row)
      this.$router.push({ path: '/editCases', query: {caseName: para.caseName, caseId: para.caseId, courseId: this.courseId} })
    },
    // 查看
    caseView: function (index, row) {
      let para = Object.assign({}, row)
      this.$router.push({path: '/replyCase', query: {caseId: para.caseId, caseName: para.caseName}})
    },
    fileView: function (index, row) {
      let para = Object.assign({}, row)
      this.$router.push({ path: '/fileView', query: {caseId: para.caseId, caseName: para.caseName} })
    },
    // 删除
    handleDelCase: function (index, row) {
      this.$confirm('确认删除该案例吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        let para = {caseId: row.caseId}
        removeCase(para).then((res) => {
          if (res.code == 200) {
            this.listLoading = false
            // NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            })
              this.getCaseList()
          }
        })
      }).catch(() => {

      })
    },
    handleDelTeam (index, row) {
      this.$confirm('确认删除该团队吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.teamListLoading = true
        let para = {courseId: this.courseId, teamId: row.teamId}
        removeTeam(para).then((res) => {
          if (res.code == '200') {
            this.teamListLoading = false
            // NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getTeamList()
          }
        })
      }).catch(() => {

      })
    },
    // 更换分组
    changeStudent (index, row) {
      this.modifyTeam.studentId = row.studentId
      this.changeTeamVisible = true
    },
    handlChangeStudent () {
      this.$refs.change.validate((valid) => {
        if (valid) {
          let para = {courseId: this.courseId, teamId: this.modifyTeam.teamId_change, studentId: this.modifyTeam.studentId}
          changeTeam(para).then((res) => {
            if (res.code == '200') {
              this.$message.success('更换成功')
              let param = {courseId: this.courseId, teamId: this.editTeam.teamId}
              getTeamStudent(param).then((res) => {
                this.editTeam.members = res.data
              })
              this.getTeamList()
              this.changeTeamVisible = false
            }
          })
        }
      })
    },
    // 删除学生
    handleDelStudent (index, row) {
      this.editTeam.members.splice(index, 1)
      let para = {courseId: this.courseId, teamId: this.editTeam.teamId, studentId: row.studentId}
      delStudent(para).then((res) => {
        if (res.code == '200') {
          this.$message.success('删除成功')
        }
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
          if (res.code === 200) {
            this.listLoading = false
            // NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            })
              this.getCaseList()
          }
        })
      }).catch(() => {

      })
    },
    back () {
      this.$router.go(-1)
    },
    // 团队
    addTeam () {
      this.addTeamVisible = true
      this.addForm.students = []
      let para = {courseId: this.courseId}
      getCourseStudents(para).then((res) => {
        for (let i = 0; i < res.data.data.length; i++) {
          this.addForm.students.push({
            key: res.data.data[i].studentId,
            label: res.data.data[i].studentName
          })
        }
      })
    },
    // 点击按钮创建团队
    addTeamSubmit () {
      // courseId从课程详情页面获取
      let para = {courseId: this.courseId, teamId: this.addForm.teamId, courseStudents: []}
      for (let i = 0; i < this.addForm.members.length; i++) {
        para.courseStudents.push({
          studentId: this.addForm.members[i]
        })
      }
      createTeam(para).then((res) => {
        if (res.code == '200') {
          this.$message.success('创建成功')
          this.addForm.students = []
          this.addForm.teamId = ''
        }
        this.getTeamList()
      })
      this.addTeamVisible = false
    },
    // 团队中添加学生
    addStudent () {
      let para = {courseId: this.courseId, teamId: this.editTeam.teamId, courseStudents: []}
      for (let i in this.editTeam.newMembers) {
        para.courseStudents.push({
          studentId: this.editTeam.newMembers[i]
        })
      }
      createTeam(para).then((res) => {
        if (res.code == '200') {
          this.$message.success('增加成功')
        }
        this.addStudentVisible = false
        let param = {courseId: this.courseId, teamId: this.editTeam.teamId}
        getTeamStudent(param).then((res) => {
          this.editTeam.members = res.data
        })
        this.getTeamList()
      })
      this.editTeam.newMembers = []
    },
    addRow () {
      this.addStudentVisible = true
      let para = {courseId: this.courseId}
      this.addForm.students = []
      getCourseStudents(para).then((res) => {
        for (let i = 0; i < res.data.data.length; i++) {
          this.addForm.students.push({
            key: res.data.data[i].studentId,
            label: res.data.data[i].studentName
          })
        }
      })
    },
    editSubmit () {
      this.editTeamVisible = false
    },
    handleTeam (index, row) {
      this.editTeamVisible = true
      this.editTeam.teamId = row.teamId
      let para = {courseId: this.courseId, teamId: row.teamId}
      getTeamStudent(para).then((res) => {
        this.editTeam.members = res.data
      })
      // for (let i = 0; i < para.length - 1; i++) {
      //   let temp = JSON.stringify(para[i])
      //   temp = temp.substring(1, temp.length - 1)
      //   this.editTeam.members.push({
      //     studentName: temp
      //   })
      // }
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
.button {
    margin-top: 10px;
    width: 100%;
    boder: 1px dashed;
}

</style>
