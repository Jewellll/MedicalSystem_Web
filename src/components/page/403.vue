<template>
    <div class="error-page">
        <div class="error-code">4<span>0</span>3</div>
        <div class="error-desc">抱歉，出现服务异常！</div>
    </div>
</template>

<script>
export default {
    methods: {
        goBack(){
            this.$router.go(-1);
        }
    }
}
</script>


<style scoped>
.error-page{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #f3f3f3;
    box-sizing: border-box;
}
.error-code{
    line-height: 1;
    font-size: 250px;
    font-weight: bolder;
    color: #2c2ff1;
}
.error-code span{
    color: #c40f3a;
}
.error-desc{
    font-size: 30px;
    color: #e30505;
}
</style>
