<template>
    <body id="poster">
    <div class="title">
        <h1>DAOYUN</h1>
    </div>
<router-view></router-view>
    </body>
</template>

<script>
export default {
    name: 'LoginHome'
}
</script>
<style scoped>
#poster {
    margin: 0;
    background: url("../assets/img/login.jpg") no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
    top: 0;
    left: 0;
}
.title {
    margin-top: 0px;
    height: 80px;
    font-size: 1em;
    font-weight:700;
    color:#fff;
    font-family:Avenir Next, Helvetica Neue, Helvetica, Tahoma, sans-serif;
}



</style>
