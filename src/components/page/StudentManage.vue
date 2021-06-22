<template>
    <div class="container">
        <section>
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-bottom: 10px">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.name" placeholder="姓名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="getstudents">查询</el-button>
                    </el-form-item>
<!--                    <el-form-item>-->
<!--                        <el-button type="primary" @click="handleAdd">新增</el-button>-->
<!--                    </el-form-item>-->
                </el-form>
            </el-col>

            <!--列表-->
            <el-table :data="students" :header-cell-style="{background:'#F5F6FA',color:'#666E92'}"
                      :row-style="{height:'25px'}" :cell-style="{padding:'1px'}" border
                      highlight-current-row v-loading="listLoading" @selection-change="selsChange" class="table">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="student_id" label="学生ID" width="150" sortable>
                </el-table-column>
                <el-table-column prop="studentname" label="姓名" width="150" sortable>
                </el-table-column>
                <el-table-column prop="sex" label="性别" width="150" :formatter="formatSex" sortable>
                </el-table-column>
                <el-table-column prop="grade" label="年级" width="100" sortable>
                </el-table-column>
                <el-table-column prop="department" label="科室" sortable>
                </el-table-column>
                <el-table-column prop="phone" label="电话" >
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleTeam(scope.$index, scope.row)">加入团队</el-button>
                        <el-button size="small" @click="handleCourse(scope.$index, scope.row)">加入课程</el-button>
                        <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--工具条-->
            <el-col :span="24" class="toolbar2">
                <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0"
                           style="position: relative;left: -450px ">批量删除
                </el-button>
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="6"
                               :total="total" style="float:right;">
                </el-pagination>
            </el-col>

            <!--加入团队界面-->
            <el-dialog title="加入团队" :visible.sync="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                    <el-form-item label="学号" prop="studentId">
                        <el-input v-model="editForm.studentId" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="editForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="学校" prop="school">
                        <el-input v-model="editForm.school" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="班课" prop="class">
                        <el-input v-model="editForm.class" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
                </div>
            </el-dialog>

            <!--新增界面-->
            <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
                <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                    <el-form-item label="学号" prop="studentId">
                        <el-input v-model="addForm.student_id" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="addForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="学校" prop="school">
                        <el-input v-model="addForm.school" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="班课" prop="class">
                        <el-input v-model="addForm.class" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                </div>
            </el-dialog>
        </section>
    </div>
</template>

<script>
import {
  addStudent,
  batchRemoveStudent,
  editStudent,
  getStudentListPage,
  removeStudent
} from '../../api/api'
import util from '../../common/js/util'

export default {
  name: 'StudentManage',
  data () {
    return {
      filters: {
        name: '' // 需要查询的名字
      },
      students: [{student_id:111}],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], // 列表选中列

      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ]
      },
      // 编辑界面数据
      editForm: {
        student_id: 0,
        studentname: '',
        sex: -1,
        grade: '',
        department: '',
        phone: ''
      },

      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        studentname: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ]
      },
      // 新增界面数据
      addForm: {
        studentname: '',
        sex: -1,
        grade: '',
        department: '',
        phone: ''
      }

    }
  },
  methods: {
    // 翻页
    handleCurrentChange (val) {
      this.page = val
      this.getstudents()
    },
    // 获取用户列表
    getstudents () {
      let para = {
        page: this.page,
        name: this.filters.name
      }
      this.listLoading = false
      getStudentListPage(para).then((res) => {
        this.total = res.data.total
        this.students = res.data.students
        this.listLoading = false
        // NProgress.done();
      })
    },
    // 删除
    handleDel: function (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        let para = {id: row.id}
        removeStudent(para).then((res) => {
          this.listLoading = false
          // NProgress.done();
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getstudents()
        })
      }).catch(() => {

      })
    },
    // 显示加入团队界面
    handleTeam: function (index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    handleCourse (index, row) {

    },
    // 显示新增界面
    handleAdd: function () {
      this.addFormVisible = true
      this.addForm = {
        name: '',
        sex: -1,
        age: 0,
        birth: '',
        addr: ''
      }
    },
    // 编辑
    editSubmit: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            // NProgress.start();
            let para = Object.assign({}, this.editForm)
            para.birth = (!para.birth || para.birth === '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd')
            editStudent(para).then((res) => {
              this.editLoading = false
              // NProgress.done();
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getstudents()
            })
          })
        }
      })
    },
    // 新增
    addSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            let para = Object.assign({}, this.addForm)
            para.birth = (!para.birth || para.birth === '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd')
            addStudent(para).then((res) => {
              this.addLoading = false
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getstudents()
            })
          })
        }
      })
    },
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
        batchRemoveStudent(para).then((res) => {
          this.listLoading = false
          // NProgress.done();
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getstudents()
        })
      }).catch(() => {

      })
    }
  },
  mounted () {
    this.getstudents()
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

.toolbar {
    width: 100%;
    background-color: #f1f1f1;
    margin-right: 10px;
    padding-top: 10px;
    padding-left: 0px;
    height: 60px;
}

.toolbar2 {
    width: 100%;
    margin-top: 10px;
    background-color: #f1f1f1;
    margin-right: 10px;
    padding-top: 10px;
    padding-left: 0px;
    height: 60px;
}

.table {
    width: 100%;
    height: 405px;
}

</style>
