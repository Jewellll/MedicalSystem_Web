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
                        <p>患者，女，33岁</p>
                        <p>主诉：左髋部肿物伴疼痛4月余</p>
                        <p>既往史：2013年直肠腺癌，术前短程快速放疗（共DT3900CGY/13F）；2018年左髋部疼痛，复查MRI股骨头颈及大小转子占位性病变，活检病理“疑癌”。2019年左髋关节病理性骨折，2019年5月外院行“人工左髋关节置换术”，外院病理示“骨脂肪硬化性纤维黏液瘤”；</p>
                        <p>影像学：2019年12月MRI显示：左髋关节置换术后，左侧髂骨翼、左髋人工关节周围软组织多发占位，考虑恶性肿瘤，转移瘤可能大，2020年1月转诊我院</p>
                        <p>2020年3月我院胸部CT平扫：左肺及右肺中叶多发小结节</p>
                        <p>2020年3月行左上肺肿物切除术</p>
                        <p>2020年4月行左髋外侧肿块切除术</p>
                        <p>女，10岁，发现左侧大腿根部内侧肿物。</p>
                        <p><b>免疫组化:</b></p>
                        <p>阳性指标（FLI-1、CD99、NKX2.2、KI67）</p>
                        <p>阴性指标（CK、Vimentin、LCA、MPO、TdT、Desmin、CD56、TLE-1、S100、CD3、CD20）</p>
                    </el-scrollbar>
                </div>
            </div>
            <div class="caseImg">
                <h1 style="position: relative;left: -25%">病例图片</h1>
                <div class="demo-image__lazy">
                    <el-scrollbar>
                        <el-image
                            v-for="url in urls" :key="url" lazy
                            style="width: 250px; height: 250px;margin-right: 5px"
                            :src="url"
                            :preview-src-list="srcList">
                        </el-image>
                    </el-scrollbar>
                </div>
            </div>

        </div>
        <div class="inter layout">
            <el-divider></el-divider>
            <div class="comment layout">
                <Comment :comments="commentData"></Comment>
            </div>
            <div class="file1 layout">
                <h2 style="position: relative;left: -40%">附件</h2>
                <el-upload
                    :limit="3"
                    :on-exceed="handleExceed"
                    ref="pictureUpload"
                    action="#"
                    list-type="picture-card"
                    :auto-upload="false">
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{file}">
                        <img class="el-upload-list__item-thumbnail" src="../../assets/img/file.jpeg" alt="">
                        <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                    <i class="el-icon-zoom-in"></i>
                    </span>
                   <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                   <i class="el-icon-download"></i>
                   </span>
                   <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove1(file)">
                   <i class="el-icon-delete"></i>
                   </span>
                            <span>{{ file.name }}</span>
                   </span>
                    </div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </div>
            <div class="question layout">
                <el-divider class="divider1"></el-divider>
                <h2 style="position: relative;left: -40%">思考</h2>
                <div class="think">
                    <el-scrollbar>
                        <p>1、影像学磁共振表现？</p>
                        <p>2、最常见放疗后差分化梭形细胞肉瘤</p>
                        <p>3、放疗后血管肉瘤病理诊断标准</p>
                    </el-scrollbar>
                </div>
            </div>
            <div class="submit layout">
                <el-divider></el-divider>
                <h4 style="position: relative;left: -33%">提交诊断或治疗方案</h4>
                <div class="upload1">
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        multiple
                        :limit="3"
                        :on-exceed="handleExceed"
                        :file-list="fileList">
                        <el-button size="middle" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip" style="color:#c1c1c1">只能上传jpg/png文件，且不超过500kb <br>
                            支持扩展名：.rar .zip .doc .docx .pdf .jpg... <br>诊断结果以文本形式提交，治疗方案以word、pdf、ppt形式提交
                        </div>
                    </el-upload>
                </div>
                <div class="upload2">
                    <el-upload
                        class="upload-demo"
                        drag
                        :on-preview="handlePreview"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        multiple>
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

<script>
import {getTeacherListPage} from '../../api/api'
import {comments} from '../../mock/mockdata'
import Comment from './Comment'
export default {
    components: {
        Comment
    },
    data () {
        return {
            urls: [
                require('../../assets/img/CaseImg/Case02-1.png'),
                require('../../assets/img/CaseImg/Case02-2.png'),
                require('../../assets/img/CaseImg/Case02-3.png'),
                require('../../assets/img/CaseImg/Case02-4.png'),
                require('../../assets/img/CaseImg/Case02-5.png'),
                require('../../assets/img/CaseImg/Case02-6.png'),
                require('../../assets/img/CaseImg/Case02-7.png'),
                require('../../assets/img/CaseImg/Case02-8.png'),
                require('../../assets/img/CaseImg/Case02-9.png'),
                require('../../assets/img/CaseImg/Case02-10.png')
            ],
            srcList: [
                require('../../assets/img/CaseImg/Case02-1.png'),
                require('../../assets/img/CaseImg/Case02-2.png'),
                require('../../assets/img/CaseImg/Case02-3.png'),
                require('../../assets/img/CaseImg/Case02-4.png'),
                require('../../assets/img/CaseImg/Case02-5.png'),
                require('../../assets/img/CaseImg/Case02-6.png'),
                require('../../assets/img/CaseImg/Case02-7.png'),
                require('../../assets/img/CaseImg/Case02-8.png'),
                require('../../assets/img/CaseImg/Case02-9.png'),
                require('../../assets/img/CaseImg/Case02-10.png')
            ],
            // 附件
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            commentData: [],
            // 文件上传
            fileList: [{
                name: 'food.jpeg',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
            },
                {
                    name: 'food2.jpeg',
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }]
        }
    },
    // created () {
    //     this.getUserList()
    // },
    methods: {
        async getUserList () {
            this.listLoading = true
            // eslint-disable-next-line no-undef
            getTeacherListPage(this.queryInfo).then((res) => {
                console.log(res)
                this.total = res.data.total
                this.userList = res.data.users
                this.listLoading = false
            })
        },
        // 附件
        // 删除
        handleRemove1 (file) {
            this.$refs.pictureUpload.handleRemove(file)
        },
        handlePictureCardPreview (file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
            console.log(file.name)
        },
        handleDownload (file) {
            console.log(file)
            var a = document.createElement('a')
            var event = new MouseEvent('click')
            a.download = file.name
            a.href = file.url
            a.dispatchEvent(event)
        },
        handleRemove (file, fileList) {
            console.log(file, fileList)
        },
        // 下载文件
        handlePreview (file) {
            var a = document.createElement('a')
            var event = new MouseEvent('click')
            a.download = file.name
            a.href = file.url
            a.dispatchEvent(event)
            console.log(file.url)
        },
        handleExceed (files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
        },
        beforeRemove (file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`)
        },
    },
    created () {
        this.commentData = comments.data
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
    left: 10%;
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
    height: 104%;
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
    height: 250px;
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
