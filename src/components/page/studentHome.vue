<template>
<div class="container">
    <!-- 面包屑导航区域 -->
    <div class="crumb">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 5px">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>案例详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>

    <div class="course">
        <h2 style="position: relative;text-align: center;">已加入课程</h2>
        <el-table
        :data="addedCourse"
        style="width: 80%;margin-left: 10%"
        :header-cell-style="{background:'#F5F6FA',color:'#666E92'}"
        v-loading="listLoading1"
        border>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="courseName" label="已加入课程" align="center"></el-table-column>
            <el-table-column prop="creatTeacher" label="创建老师" align="center"></el-table-column>
            <el-table-column prop="courseState" label="课程状态" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary"  size="mini" @click="handleDetail(scope.$index, scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="course">
        <h2 style="position: relative;text-align: center;">未加入课程</h2>
        <el-table
            :data="allCourses"
            style="width: 80%;margin-left: 10%"
            :header-cell-style="{background:'#F5F6FA',color:'#666E92'}"
            v-loading="listLoading2"
            border>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="courseName" label="未加入课程" align="center"></el-table-column>
            <el-table-column prop="creatTeacher" label="创建老师" width="200px" align="center"></el-table-column>
            <el-table-column prop="courseState" label="课程状态" width="200px"  align="center"></el-table-column>
            <el-table-column label="操作" width="250px" align="center">
                <template slot-scope="scope">
                    <el-button type="primary"  size="mini" @click="handleDetail(scope.$index, scope.row)">查看详情</el-button>
                    <el-button type="primary"  size="mini" @click="handleAdd(scope.$index, scope.row)">加入课程</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

</div>
</template>

<script>
import {addCoursePost, findAddedCourse, findOtherCourse} from '../../api/api'

export default {
  name: 'studentHome',
  data () {
    return {
      addedCourse: [],
      allCourses: [],
      listLoading1: false,
      listLoading2: false
    }
  },
  created () {
    this.addedCourses()
    this.otherCourses()
  },
  methods: {
    addedCourses () {
      let para = {studentId: JSON.parse(localStorage.getItem('user')).userId}
      this.listLoading1 = true
      findAddedCourse(para).then((res) => {
          console.log(res)
        if (res.code == '200') {
          this.listLoading1 = false
          this.addedCourse = res.data
        }
      })
    },
    otherCourses () {
      let para = {studentId: JSON.parse(localStorage.getItem('user')).userId}
      this.listLoading2 = true
      findOtherCourse(para).then((res) => {
        if (res.code == '200') {
          this.listLoading2 = false
          this.allCourses = res.data
        }
      })
    },
    handleDetail (index, row) {
      let para = Object.assign({}, row)
      this.$router.push({ path: '/studentCourseDetail', query: {courseId: para.courseId} })
    },
    handleAdd (index, row) {
      let para = {courseName: row.courseName,
        courseId: row.courseId,
        studentId: JSON.parse(localStorage.getItem('user')).userId,
        studentName: JSON.parse(localStorage.getItem('user')).userName
      }
      this.listLoading2 = true
      addCoursePost(para).then((res) => {
        if (res.code == '200') {
          this.listLoading2 = false
          this.$message.success('请求发送成功，请等待老师审核')
        } else {
          this.listLoading2 = false
          this.$message.error('请求发送失败，请重试！')
        }
      })
    }
  }
}
</script>

<style scoped>
.container{
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
.course{
    float: left;
    width: 100%;
    box-sizing: border-box;
}
.layout {
    /*border: 1px solid #2ea4fe;*/
}
</style>
