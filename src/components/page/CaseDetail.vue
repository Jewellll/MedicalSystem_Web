<template>
    <div class="container">
        <!-- 面包屑导航区域 -->
        <div class="crumb">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 5px">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>案例详情</el-breadcrumb-item>
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
            <div class="caseImg">
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
            <el-divider></el-divider>
            <div class="comment layout">
                <Comment  @func="getPage" :total="total" :comments="commentData" :caseId="caseId" :getComments="getComments"></Comment>
            </div>
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
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="question layout">
                <el-divider class="divider1"></el-divider>
                <h2 style="position: relative;left: -40%">思考</h2>
                <div class="think">
                    <el-scrollbar>
                        <p>{{this.case.thinking}}</p>
<!--                        <p>1、软组织或骨病变？钙化？良性？恶性？</p>-->
<!--                        <p>2、10岁小圆细胞肿瘤：癌？肉瘤？白血病？</p>-->
<!--                        <p>3、如果是肉瘤，鉴别尤文和横纹肌肉瘤需用哪些指标？</p>-->
<!--                        <p>4、尤文肉瘤可以化疗吗？常规治疗方案？</p>-->
                    </el-scrollbar>
                </div>
            </div>
            <div class="submit layout">
                <el-divider></el-divider>
                <h4 style="position: relative;left: -33%">提交诊断或治疗方案</h4>
                <el-table :data="studentFileList" :stripe="true" :border="true" v-loading="listLoading"
                          :header-cell-style="{background:'#F5F6FA',color:'#666E92'}">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="fileName" label="文件名"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <!-- 修改按钮 -->
                            <el-button type="primary" icon="el-icon-download" size="mini" @click="download1(scope.$index, scope.row)"></el-button>
                            <!-- 删除按钮 -->
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDel(scope.$index, scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="upload2">
                    <el-upload
                        drag
                        class="upload-demo"
                        :headers="headers"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :multiple="true"
                        :limit=limitNum
                        :on-exceed="exceedFile"
                        :action=upload
                        :file-list="fileList">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip" style="color:#c1c1c1">支持扩展名：.rar .zip .doc .docx .pdf
                            .jpg...
                        </div>
                    </el-upload>
                </div>
            </div>

        </div>

        <!-- 卡片视图区域 -->

    </div>
</template>
<!--"http://118.195.129.22:8081/sfile/uploadFile?caseId=122206152&studentId=888888888"-->
<script>
import {
    getCaseDetail,
    getCaseDetailFile,
    getCaseFile,
    getCommentList,
    getReplyCaseImg, getStudentFile,
    getTeacherListPage, removeStudentFile
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
            //上传
            limitNum: 5,
            headers: { Authorization: localStorage.getItem('token') },
            fileList:[],
            //附件
            listLoading:false,
            fileList1:[],
            urls: [

            ],
            srcList: [

            ],
            case:{
                caseDesc:'',
                thinking:'',
            },
            caseId: '',
            commentData: [],
            upload:'',
            userId:0,
            studentId:'',
            studentFileList: [],
            pagenum:0,
            pagesize:0,
            total:0
        }
    },
    created () {
        this.getParams()
        this.getCaseImg()
        this.getFileList()
        // this.commentData=comments.data
        this.getComments()
        this.getUserList ()
        this.getStudentFileList()
    },
    methods: {
        async getStudentFileList () {
            this.studentFileList=[]
            this.listLoading=true
            this.studentId=JSON.parse(localStorage.getItem('user')).userId
            var param ={caseId:this.caseId,studentId:this.studentId}
            getStudentFile(param).then((res) => {
                console.log(res)
                if(res.code==='200') {
                    this.total = res.data.total
                    for (var i = 0; i < res.data.length; i++) {
                        var item = {fileId: 0, fileName: '', realName: '', caseName: '', creatTime: ''}
                        const name = res.data[i].filePath.substring(res.data[i].filePath.lastIndexOf('/') + 1)
                        console.log(res.data[i].filePath.substring(res.data[i].filePath.lastIndexOf('/') + 1))
                        item.fileName = name
                        item.caseName=res.data[i].caseName
                        item.realName=res.data[i].studentName
                        item.studentId=res.data[i].studentId
                        item.fileId = res.data[i].id
                        this.studentFileList.push(item)
                    }
                    this.listLoading = false
                }else if(res.code==='303'){
                    this.$message.error(res.msg)
                    this.listLoading = false
                }
            })
        },
        getParams(){
            this.caseId=this.$route.query.caseId
            this.userId=JSON.parse(localStorage.getItem('user')).userId
            console.log(this.caseId)
            console.log(this.userId)
            this.upload='http://172.17.169.0:8081/sfile/uploadFile?caseId='+this.caseId+'&studentId='+this.userId
        },
        async getUserList () {
            const param={caseId:this.caseId}
            getCaseDetail(param).then((res) => {
                console.log(res)
                this.case= res.data

            })
        },
        async getFileList () {
            this.listLoading = true
            const param={caseId:this.caseId}
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
                if(res.code==='200') {
                    console.log(res)
                    var img = []
                    for (var i = 0; i < res.data.length; i++) {
                        img.push('data:image/jpeg;base64,' + res.data[i].imagebase)
                    }
                    this.urls = img
                    this.srcList = img
                }
            })
        },
        //评论
        async getComments () {
            var param= {caseId:this.caseId}
            getCommentList(param).then((res) => {
                console.log(this.pagenum)
                this.total=Number(res.data.length)
                      this.commentData = res.data.slice((this.pagenum-1)*this.pagesize,this.pagenum*this.pagesize)
                console.log(this.commentData)
            })
        },
        getPage(data){
            this.pagenum=data.pagenum
            this.pagesize=data.pagesize
        },
        //删除
        handleDel: function (index, row) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true
                console.log(row)
                let para = {fileId: row.fileId}
                removeStudentFile(para).then((res) => {
                    console.log(res)
                    if(res.code==='200') {
                        this.listLoading = false
                        //NProgress.done();
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        })
                        this.getStudentFileList()
                    }else{
                        this.listLoading = false
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        })
                    }
                })
            }).catch(() => {

            })
        },
        //下载
        download1: function (index, row) {
            const param = Object.assign({}, row)
            console.log(param.fileId)
            const params= {fileId:param.fileId}
            console.log(params)
            const url="/sfile/downloadFile/"+params.fileId
            const options = {fileId:param.fileId}
            this.exportExcel(url,options,param.fileName)
        },
        // 附件
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
// 文件超出个数限制时的钩子
        exceedFile(files, fileList) {
            this.$notify.warning({
                title: '警告',
                message: `只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`
            });
        },
        // 文件上传成功时的钩子
        handleSuccess(res, file, fileList) {
            this.$notify.success({
                title: '成功',
                message: `文件上传成功`
            });
            this.getStudentFileList()
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
            var a = document.createElement('a')
            var event = new MouseEvent('click')
            a.download = file.name
            a.href = file.url
            a.dispatchEvent(event)
            console.log(file.url)
        },
        beforeRemove (file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`)
        }
    }
}
</script>

<style scoped>

.el-scrollbar {
    height: 100%;
}

/*案例简述*/
.box {
    border-radius: 2px;
    position: relative;
    padding-right: 5px;
    left: 5%;
    width: 90%;
    height: 31.5em;
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
.box >>> .el-scrollbar__wrap {
    overflow: scroll;
    width: 110%;
    height: 104%;
}

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
/*思考*/
.think p {
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
    height: 110%;
}

/*上传*/
.upload1 {
}

.upload2 {
    margin-top: 50px;
}




/*布局*/
.el-divider {
    margin: 8px 0;
    background: 0 0;
    border-top: 2px solid #E6EBF5;
}

.divider1 {
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

.file {
    height: 200px;
}

.inter {
    box-sizing: border-box;
    height: 100%;

}

.file1 {
    width: 50%;
    margin: 0px;
    height: 100%;
    box-sizing: border-box;
}

.question {
    width: 50%;
    margin: 0px;
    height: 300px;
    box-sizing: border-box;
}

.submit {
    width: 50%;
    height: 800px;
    margin: 0px;
    box-sizing: border-box;
}

.comment {
    width: 50%;
    height: 100%;
    float: right;
    box-sizing: border-box;
    margin: 0px;
}
</style>
