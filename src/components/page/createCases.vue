<template>
    <div>
        <div class="container">
            <div align="center" style="font-size: 40px;">创建案例</div>
            <div class="left">
                <el-form :model="caseForm"  label-width="100px">
                    <el-form-item label="案例名:" prop="casename">
                        <el-col :span="8">
                            <el-input placeholder="请输入内容" v-model="caseForm.casename" ></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="案例描述:" prop="desc">
                        <el-col :span="15">
                            <el-input  type="textarea"
                                       :rows="5"
                                       placeholder="请输入内容"
                                       v-model="caseForm.desc"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="思考:" prop="question">
                        <el-col :span="15">
                            <el-input  type="textarea"
                                       :rows="5"
                                       placeholder="请输入内容"
                                       v-model="caseForm.question"></el-input>
                        </el-col>
                    </el-form-item>
                </el-form>

            </div>

            <div class="right">
                <el-scrollbar>
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        :limit="3"
                        :on-success="(response, file, fileList)=>{return onSuccess(response, file, fileList, index)}"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-scrollbar>

                <br>
                <el-upload
                    class="upload-demo"
                    drag
                    action="https://jsonplaceholder.typicode.com/posts/"
                    multiple
                    :file-list="fileListDemo"
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </div>
            <div class="footer">
                <el-button type="primary" @click="back()">返回</el-button>
                <el-button type="primary" >提交</el-button>
            </div>

        </div>

    </div>
</template>

<script>
export default {
  name: 'createCases',
  data () {
    return {
      caseForm: {
        casename: '',
        desc: '',
        question: ''
      },
      fileList: [{name: 'Case01-1.png', url: require('../../assets/img/CaseImg/Case01-1.png')},
        {name: 'Case01-2.png', url: require('../../assets/img/CaseImg/Case01-2.png')}],
      fileListDemo: [{name: 'Case01.doc'}]

    }
  },
  methods: {
    // 上传图片
    onSuccess (response, file, fileList, idx) {
      this.fileList.push({ name: file.name, url: file.url })
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
      back(){
        this.$router.go(-1)
      }
  }
}
</script>

<style scoped>
    .left{
        margin-left: 100px;
        margin-top: 50px;
        position: absolute;
        width: 40%;
        height: 500px;
    }
    .right{
        margin-top: 20px;
        width: 45%;
        margin-left: 600px;
        height: 550px;

    }
    .right >>> .el-scrollbar__wrap {
        overflow: scroll;
        width: 110%;
        height: 120%;
    }
    .container{
        margin-top: 8px;
        margin-left: 10px;
        margin-right: 10px;
        padding: 10px 10px;
        background-color: #FFFFFF;
        height: 100vh;
        border-radius: 5px;
    }
    .footer{
        height: 40px;
        margin-top: 10px;
    }
</style>
