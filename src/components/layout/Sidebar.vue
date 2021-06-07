<template>
    <div>
        <el-container>
            <el-aside width="collapse">
                <el-menu
                    class="el-menu-vertical"
                    :collapse="isCollapse"
                    background-color="#fff"
                    text-color="#bfcbd9"
                    active-text-color="#20a0ff"
                    unique-opened
                    router
                >
                    <el-menu-item  @click="isC">
                        <i class="el-icon-s-fold" v-show="block"></i>
                        <i class="el-icon-s-unfold" v-show="toggle"></i>
                    </el-menu-item>
                    <template v-for="item in items">
                        <template v-if="item.subs">
                            <el-submenu :index="item.index" :key="item.index">
                                <template slot="title">
                                    <i :class="item.icon"></i>
                                    <span slot="title">{{ item.title }}</span>
                                </template>
                                <template v-for="subItem in item.subs">
                                    <el-submenu
                                        v-if="subItem.subs"
                                        :index="subItem.index"
                                        :key="subItem.index"
                                    >
                                        <template slot="title">{{ subItem.title }}</template>
                                        <el-menu-item
                                            v-for="(threeItem,i) in subItem.subs"
                                            :key="i"
                                            :index="threeItem.index"
                                        >{{ threeItem.title }}</el-menu-item>
                                    </el-submenu>
                                    <el-menu-item
                                        v-else
                                        :index="subItem.index"
                                        :key="subItem.index"
                                    >{{ subItem.title }}</el-menu-item>
                                </template>
                            </el-submenu>
                        </template>
                        <template v-else>
                            <el-menu-item :index="item.index" :key="item.index">
                                <i :class="item.icon"></i>
                                <span slot="title">{{ item.title }}</span>
                            </el-menu-item>
                        </template>
                    </template>
                </el-menu>
            </el-aside>
        </el-container>
    </div>
</template>

<script>
export default {
    name: "Main",
    data() {
        return {
            isCollapse: true, //导航栏默认为折叠
            toggle: false, //第二个图标默认隐藏
            block: true, //默认显示第一个图标
            items: [
                {
                    icon: 'el-icon-house',
                    index: 'manage',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-collection',
                    index: 'teacherManage',
                    title: '教师管理'
                },
                {
                    icon: 'el-icon-notebook-1',
                    index: 'studentManage',
                    title: '学生管理'
                },
                {
                    icon: 'el-icon-data-analysis',
                    index: 'courseManage',
                    title: '课程管理'
                },
                {
                    icon: 'el-icon-user',
                    index: 'userManage',
                    title: '用户管理'
                },
                {
                    icon: 'el-icon-lock',
                    index: 'roleManage',
                    title: '角色管理'
                },
                {
                    icon: 'el-icon-reading',
                    index: 'dictionary',
                    title: '字典管理'
                },

                {
                    icon: 'el-icon-set-up',
                    index: 'systemManage',
                    title: '参数管理'
                },
                {
                    icon: 'el-icon-paperclip',
                    index: '3',
                    title: '相关页面',
                    subs: [
                        {
                            index: 'test',
                            title: '测试页面'
                        },{
                            index: '3-2',
                            title: '异常管理',
                            subs: [
                                {
                                    index: '500',
                                    title: '500异常页面'
                                },
                                {
                                    index: '404',
                                    title: '404异常页面'
                                },
                                {
                                    index: '403',
                                    title: '403异常页面'
                                },
                                {
                                    index: 'diyError',
                                    title: '自定义异常页面'
                                }
                            ]
                        }

                    ]
                }
            ]
        };
    },
    methods: {
        // 动态控制展开与收起和切换对应图标
        isC() {
            this.isCollapse = !this.isCollapse;
            this.toggle = !this.toggle;
            this.block = !this.block;
        },
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '/manage');
        }
    },
};
</script>

<style scoped>

.el-aside {
    color: #333;
    height: 100%;
    text-align: left;
}
.el-menu {
    margin-top: 10px;
    border-right-width: 0;
}
.el-menu-vertical:not(.el-menu--collapse) {
    width: 157px;
}

</style>
