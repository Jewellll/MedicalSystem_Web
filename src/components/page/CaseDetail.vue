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
                        <p>刚好项目里面一直在使用的都是element</p>
                        <p>因为原生的滚动条太丑了</p>
                        <p>发现elementui中有个隐藏的组件</p>
                        <p>优化滚动条样式</p>
                        <p>亲测可用</p>
                        <p>刚好项目里面一直在使用的都是element</p>
                        <p>因为原生的滚动条太丑了</p>
                        <p>发现elementui中有个隐藏的组件</p>
                        <p>优化滚动条样式</p>
                        <p>亲测可用</p>
                        <p>刚好项目里面一直在使用的都是element</p>
                        <p>因为原生的滚动条太丑了</p>
                        <p>发现elementui中有个隐藏的组件</p>
                        <p>优化滚动条样式</p>
                        <p>亲测可用</p>
                        <p>优化滚动条样式</p>
                        <p>亲测可用</p>
                    </el-scrollbar>
                </div>
            </div>
            <div class="caseImg layout">
                <h1 style="position: relative;left: -25%">病例图片</h1>
                <div class="imgBox1">
                    <div class="img img1" @click="showImg($event)">
                        <img src="../../assets/img/img1.jpg" alt="">
                        <div class="imgDolg" v-show="imgPreview.show" @click.stop="imgPreview.show = false">
                            <i class="el-icon-close" id="imgDolgClose" @click.stop="imgPreview.show = false"></i>
                            <img @click.stop="imgPreview.show = flase" :src="imgPreview.img"/>
                        </div>
                        <span>图片说明</span>
                    </div>
                    <div class="img img2" @click="showImg($event)">
                        <img src="../../assets/img/img2.jpg" alt="">
                        <div class="imgDolg" v-show="imgPreview.show" @click.stop="imgPreview.show = false">
                            <i class="el-icon-close" id="imgDolgClose" @click.stop="imgPreview.show = false"></i>
                            <img @click.stop="imgPreview.show = flase" :src="imgPreview.img"/>
                        </div>
                        <span>图片说明</span>
                    </div>
                </div>
                <div class="imgBox2">
                    <div class="img img3" @click="showImg($event)">
                        <img src="../../assets/img/img3.jpg" alt="">
                        <div class="imgDolg" v-show="imgPreview.show" @click.stop="imgPreview.show = false">
                            <i class="el-icon-close" id="imgDolgClose" @click.stop="imgPreview.show = false"></i>
                            <img @click.stop="imgPreview.show = flase" :src="imgPreview.img"/>
                        </div>
                        <span>图片说明</span>
                    </div>
                    <div class="img img4" @click="showImg($event)">
                        <img src="../../assets/img/img4.jpg" alt="">
                        <div class="imgDolg" v-show="imgPreview.show" @click.stop="imgPreview.show = false">
                            <i class="el-icon-close" id="imgDolgClose" @click.stop="imgPreview.show = false"></i>
                            <img @click.stop="imgPreview.show = flase" :src="imgPreview.img"/>
                        </div>
                        <span>图片说明</span>
                    </div>
                </div>
            </div>

        </div>
        <div class="inter layout">
            <el-divider></el-divider>
            <div class="comment layout">
                评论
            </div>
            <div class="file1 layout">
                <h2 style="position: relative;left: -40%">附件</h2>
                <el-upload
                    :limit="3"
                    :on-exceed="handleExceed"
                    ref="pictureUpload"
                    action="#"
                    list-type="picture-card"
                    :auto-upload="false" >
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
                            <span>{{file.name}}</span>
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
                    <p>我国《商标法》规则，商标注册人享有牌号专一使用权，受司法关心。企业要求商标最大的代价等于关切自身的品牌，担保本人的品牌产品、效劳畸形地在市场上发展发卖、广告，制止别人的使用。</p>
                    <p>一方面，牌号注册依照在先申请轨制，企业如果不有注册商标，很容易被一些分工对手和牌号投契份子恶意抢注。另外一方面，商标承载着品牌的商誉，是企业品牌价值的法律载体。</p>
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
// import {
//     addTeacher,
//     batchRemoveTeacher,
//     editTeacher,
//     getTeacherListPage,
//     removeTeacher
// } from '../../api/api'
export default {
    data () {
        return {
            imgPreview: {
                img: '',
                show: false
            },
            //附件
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            //文件上传
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
            getTeacherListPage(this.queryInfo).then((res) => {
                console.log(res)
                this.total = res.data.total
                this.userList = res.data.users
                this.listLoading = false
            })
        },
        //附件
        // 删除
        handleRemove1(file) {
            this.$refs.pictureUpload.handleRemove(file)
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
            console.log(file.name)
        },
        handleDownload(file) {
            console.log(file)
            var a = document.createElement('a')
            var event = new MouseEvent('click')
            a.download = file.name
            a.href = file.url;
            a.dispatchEvent(event)

        },
        handleRemove (file, fileList) {
            console.log(file, fileList)
        },
        //下载文件
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
        //预览图片
        showImg (e) {
            // console.log(e.target)
            if (e.target.tagName === 'IMG') {
                this.imgPreview.img = e.target.src
                this.imgPreview.show = true
            }
        },
    }
}
</script>

<style scoped>
/*案例图片*/
.img {
    display: inline-block;

    height: 220px;
    width: 220px;
    margin-top: 3px;
}

img {
    width: 100%;
    height: 100%;
}

.imgDolg {
    width: 60vw;
    height: 80vh;
    position: fixed;
    z-index: 9999;
    background-color: rgba(140, 134, 134, 0.6);
    top: 100px;
    left: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
}

#imgDolgClose {
    position: fixed;
    top: 120px;
    cursor: pointer;
    right: 250px;
    font-size: 50px;
    color: white;
}

.imgBox1 {
    width: 100%;
}

.imgBox2 {
    width: 100%;
    margin-top: 10px;
}

.img1 {
    margin-right: 40px;
}

.img3 {
    margin-right: 40px;
}

/*案例简述*/
.box {
    border-radius: 2px;
    position: relative;
    left: 5%;
    width: 90%;
    height: 70%;
    border: 1px solid #c1c1c1;
    background: #f6f4f4;
}

.el-scrollbar {
    height: 100%;
}

.box >>> .el-scrollbar__wrap {
    overflow: scroll;
    width: 110%;
    height: 120%;
}
/*.think {*/
/*    border-radius: 2px;*/
/*    position: relative;*/
/*    left: 10%;*/
/*    width: 80%;*/
/*    height: 70%;*/
/*    border: 1px solid #c1c1c1;*/
/*    background: #f6f4f4;*/
/*}*/
/*.think >>> .el-scrollbar__wrap {*/
/*    overflow: scroll;*/
/*    width: 110%;*/
/*    height: 120%;*/
/*}*/

/*上传*/
.upload1 {

}

.upload2 {
    margin-top: 50px;
}
.think p{
    position: relative;
    left: 10%;
    width: 80%;
    text-align: justify;
    text-indent: 2em;
    font-size: 16px;
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

.file {
    height: 200px;
}

.inter {
    box-sizing: border-box;
    height: 100%;

}
.file1{
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
    height: 600px;
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
