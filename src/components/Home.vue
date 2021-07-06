<template>
    <body>
    <Header></Header>
    <Sidebar class="sidebar"></Sidebar>
    <Label></Label>
<!--    <strong class="title">{{$route.meta.title}}</strong>-->
    <div class="container" style="overflow: hidden;">
        <transition name="fade" mode="out-in">
<!--            <keep-alive>-->
            <router-view></router-view>
<!--            </keep-alive>-->
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
    },
    computed:{
        getIsCollapse(){
            return this.$store.state.isCollapse
        }
    },
    watch: {
        //路由变化,设置标签
        $route (newValue, oldValue) {
            // this.setTags(newValue)
        },
        getIsCollapse:{
            handler(newValue,oldValue){ //当词条改变时执行事件
                if(newValue===false){
                    const tag = document.getElementsByClassName('container');
                    console.log(tag[0])
                    tag[0].style.marginLeft = "157px";
                }else{
                    const tag = document.getElementsByClassName('container');
                    tag[0].style.marginLeft = "65px";
                }
            }
        },

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
    position: fixed;
    z-index: 2;
}
.container{
    margin-left: 65px;
    height: 100%;
    margin-bottom: 200px;
    transition: margin-left 0.4s;
}
</style>
