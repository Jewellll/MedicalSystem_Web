<template>
<div class="manage-container">
    <div class="container">
        <div class="title">
            <h1>欢迎来到到云</h1>
        </div>
    <div class="info">
<!--        <el-carousel :interval="5000" arrow="always" class="car">-->
<!--            <el-carousel-item v-for="(img,index) in imgList" :key="index">-->
<!--                <img v-bind:src="img.url">-->
<!--            </el-carousel-item>-->
<!--        </el-carousel>-->
            <el-table :data="tableData" :header-cell-style="{background:'#F5F6FA',color:'#666E92'}"
                      :row-style="{height:'25px'}" :cell-style="{padding:'1px'}"
                      highlight-current-row class="table" >
                <el-table-column prop="name" label="姓名" >
                </el-table-column>
                <el-table-column prop="card" label="学号">
                </el-table-column>
            </el-table>

    </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'Manage',
    data() {
        return {
            imgList:[
                {url:require('../../assets/img/img1.jpg')},
                {url:require('../../assets/img/img2.jpg')},
                {url:require('../../assets/img/img3.jpg')}
            ],
            tableData: [{
                name: '朱文龙',
                card: '200327128'
            }, {
                name: '陈黎',
                card: '200327011'
            }, {
                name: '杨礼亮',
                card: '200327104'
            }, {
                name: '魏凌',
                card: '200327176'
            }]
        }
    }
}
</script>

<style scoped>
.title{
    padding-top: 10px;
    text-align: center;
    color: #e0dde8;
    font-size: 18px;
    text-shadow: 5px 5px 5px black, 0px 0px 2px black;
}
.info{
    width: 100%;
    position: absolute;
    top:500px;
    padding-left: 25%;
}
.container{
    margin-top: 8px;
    margin-left: 10px;
    margin-right: 10px;
    height:100vh;
    border-radius: 5px;
    background: url("../../assets/img/school1.jpeg") no-repeat;
    background-size: cover;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
}
.table{
    border: none;
    width: 50%;
    align-content: center;
}
.car{
    width: 500px;
    height: 50%;
    margin-left: 460px;
    border: none;
}
.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
</style>
