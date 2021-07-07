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
                        <el-input placeholder="请输入课程名" v-model="queryInfo.courseName" clearable @clear="getCourseList">
                            <el-button slot="append" icon="el-icon-search" @click="searchCourse"></el-button>
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
            <el-table :data="courseList" :stripe="true" :border="true" v-loading="listLoading" @selection-change="selsChange"
                      :header-cell-style="{background:'#F5F6FA',color:'#666E92'}">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="courseId" label="课程号" width="100px"></el-table-column>
                <el-table-column prop="courseName" label="课程名" width="150px"></el-table-column>
                <el-table-column prop="creatTeacher" label="创建老师" width="100px"></el-table-column>
                <el-table-column prop="teacherNumbers" label="教学老师" width="150px"></el-table-column>
                <el-table-column prop="creatTime" label="创建时间" width="200px"></el-table-column>
                <el-table-column prop="desc" label="课程状态" width="100px"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">查看课程</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="primary"  size="mini" @click="addStudent(scope.$index, scope.row)">添加学生</el-button>
                        <el-button type="primary"  size="mini" @click="addTeachers(scope.$index, scope.row)">添加老师</el-button>
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
            title="添加课程"
            :visible.sync="addFormVisible"
            width="40%"
            >
            <!-- 内容的主体区域 -->
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
                <el-form-item label="课程名" prop="courseName">
                    <el-col :span="8">
                        <el-input v-model="addForm.courseName"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="课程描述" prop="courseDesc">
                    <el-col :span="14">
                        <el-input v-model="addForm.courseDesc" type="textarea" :rows="5"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取 消</el-button>
                <el-button type="primary" :loading="addLoading" @click.native="newCourse">确 定</el-button>
            </span>
        </el-dialog>

<!--        添加学生-->
        <el-dialog
            title="添加学生"
            :visible.sync="addStudentVisible"
            width="100%"
             >
            <div style="width: 100%;height: 300px;clear: both">
            <!-- 内容的主体区域 -->
            <div style="width: 40%;display:inline-block;">
                <span style="font-size: large">可加入学生</span>
                <el-table
                    :data="originStudents"
                    height="250"
                    width="50%"
                    @selection-change="handleSelectionStudent"
                    border>
                    <el-table-column type="selection" width="50px"></el-table-column>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="realName" label="学生姓名"  align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary"  size="mini" @click="handleAddStudent(scope.$index, scope.row)">添加</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="text-align: left;margin-top: 10px">
                    <el-button type="danger" @click="batchAddStudent">批量添加</el-button>
                </div>
            </div>
            <div style="width: 40%;display: inline-block;float:right;margin-right: 10%">
                <span style="font-size: large">已加入学生</span>
                <el-table
                    :data="newStudents"
                    width="50%"
                    height="250"
                    @selection-change="deleteBatchStudent"
                    border>
                    <el-table-column type="selection" width="50px"></el-table-column>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="studentName" label="学生姓名" align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="danger"  size="mini" @click="moveStudent(scope.$index, scope.row)">移出课程</el-button>                        </template>
                    </el-table-column>
                </el-table>
                <div style="text-align: left;margin-top: 10px">
                    <el-button type="danger" @click="batchDelStudents">批量删除</el-button>
                </div>
            </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addStudentVisible = false">取 消</el-button>
                <el-button type="primary" :loading="addLoading" @click.native="addStudentVisible = false">确 定</el-button>
            </span>
        </el-dialog>
<!--        添加老师-->
        <el-dialog
            title="添加老师"
            :visible.sync="addTeacherVisible"
            width="100%"
             >
            <!-- 内容的主体区域 -->
            <div style="width: 100%;height: 300px;clear: both">
                <!-- 内容的主体区域 -->
                <div style="width: 40%;display:inline-block;">
                    <span style="font-size: large">可加入老师</span>
                    <el-table
                        :data="originTeachers"
                        height="250"
                        width="50%"
                        @selection-change="handleSelectionTeacher"
                        border>
                        <el-table-column type="selection" width="50px"></el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="realName" label="老师姓名"  align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary"  size="mini" @click="handleAddTeacher(scope.$index, scope.row)">添加</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="text-align: left;margin-top: 10px">
                        <el-button type="danger" @click="batchAddTeacher">批量添加</el-button>
                    </div>
                </div>
                <div style="width: 40%;display: inline-block;float:right;margin-right: 10%">
                    <span style="font-size: large">已加入老师</span>
                    <el-table
                        :data="newTeachers"
                        width="50%"
                        height="250"
                        @selection-change="handleChange"
                        border>
                        <el-table-column type="selection" width="50px"></el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="teacherName" label="老师姓名" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="danger"  size="mini" @click="moveTeachers(scope.$index, scope.row)">移出课程</el-button>                        </template>
                        </el-table-column>
                    </el-table>
                    <div style="text-align: left;margin-top: 10px">
                        <el-button type="danger" @click="batchDelTeachers">批量删除</el-button>
                    </div>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addTeacherVisible = false">取 消</el-button>
                <el-button type="primary" :loading="addLoading" @click.native="addTeacherVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
  addCourse,
  addCourseStudents,
  addCourseTeachers,
  batchRemoveCourse,
  batchRemoveTeacher,
  deleteBatchStu,
  findStudents,
  findTeachers,
  getCourseListPage,
  getCourseTeachers,
  getStudentInCourse,
  moveStudentFromCourse,
  moveTeacher,
  removeCourse,
  searchByCourse
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
    // eslint-disable-next-line no-unused-vars
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
      courseId: 0,
      courseName: '',
      studentSels: [],
      studentDelSels: [],
      teacherSels: [],
      teacherDelSels: [],
      originStudents: [],
      originTeachers: [],
      newStudents: [],
      newTeachers: [],
      // 获取用户列表的参数对象
      queryInfo: {
        // 查询参数
        courseName: '',
        // 当前的页码数
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5
      },
      // 获取的课程列表
      courseList: [],
      sels: [], // 列表选中列
      // 总数
      total: 0,
      // 列表加载
      listLoading: false,
      // 控制添加用户对话框的显示与隐藏，默认为隐藏
      addFormVisible: false,
      addStudentVisible: false,
      addTeacherVisible: false,
      addLoading: false,
      // 添加用户的表单数据
      addForm: {
        courseName: '',
        courseDesc: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        courseName: [{required: true, message: '请输入课程名', trigger: 'blur'}],
        createTeacher: [{required: true, message: '请输入创建老师', trigger: 'blur'}],
        courseDesc: [{required: true, message: '请简要描述课程', trigger: 'blur'}]
      }
      // 编辑

    }
  },
  created () {
    this.getCourseList()
    this.$watch('queryInfo.courseName', (newVal, oldVal) => {
      if (newVal == '') {
        this.getCourseList()
      }
    })
  },
  methods: {
    // 查询课程
    searchCourse () {
      searchByCourse(this.queryInfo).then((res) => {
        if (res.code !== '200') {
          this.$message.error('没有这门课')
        }
        this.total = res.count
        this.courseList = res.data
      })
    },
    async getCourseList () {
      var param = {pageNum: this.queryInfo.pagenum, pageSize: this.queryInfo.pagesize }
      this.listLoading = true
      getCourseListPage(param).then((res) => {
        this.total = res.count
        this.courseList = res.data.pageInfo.list
        this.listLoading = false
      })
    },
    // 监听 pageSize 改变的事件
    handleSizeChange (newSize) {
      //   console.log(newSize)
      //  将监听接受到的每页显示多少条的数据 newSzie 赋值给 pagesize
      this.queryInfo.pagesize = newSize
      //  修改完以后，重新发起请求获取一次数据
      this.getCourseList()
    },
    // 监听 页码值  改变的事件
    handleCurrentChange (newPage) {
      //   console.log(newPage)
      //  将监听接受到的页码值的数据 newPage 赋值给 pagenum
      this.queryInfo.pagenum = newPage
      //  修改完以后，重新发起请求获取一次数据
      this.getCourseList()
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

    // 点击按钮，添加课程
    newCourse () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            let para = Object.assign({}, this.addForm)
            para.teacherId = JSON.parse(localStorage.getItem('user')).userId
            console.log(para)
            addCourse(para).then((res) => {
              // eslint-disable-next-line eqeqeq
              if (res.code == 200) {
                this.addLoading = false
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.addFormVisible = false
                this.getCourseList()
              }
            })
          })
        }
      })
    },
    // 添加学生
    addStudent (index, row) {
      this.courseId = row.courseId
      this.courseName = row.courseName
      this.addStudentVisible = true
      findStudents(row).then((res) => {
        this.originStudents = res.data
      })
      getStudentInCourse(row).then((res) => {
        this.newStudents = res.data
      })
    },
    // 移除学生
    moveStudent (index, row) {
      this.$confirm('确认移出吗？').then(() => {
        let para = {courseId: row.courseId, studentId: row.studentId}
        moveStudentFromCourse(para).then((res) => {
          this.$message.success('操作成功！')
          getStudentInCourse(row).then((res) => {
            this.newStudents = res.data
          })
          findStudents(row).then((res) => {
            this.originStudents = res.data
          })
        })
      })
    },
    // 点击按钮添加学生
    handleAddStudent (index, row) {
      console.log(row)
      let para = {courseId: this.courseId, courseName: this.courseName, courseStudents: [{studentId: row.userId, studentName: row.realName}]}
      this.addLoading = true
      console.log(para)
      addCourseStudents(para).then((res) => {
        if (res.code == '200') {
          getStudentInCourse({courseId: this.courseId}).then((res) => {
            this.newStudents = res.data
          })
          findStudents({courseId: this.courseId}).then((res) => {
            this.originStudents = res.data
          })
          this.$message.success('添加成功')
          this.getCourseList()
          this.addLoading = false
        }
      })
    },
    handleSelectionStudent (val) {
      this.studentSels = val
    },
    deleteBatchStudent (val) {
      this.studentDelSels = val
    },
    // 批量添加学生
    batchAddStudent () {
      let para = {courseId: this.courseId, courseName: this.courseName, courseStudents: []}
      for (let i = 0; i < this.studentSels.length; i++) {
        para.courseStudents.push({
          studentId: this.studentSels[i].userId,
          studentName: this.studentSels[i].realName
        })
      }
      addCourseStudents(para).then((res) => {
        if (res.code == '200') {
          getStudentInCourse({courseId: this.courseId}).then((res) => {
            this.newStudents = res.data
          })
          findStudents({courseId: this.courseId}).then((res) => {
            this.originStudents = res.data
          })
          this.$message.success('添加成功')
          this.getCourseList()
          this.addLoading = false
        }
      })
    },
    // 批量删除学生
    batchDelStudents () {
      let para = {courseId: this.courseId, courseStudents: []}
      for (let i = 0; i < this.studentDelSels.length; i++) {
        para.courseStudents.push({
          studentId: this.studentDelSels[i].studentId
        })
      }
      this.$confirm('确认移除吗？').then(() => {
        deleteBatchStu(para).then((res) => {
          if (res.code == '200') {
            this.$message.success('移除成功')
            getStudentInCourse({courseId: this.courseId}).then((res) => {
              this.newStudents = res.data
            })
            findStudents({courseId: this.courseId}).then((res) => {
              this.originStudents = res.data
            })
          }
        })
      })
    },
    // 添加老师
    addTeachers (index, row) {
      this.courseId = row.courseId
      this.courseName = row.courseName
      findTeachers(row).then((res) => {
        this.originTeachers = res.data
      })
      getCourseTeachers(row).then((res) => {
        this.newTeachers = res.data
      })
      this.addTeacherVisible = true
    },
    // 点击按钮添加老师
    handleAddTeacher (index, row) {
      let para = {courseId: this.courseId,
        teacherId: JSON.parse(localStorage.getItem('user')).userId,
        courseName: this.courseName,
        courseTeachers: [{teacherId: row.userId, teacherName: row.realName}]}
      this.addLoading = true
      addCourseTeachers(para).then((res) => {
        if (res.code == '200') {
          this.addLoading = false
          findTeachers({courseId: this.courseId}).then((res) => {
            this.originTeachers = res.data
          })
          getCourseTeachers({courseId: this.courseId}).then((res) => {
            this.newTeachers = res.data
          })
          this.$message.success('添加成功')
          this.getCourseList()
        }
      })
    },
    //
    handleSelectionTeacher (val) {
      this.teacherSels = val
    },
    // 批量添加老师
    batchAddTeacher () {
      this.$confirm('确认添加吗？').then(() => {
        let para = {courseId: this.courseId,
          courseName: this.courseName,
          teacherId: JSON.parse(localStorage.getItem('user')).userId,
          courseTeachers: []}
        for (let i = 0; i < this.teacherSels.length; i++) {
          para.courseTeachers.push({
            teacherId: this.teacherSels[i].userId,
            teacherName: this.teacherSels[i].realName
          })
        }
        addCourseTeachers(para).then((res) => {
          if (res.code == '200') {
            this.$message.success('添加成功')
            findTeachers({courseId: this.courseId}).then((res) => {
              this.originTeachers = res.data
            })
            getCourseTeachers({courseId: this.courseId}).then((res) => {
              this.newTeachers = res.data
            })
            this.getCourseList()
          }
        })
      })
    },
    // 移除老师
    moveTeachers (index, row) {
      this.$confirm('确认移除吗？', '提示').then(() => {
        let para = {courseId: this.courseId, courseTeachers: [{teacherId: row.teacherId}]}
        moveTeacher(para).then((res) => {
          this.$message.success(res.msg)
          findTeachers({courseId: this.courseId}).then((res) => {
            this.originTeachers = res.data
          })
          getCourseTeachers({courseId: this.courseId}).then((res) => {
            this.newTeachers = res.data
          })
          this.getCourseList()
        })
      })
    },
    //
    handleChange (value) {
      // value是一个存放key值的数组
      this.teacherDelSels = value
    },
    // 批量删除老师
    batchDelTeachers () {
      this.$confirm('确认移除这些老师吗？', '提示').then(() => {
        let para = {courseId: this.courseId, courseTeachers: []}
        for (let i = 0; i < this.teacherDelSels.length; i++) {
          para.courseTeachers.push({
            teacherId: this.teacherDelSels[i].teacherId
          })
        }
        moveTeacher(para).then((res) => {
          this.$message.success(res.msg)
          findTeachers({courseId: this.courseId}).then((res) => {
            this.originTeachers = res.data
          })
          getCourseTeachers({courseId: this.courseId}).then((res) => {
            this.newTeachers = res.data
          })
          this.getCourseList()
        })
      })
    },
    // 课程详情
    handleEdit: function (index, row) {
      let para = Object.assign({}, row)
      this.$router.push({ path: '/courseDetail', query: {courseId: para.courseId, courseName: para.courseName} })
    },
    // 删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该课程吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        let para = {courseId: row.courseId}
        console.log(row.courseId)
        removeCourse(para).then((res) => {
          if (res.code == '200') {
            this.listLoading = false
            // NProgress.done();
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.getCourseList()
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
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        let para = []
        for (let i = 0; i < this.sels.length; i++) {
          para[i] = this.sels[i].courseId
        }
        batchRemoveCourse(para).then((res) => {
          if (res.code == '200') {
            this.listLoading = false
            // NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getCourseList()
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
