<template>
    <div class="container">
        <!-- 面包屑导航区域 -->
        <div class="crumb">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 5px">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>查看提交文件</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- 卡片视图区域 -->
        <div class="table">
            <!-- 搜索与添加区域 -->
            <div class="toolbar">
                <el-row :gutter="20">
<!--                    <el-col :span="8">-->
<!--                        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList()">-->
<!--                            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>-->
<!--                        </el-input>-->
<!--                    </el-col>-->
<!--                    <el-col :span="2">-->
<!--                        <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
<!--                    </el-col>-->
                </el-row>
            </div>
            <el-table :data="fileList" :stripe="true" :border="true" v-loading="listLoading" @selection-change="selsChange"
                      :header-cell-style="{background:'#F5F6FA',color:'#666E92'}">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="caseId" label="案例号"></el-table-column>
                <el-table-column prop="imageName" label="文件名"></el-table-column>
                <el-table-column prop="creatTime" label="提交时间"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
<!--                        <el-button type="primary" icon="el-icon-download" size="mini" @click="download(scope.$index, scope.row)"></el-button>-->
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDel(scope.$index, scope.row)"></el-button>
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
    batchRemoveTeacher,
    editTeacher, getCaseFile, getCaseImage, removeImage, removeStudentFile,
    removeTeacher
} from '../../api/api'
import axios from 'axios'
import http from '../../store/http'

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
                pagesize: 5,
                caseId:-1
            },
            // 获取的用户列表
            fileList: [],
            sels: [],//列表选中列
            // 总数
            total: 0,
            //列表加载
            listLoading:false,
        }
    },
    created () {
        this.getParams()
        this.getUserList()
    },
    methods: {
        getParams(){
            console.log(this.$route.query.caseId)
            this.queryInfo.caseId=this.$route.query.caseId
            console.log(this.queryInfo.caseId)
        },
        async getUserList () {
            this.listLoading=true
            var param ={caseId:this.queryInfo.caseId,pageNum:this.queryInfo.pagenum,pageSize:this.queryInfo.pagesize}
            getCaseImage(param).then((res) => {
                console.log(res)
                if(res.code==='200') {
                    this.fileList = res.data
                    this.listLoading = false
                    this.total=res.data.length
                }
            })
        },
        // 监听 pageSize 改变的事件
        handleSizeChange (newSize) {
            //   console.log(newSize)
            //  将监听接受到的每页显示多少条的数据 newSzie 赋值给 pagesize
            this.queryInfo.pagesize = newSize
            //  修改完以后，重新发起请求获取一次数据
            this.getUserList()
        },
        // 监听 页码值  改变的事件
        handleCurrentChange (newPage) {
            //   console.log(newPage)
            //  将监听接受到的页码值的数据 newPage 赋值给 pagenum
            this.queryInfo.pagenum = newPage
            //  修改完以后，重新发起请求获取一次数据
            this.getUserList()
        },
        // //下载
        // download: function (index, row) {
        //     const param = Object.assign({}, row)
        //     console.log(param.fileId)
        //     const params= {fileId:param.fileId}
        //     console.log(params)
        //     const url="/sfile/downloadFile/"+params.fileId
        //     const options = {fileId:param.fileId}
        //     this.exportExcel(url,options,param.fileName)
        // },
        // exportExcel(url, options = {},fileName) {
        //     return new Promise((resolve, reject) => {
        //         console.log(`${url} 请求数据，参数=>`, JSON.stringify(options))
        //         http.defaults.headers['content-type'] = 'application/json;charset=UTF-8'
        //         http({
        //             method: 'post',
        //             url: url, // 请求地址
        //             data: options, // 参数
        //             responseType: 'blob' // 表明返回服务器返回的数据类型
        //         }).then(
        //             res => {
        //                 console.log("这是下载的接口res", res.data);
        //                 var blob = new Blob([res.data], {
        //                     type: "application/octet-stream;chartset=UTF-8"
        //                 });
        //                 console.log("这是blob", blob);
        //                 var url = window.URL.createObjectURL(blob);
        //                 var a = document.createElement("a");
        //                 a.href = url;
        //                 //文件名
        //                 a.download = fileName;
        //                 a.click();
        //             },
        //             err => {
        //                 reject(err)
        //             }
        //         )
        //     })
        // },
        //删除
        handleDel: function (index, row) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true
                console.log(row)
                let para = {id: row.id}
                removeImage(para).then((res) => {
                    console.log(res)
                    if(res.code==='200') {
                        this.listLoading = false
                        //NProgress.done();
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        })
                        this.getUserList()
                    }
                })
            }).catch(() => {

            })
        },
        //选择多行
        selsChange: function (sels) {
            this.sels = sels
        },
        //批量删除
        batchRemove: function () {
            var ids = this.sels.map(item => item.id).toString()
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true
                let para = {ids: ids}
                batchRemoveTeacher(para).then((res) => {
                    if(res.code==200) {
                        this.listLoading = false
                        //NProgress.done();
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
