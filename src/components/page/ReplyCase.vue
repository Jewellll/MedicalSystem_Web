<template>
    <div class="container">
        <!-- 面包屑导航区域 -->
        <div class="crumb">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 5px">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>回复案例</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="caseView layout">
            <div class="case layout">
                <h1 style="position: relative;left: -35%;">简要病史</h1>
                <div class="box">
                    <el-scrollbar>
                        <p>{{this.case.caseDesc}}</p>
<!--                        <p>患者，女，33岁</p>-->
<!--                        <p>主诉：左髋部肿物伴疼痛4月余</p>-->
<!--                        <p>既往史：2013年直肠腺癌，术前短程快速放疗（共DT3900CGY/13F）；2018年左髋部疼痛，复查MRI股骨头颈及大小转子占位性病变，活检病理“疑癌”。2019年左髋关节病理性骨折，2019年5月外院行“人工左髋关节置换术”，外院病理示“骨脂肪硬化性纤维黏液瘤”；</p>-->
<!--                        <p>影像学：2019年12月MRI显示：左髋关节置换术后，左侧髂骨翼、左髋人工关节周围软组织多发占位，考虑恶性肿瘤，转移瘤可能大，2020年1月转诊我院</p>-->
<!--                        <p>2020年3月我院胸部CT平扫：左肺及右肺中叶多发小结节</p>-->
<!--                        <p>2020年3月行左上肺肿物切除术</p>-->
<!--                        <p>2020年4月行左髋外侧肿块切除术</p>-->
<!--                        <p>女，10岁，发现左侧大腿根部内侧肿物。</p>-->
<!--                        <p><b>免疫组化:</b></p>-->
<!--                        <p>阳性指标（FLI-1、CD99、NKX2.2、KI67）</p>-->
<!--                        <p>阴性指标（CK、Vimentin、LCA、MPO、TdT、Desmin、CD56、TLE-1、S100、CD3、CD20）</p>-->
                    </el-scrollbar>
                </div>
            </div>
            <div class="caseImg layout">
                <h1 style="position: relative;left: -25%">病例图片</h1>
                <div class="demo-image__lazy">
                    <el-scrollbar>
                        <template v-if="urls.length==0">
                            <div>暂无图片</div>
                        </template>
                        <template v-else>
                        <el-image
                            v-for="url in urls" :key="url" lazy
                            style="width: 250px; height: 250px;margin-right: 5px"
                            :src="url"
                            :preview-src-list="srcList">
                        </el-image>
                        </template>
                    </el-scrollbar>
                </div>
            </div>
        </div>

        <div class="inter layout">
            <div class="interBox">
            <el-divider></el-divider>
            <div class="file1 layout">
                <h2 style="position: relative;left: -40%">附件</h2>
                <el-table style="width:70%;left: 15%" :data="fileList1" :stripe="true" :border="true" v-loading="listLoading" size="small"
                          :header-cell-style="{background:'#F5F6FA',color:'#666E92'}">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="fileName" label="文件名"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <!-- 修改按钮 -->
                            <el-button type="primary" icon="el-icon-download" size="mini" @click="download(scope.$index, scope.row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete"  size="mini" @click="handleDel(scope.$index, scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="upload1">
                    <el-upload
                        :headers="headers"
                        class="upload-demo"
                        :action=upload
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :multiple="true"
                        :limit="3"
                        :on-exceed="exceedFile"
                        :file-list="fileList">
                        <el-button size="middle" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip" style="color:#c1c1c1">
                            支持扩展名：.rar .zip .doc .docx .pdf .jpg... <br>诊断结果以文本形式提交，治疗方案以word、pdf、ppt形式提交
                        </div>
                    </el-upload>
                </div>
            </div>

            <div class="question layout">
                <h2 style="position: relative;left: -40%">思考</h2>
                <div class="think">
                    <el-scrollbar>
                        <p>{{this.case.thinking}}</p>
<!--                        <p>1、影像学磁共振表现？</p>-->
<!--                        <p>2、最常见放疗后差分化梭形细胞肉瘤</p>-->
<!--                        <p>3、放疗后血管肉瘤病理诊断标准</p>-->
                    </el-scrollbar>
                </div>
            </div>
            </div>
            <el-divider></el-divider>
            <div class="comment layout">
                <div class="comment-box">
                <Comment @func="getPage" :total="total" :comments="commentData" :caseId="caseId" :getComments="getComments"></Comment>
                </div>
            </div>
        </div>

        <!-- 卡片视图区域 -->

    </div>
</template>

<script>
import {
    getCaseDetailFile,
    getCommentList,
    getReplyCaseDetail,
    getReplyCaseImg,
    getTeacherListPage,
    removeCourse, removeTeacherFile
} from '../../api/api'
// import {comments} from '../../mock/mockdata'
import Comment from './Comment'
import http from '../../store/http'

export default {
    components: {
        Comment
    },
    data () {
        return {
            headers: { Authorization: localStorage.getItem('token') },
            limitNum: 3,
            fileList: [],
            fileList1:[],
            urls: [
                // require('../../assets/img/CaseImg/Case02-1.png'),
                // require('../../assets/img/CaseImg/Case02-2.png'),
                // require('../../assets/img/CaseImg/Case02-3.png'),
                // require('../../assets/img/CaseImg/Case02-4.png'),
                // require('../../assets/img/CaseImg/Case02-5.png'),
                // require('../../assets/img/CaseImg/Case02-6.png'),
                // require('../../assets/img/CaseImg/Case02-7.png'),
                // require('../../assets/img/CaseImg/Case02-8.png'),
                // require('../../assets/img/CaseImg/Case02-9.png'),
                // require('../../assets/img/CaseImg/Case02-10.png')
            ],
            srcList: [
                // require('../../assets/img/CaseImg/Case02-1.png'),
                // require('../../assets/img/CaseImg/Case02-2.png'),
                // require('../../assets/img/CaseImg/Case02-3.png'),
                // require('../../assets/img/CaseImg/Case02-4.png'),
                // require('../../assets/img/CaseImg/Case02-5.png'),
                // require('../../assets/img/CaseImg/Case02-6.png'),
                // require('../../assets/img/CaseImg/Case02-7.png'),
                // require('../../assets/img/CaseImg/Case02-8.png'),
                // require('../../assets/img/CaseImg/Case02-9.png'),
                // require('../../assets/img/CaseImg/Case02-10.png')
            ],
            case:{
                caseDesc:'',
                thinking:'',
            },
            // 附件
            commentData: [],
            caseId: '',
            upload:'',
            pagenum:0,
            pagesize:0,
            total:0
        }
    },
    created () {
        this.getParams()
        this.getUserList()
        this.getFileList()
        this.getCaseImg ()
        this.getComments()

    },
    methods: {
        getParams(){
            this.caseId=this.$route.query.caseId
            this.upload='http://172.17.169.0:8081/case/uploadFiletoCases?caseId='+this.caseId
            console.log(this.caseId)
        },
        async getUserList () {
            const param={caseId:this.caseId}
            getReplyCaseDetail(param).then((res) => {
                console.log(res)
                this.case= res.data
            })
        },
        async getFileList () {
            // this.listLoading = true
            const param={caseId:this.caseId}
            this.fileList1=[]
            console.log(param)
            getCaseDetailFile(param).then((res) => {
                if(res.code==='200') {
                    console.log(res)
                    for (var i = 0; i < res.data.length; i++) {
                        var item = {fileId: 0, fileName: '', realName: '', caseName: '', creatTime: ''}
                        const name = res.data[i].fileUrl.substring(res.data[i].fileUrl.lastIndexOf('/') + 1)
                        console.log(res.data[i].fileUrl.substring(res.data[i].fileUrl.lastIndexOf('/') + 1))
                        item.fileName = name
                        item.fileId = res.data[i].id
                        this.fileList1.push(item)
                    }
                    this.listLoading = false
                }else if(res.code==='303'){
                    console.log(res)
                    this.listLoading = false
                }
            })
        },
        async getCaseImg () {
            this.listLoading = true
            const param={caseId:this.caseId}
            getReplyCaseImg(param).then((res) => {
                    console.log(res)
                    var img = []
                    for (var i = 0; i < res.data.length; i++) {
                        img.push('data:image/jpeg;base64,' + res.data[i].imagebase)
                    }
                    this.urls = img
                    this.srcList = img
            })
        },
        //评论
        async getComments () {
            var param= {caseId:this.caseId}
            getCommentList(param).then((res) => {
                console.log(res)
                this.total=Number(res.data.length)
                this.commentData = res.data.slice((this.pagenum-1)*this.pagesize,this.pagenum*this.pagesize)
            })
        },
        getPage(data){
            console.log(11)
            this.pagenum=data.pagenum
            this.pagesize=data.pagesize
        },
        //下载
        download: function (index, row) {
            var param = Object.assign({}, row)
            const params= {id:param.fileId}
            console.log(params)
            const url="/case/downloadFileFromCasesbyid/"+params.id
            const options = {fileId:param.fileId}
            this.exportExcel(url,options,param.fileName)
        },
        exportExcel(url, options = {},fileName) {
            return new Promise((resolve, reject) => {
                console.log(`${url} 请求数据，参数=>`, JSON.stringify(options))
                http.defaults.headers['content-type'] = 'application/json;charset=UTF-8'
                http({
                    method: 'post',
                    url: url, // 请求地址
                    data: options, // 参数
                    responseType: 'blob' // 表明返回服务器返回的数据类型
                }).then(
                    res => {
                        console.log(res)
                        console.log("这是下载的接口res", res.data);
                        var blob = new Blob([res.data], {
                            type: "application/octet-stream;chartset=UTF-8"
                        });
                        var url = window.URL.createObjectURL(blob);
                        var a = document.createElement("a");
                        a.href = url;
                        //文件名
                        a.download = fileName;
                        a.click();
                    },
                    err => {
                        reject(err)
                    }
                )
            })
        },
        //删除文件
        handleDel: function (index, row) {
            this.$confirm('确认删除该附件吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true
                let para = {id: row.fileId}
                console.log(row.fileId)
                removeTeacherFile(para).then((res) => {
                    console.log(res)
                    if (res.code == '200') {
                        this.listLoading = false
                        console.log(res)
                        this.getFileList()
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        })
                    }else if(res.code==='205'){
                        this.$message.error(res.msg)
                    }
                })
            }).catch(() => {

            })
        },
        // 文件超出个数限制时的钩子
        exceedFile(files, fileList) {
            this.$notify.warning({
                title: '警告',
                message: `只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`
            });
        },
        // 文件上传成功时的钩子
        handleSuccess(res, file, fileList) {
            this.getFileList()
            this.$notify.success({
                title: '成功',
                message: `文件上传成功`
            });
        },
        // 文件上传失败时的钩子
        handleError(err, file, fileList) {
            this.$notify.error({
                title: '错误',
                message: `文件上传失败`
            });
        },
        handleRemove (file, fileList) {
            this.$refs.pictureUpload.handleRemove(file)
        },
        // 预览下载文件
        handlePreview (file) {
            console.log(file)
            var url='http://172.17.169.0:8081/sfile/downloadFile?fileId'+ file.id
            var link = document.createElement('a');
            try {
                link.href  = url;} catch (error) {
                link.href  = window.URL.createObjectURL(url);}
            link.click();
            // var a = document.createElement('a')
            // var event = new MouseEvent('click')
            // console.log(file)
            // a.download = file.name
            // a.href = file.url
            // a.dispatchEvent(event)
            // console.log(file.url)
        },
        beforeRemove (file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`)
        }
    }
}
</script>

<style scoped>
/*案例图片*/
.demo-image__lazy {
    margin-left: 2.6em;
    height: 500px;
    width: 85%;
}

.demo-image__lazy >>> .el-scrollbar__wrap {
    overflow: scroll;
    width: 110%;
    height: 104%;
}

/*案例简述*/
.box {
    border-radius: 2px;
    position: relative;
    padding-right: 5px;
    left: 5%;
    width: 90%;
    height: 70%;
    border: 1px solid #c1c1c1;
    background: #f6f4f4;
}
.box p {
    left: 1em;
    line-height: 2em;
    position: relative;
    width: 90%;
    text-align: justify;
    text-indent: 2em;
    font-size: 16px;
}
.el-scrollbar {
    height: 100%;
}

.box >>> .el-scrollbar__wrap {
    overflow: scroll;
    width: 110%;
    height: 120%;
}
/*思考*/
.think p{
    position: relative;
    left: 7%;
    width: 80%;
    text-align: justify;
    text-indent: 2em;
    font-size: 16px;
}
.think {
    border-radius: 2px;
    position: relative;
    left: 10%;
    width: 80%;
    height: 70%;
    border: 1px solid #c1c1c1;
    background: #f6f4f4;
}
.think >>> .el-scrollbar__wrap {
    overflow: scroll;
    width: 110%;
    height: 120%;
}

/*上传*/
.upload1 {
    box-sizing: border-box;
     margin-top: 3em;
}

.upload2 {
    margin-top: 50px;
}

/*评论*/

.comment-box{
    position: relative;
    left: 15%;
    width: 70%;
}
/*布局*/
.el-divider{
    margin: 8px 0;
    background: 0 0;
    border-top: 2px solid #E6EBF5;
}
.divider1{
    margin: 8px 0;
    background: 0 0;
    border-top: 3px dashed #E6EBF5;
}
.layout {
    /*border: 1px solid #2ea4fe;*/
}

.container {
    margin-top: 8px;
    margin-left: 10px;
    margin-right: 10px;
    padding: 10px 10px;
    background-color: #fffefe;
    height: 100%;
    border-radius: 5px;
}

.crumb {
    margin-left: 2px;
}

.caseView {
    height: 700px;
}

.case {
    float: left;
    width: 50%;
    box-sizing: border-box;
    height: 700px;
}

.caseImg {
    width: 50%;
    box-sizing: border-box;
    float: left;
    height: 700px;
}



.inter {
    box-sizing: border-box;
    height: 100%;
}
.interBox{
    height: 100%;
}
.file1{
    width: 50%;
    margin: 0px;
    height: 600px;
    float: right;
    box-sizing: border-box;
}
.question {
    width: 50%;
    margin: 0px;
    height: 600px;
    box-sizing: border-box;
}
.comment {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    margin: 0px;
}
</style>
