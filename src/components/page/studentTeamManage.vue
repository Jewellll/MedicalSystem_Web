<template>
    <div class="container">
        <!-- 面包屑导航区域 -->
        <div class="crumb">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 5px">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>案例管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div align="center" style="font-size: 40px;" v-text="$route.query.name+'团队管理'"></div>
        <!-- 列表区域 -->
        <div class="table">
            <!-- 搜索与添加区域 -->
            <div class="toolbar">
                <el-row :gutter="20">
                    <el-col :span="2">
                        <el-button type="primary" @click="addTeamVisible=true">创建团队</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="teamList" :stripe="true" :border="true"
                      :header-cell-style="{background:'#F5F6FA',color:'#666E92'}" style="width: 50%; margin-left: 25%" >
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="team_id" label="团队编号" width="100px" align="center"></el-table-column>
                <el-table-column prop="members" label="成员" width="300px" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary"  size="mini" @click="handleTeam(scope.$index, scope.row)">管理</el-button>
                        <el-button type="danger"  size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
<!--            创建团队页面-->
                <el-dialog width="60%"
                           title="创建团队"
                           :visible.sync="addTeamVisible">
                    <el-form label-width="100px"
                             :model="addForms">
                        <el-form-item label="团队编号" prop="team_id">
                            <el-input v-model="addForm.team_id"></el-input>
                        </el-form-item>
                        <el-form-item label="请选择学生" prop="students">
                            <el-transfer
                                style="text-align: left; display: inline-block"
                                v-model="addForm.members"
                                filterable
                                :render-content="renderFunc"
                                :titles="['Source', 'Target']"
                                :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
                                @change="handleChange"
                                :data="addForm.students">
                            </el-transfer>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="addTeamVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="addTeam" :loading="addLoading">提交</el-button>
                    </div>
                </el-dialog>
<!--            管理页面-->
       <el-dialog
           title="管理团队"
           width="60%"
           :visible.sync="editTeamVisible">
            <el-form
                :model="editTeam"
                label-width="100px">
                <el-form-item label="团队编号" prop="team_id">
                    <el-input v-model="editTeam.team_id"></el-input>
                </el-form-item>
                <el-table
                    class="dicTable"
                    :data="editTeam.members"
                    border>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="studentname" label="学生"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="danger"  size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button @click="addRow">添加</el-button>
            </el-form>
       </el-dialog>

    </div>
</template>

<script>
export default {
  name: 'studentTeamManage',
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
      addTeamVisible: false,
      editTeamVisible: false,
      addLoading: false,
      editLoading: false,
      teamList: [],
      addForm: {team_id: '',
        students: [{key: '1', label: 'a'},
          {key: '2', label: 'b'},
          {key: '3', label: 'c'}],
        members: []
      },
      editTeam: {
        team_id: '',
        members: [{id: '', studentname: ''}]
      }

    }
  },
  methods: {
    addTeam (index, row) {
      // courseId从课程详情页面获取
      let para = {courseId: this.$route.query.courseId, team_id: this.addForm.team_id}
      console.log(this.addForm.members)
    },
    addRow () {
      let para = {id: '', studentname: ''}
      this.editTeam.members.push(para)
    },
    handleTeam (index, row) {
      this.editTeamVisible = true
      this.editTeam = Object.assign({}, row)
    },
    handleDel (index, row) {
      this.editTeam.members.splice(index, 1)
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
.dicTable{
    width: 60%;
    font-size: 14px;
    align: center;
    margin-left: 5%;
}
</style>
