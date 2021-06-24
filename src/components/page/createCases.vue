<template>
    <div>
        <div class="container">
            <div align="center" style="font-size: 1.5em; text-align: left;margin-left: 0.2em">创建案例</div>
            <div class="info">
                <div class="left">
                    <el-form :model="caseForm" ref="caseForm"  :rules="rules"  label-width="100px">
                        <el-form-item label="案例名:" prop="caseName">
                            <el-col :span="8">
                                <el-input placeholder="请输入案例名" v-model="caseForm.caseName" ></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="案例描述:" prop="caseDesc">
                            <el-col :span="20">
                                <el-input  type="textarea"
                                           :rows="10"
                                           placeholder="请输入内容"
                                           v-model="caseForm.caseDesc"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="思考:" prop="question">
                            <el-col :span="20">
                                <el-input  type="textarea"
                                           :rows="10"
                                           placeholder="请输入内容"
                                           v-model="caseForm.thinking"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="right">
                    <div style="text-align: left;font-size: 14px;margin-top: 5px"> 案例图片：</div>
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="fileList1"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                    <br>
                    <div style="text-align: left;font-size: 14px;margin-top: 5px">附件:</div>
                    <el-upload
                        class="upload-demo"
                        drag
                        action="https://jsonplaceholder.typicode.com/posts/"
                        multiple
                        :file-list="fileList2"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </div>
            </div>
            <div class="footer">
                <el-button type="primary" @click="back()">返回</el-button>
                <el-button type="primary" @click="edit">提交</el-button>
            </div>

        </div>

    </div>
</template>

<script>
import {addCase, editCse, getCaseListPage, getCaseToEdit, getCaseToEdite, requireRegister} from '../../api/api'

export default {
    name: 'createCases',
    data () {
        return {
            caseForm: {
                caseName: '',
                caseDesc: '',
                thinking: '',
                courseId:1,
                courseName:'',
                creatTime:'',
                isPublish:2,
                creatTeacher:localStorage.getItem('user').userId

            },
            rules: {
                caseName: [{ required: true, message: "请输入案例名", trigger: "blur" }],
                caseDesc: [{ required: true, message: "请输入案例描述", trigger: "blur" }]
            },
            fileList1: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
                {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
            fileList2:[]

        }
    },
    created () {
        this.getParams()
    },
    methods: {
        getParams(){

            this.caseForm.courseName=this.$route.query.courseName
            this.caseForm.courseId=this.$route.query.courseId
            var param=JSON.parse(localStorage.getItem('user'))
            this.caseForm.creatTeacher=param.userId
        },
        //图片
        handleRemove (file, fileList) {
            this.$refs.pictureUpload.handleRemove(file)
        },
        handlePreview (file) {
            var a = document.createElement('a')
            var event = new MouseEvent('click')
            a.download = file.name
            a.href = file.url
            a.dispatchEvent(event)
            console.log(file.url)
        },
        // 文件上传成功时的钩子
        handleSuccess(res, file, fileList) {
            this.$notify.success({
                title: '成功',
                message: `图片上传成功`
            });
        },
        // 文件上传失败时的钩子
        handleError(err, file, fileList) {
            this.$notify.error({
                title: '错误',
                message: `图片上传失败`
            });
        },
        beforeRemove (file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`)
        },
        edit(){
            this.$refs.caseForm.validate((valid) => {
                if (valid) {
                    const params = this.caseForm
                   addCase(params).then(res => {
                        let {msg, code,} = res
                        if (code !== '200') {
                            this.$message.error(res.msg);
                        } else if(code==='200'){
                            this.$message(res.msg)
                            this.$router.go(-1)
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        back(){
            this.$router.go(-1)
        }
    }
}
</script>

<style scoped>
.info{
    margin-top: 2em;
    height: 550px;
    width: 100%;
    clear: both;
}
.left{
    position: absolute;
    width: 50%;
    height: 550px;
}
.right{
    width: 40%;
    float: right;
    margin-right: 100px;
    height: 550px;

}
.container{
    margin-top: 8px;
    margin-left: 10px;
    margin-right: 10px;
    padding: 10px 10px;
    background-color: #FFFFFF;
    height: 100%;
    border-radius: 5px;
}
.footer{
    margin-top: 3em;
    width: 100%;
    height: 40px;
}
</style>
