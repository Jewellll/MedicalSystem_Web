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
        border>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="courseName" label="已加入课程" align="center"></el-table-column>
            <el-table-column prop="teacherName" label="创建老师" align="center"></el-table-column>
            <el-table-column prop="state" label="课程状态" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary"  size="mini" @click="handleDetail(scope.$index, scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="allCourses">
        <h2 style="position: relative;text-align: center;">未加入课程</h2>
        <el-table
            :data="allCourses"
            style="width: 90%;margin-left: 5%"
            :header-cell-style="{background:'#F5F6FA',color:'#666E92'}"
            border>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="courseName" label="未加入课程" align="center"></el-table-column>
            <el-table-column prop="teacherName" label="创建老师" align="center"></el-table-column>
            <el-table-column prop="state" label="课程状态" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
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
export default {
  name: 'studentHome',
  data () {
    return {
      addedCourse: [],
      allCourses: []
    }
  },
  created () {
    this.addedCourses()
    this.otherCourses()
  },
  methods: {
    addedCourses () {
      let para = {studentId: JSON.parse(localStorage.getItem('user')).userId}

    },
    otherCourses () {

    },
    handleDetail (index, row) {
      let para = Object.assign({}, row)
      this.$store.commit('setCourseName', para.courseName)
      this.$router.push({ path: '/studentCourseDetail', query: {} })
    },
    handleAdd (index, row) {

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
    width: 50%;
    box-sizing: border-box;
    height: 700px;
}
.layout {
    /*border: 1px solid #2ea4fe;*/
}
.allCourses{
    float: left;
    width: 50%;
    box-sizing: border-box;
}
</style>
