<template>
    <div>
        <div class="container">
            <div align="center" style="font-size: 1.5em; text-align: left;margin-left: 0.2em">编辑案例</div>
            <div class="info">
            <div class="left">
                <el-form :model="caseForm" ref="caseForm"  :rules="rules"  label-width="100px">
                    <el-form-item label="案例名:" prop="caseName">
                        <el-col :span="8">
                            <el-input placeholder="请输入内容" v-model="caseForm.casename" ></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="案例描述:" prop="desc">
                        <el-col :span="20">
                            <el-input  type="textarea"
                                       :rows="10"
                                       placeholder="请输入内容"
                                       v-model="caseForm.desc"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="思考:" prop="question">
                        <el-col :span="20">
                            <el-input  type="textarea"
                                       :rows="10"
                                       placeholder="请输入内容"
                                       v-model="caseForm.question"></el-input>
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
                    :file-list="fileList"
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
                    :file-list="fileList"
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
import {editCse, getCaseListPage, getCaseToEdit, getCaseToEdite, requireRegister} from '../../api/api'

export default {
    name: 'createCases',
    data () {
        return {
            queryInfo:{
                courseName:'',
                caseName:''
            },
            caseForm: {
                caseName: '',
                desc: '',
                question: ''
            },
            rules: {
                caseName: [{ required: true, message: "请输入案例名", trigger: "blur" }],
                desc: [{ required: true, message: "请输入案例描述", trigger: "blur" }]
            },
            fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
                {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]

        }
    },
    created () {
        this.getCaseDetail()
    },
    methods: {
        async getCaseDetail () {
            this.queryInfo.courseName=this.$store.state.courseName
            this.queryInfo.caseName=this.$store.state.caseName
            getCaseToEdit(this.queryInfo).then((res) => {
                console.log(res)
                this.caseForm = res.users
            })
        },
        handleRemove (file, fileList) {
            console.log(file, fileList)
        },
        handlePreview (file) {
            console.log(file)
        },
        edit(){
            this.$refs.caseForm.validate((valid) => {
                if (valid) {
                    const regParams = this.caseForm
                    editCse(regParams).then(res => {
                        let {msg, code,} = res
                        if (code !== 200) {
                            this.$message.error("编辑失败");
                        } else {
                            this.$message('编辑成功')
                            this.$router.push('/caseManage')
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
