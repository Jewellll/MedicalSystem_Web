<template>
    <body>
    <Header></Header>
    <Sidebar class="sidebar"></Sidebar>
    <Label></Label>
<!--    <strong class="title">{{$route.meta.title}}</strong>-->
    <div class="container" style="overflow: hidden;">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
    <Footer></Footer>
    </body>
</template>
<script>
import Header from './layout/Header'
import Sidebar from './layout/Sidebar'
import Footer from './layout/Footer'
import Label from   './layout/Label'

export default {
    components: {
        Header,
        Sidebar,
        Footer,
        Label
    }
}
</script>

<style>
body {
    margin: 0;
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
}

.sidebar {
    float: left;
}
.container{
    height: 100%;
    margin-bottom: 200px;
}
</style>
