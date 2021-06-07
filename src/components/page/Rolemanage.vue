<template>
    <div class="container">
        <!--工具栏-->
        <div style="margin-top: 20px;display: flex;margin-bottom: 20px">
            <div class="buttons">
                <el-popconfirm
                    title="确定删除这些条目吗？"
                >
                    <el-button slot="reference" @click="deleteSelected()" type="danger">批量删除</el-button>
                </el-popconfirm>
            </div>
            <div class="buttons">
                <el-button @click="addItem" type="primary">添加用户</el-button>
            </div>
            <div style="margin-left: 20px">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
                    <el-select v-model="queryInfo.select" slot="prepend" placeholder="请选择">
                        <el-option label="姓名" value="1"></el-option>
                        <el-option label="用户电话" value="2"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </div>
        </div>
        <el-divider></el-divider>
        <el-row :gutter="15">
            <!--角色管理-->
            <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
                <el-card class="box-card" shadow="never">
                    <div slot="header" class="clearfix">
                        <span class="role-span">角色列表</span>
                    </div>
                    <el-table :data="TableData" :stripe="true" :border="true" v-loading="listLoading"
                              @selection-change="handleSelectionChange"
                              :header-cell-style="{background:'#F5F6FA',color:'#666E92'}">
<!--                    <el-table ref="multipleTable" highlight-current-row style="width: 100%;"-->
<!--                              v-loading="listLoading" :data="TableData" @selection-change="handleSelectionChange">-->
                        <el-table-column type="selection" width="55" />
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="name" label="名称" />
                        <el-table-column prop="level" label="角色级别" />
                        <el-table-column :show-overflow-tooltip="true" width="135px" prop="create_time" label="创建日期" />
                        <el-table-column :show-overflow-tooltip="true" prop="remark" label="描述" />
                        <el-table-column label="操作" width="200px"  fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-popconfirm
                                    title="确定删除这个条目吗？"
                                >
                                    <el-button
                                        slot="reference"
                                        size="mini"
                                        type="danger"
                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </el-popconfirm>

                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="page">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="queryInfo.pagenum"
                            :page-sizes="[1, 2, 5, 10]"
                            :page-size="queryInfo.pagesize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                        </el-pagination>
                    </div>
                    <!--分页组件-->
<!--                    <div class="block">-->
<!--                        <el-pagination-->
<!--                            @size-change="handleSizeChange"-->
<!--                            @current-change="handleCurrentChange"-->
<!--                            :current-page.sync="currentPage"-->
<!--                            :page-size="pageSize"-->
<!--                            layout="prev, pager, next, jumper"-->
<!--                            :total="TableData.length">-->
<!--                        </el-pagination>-->
<!--                    </div>-->
                </el-card>
            </el-col>
            <!-- 菜单授权 -->
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
                <el-card class="box-card" shadow="never">
                    <div slot="header" class="clearfix">
                        <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
                            <span class="role-span">菜单分配</span>
                        </el-tooltip>
                        <el-button
                            v-permission="['admin','roles:edit']"
                            :disabled="!showButton"
                            :loading="menuLoading"
                            icon="el-icon-check"
                            size="mini"
                            style="float: right; padding: 6px 9px"
                            type="primary"
                            @click="saveMenu"
                        >保存</el-button>
                    </div>
                    <el-tree
                        :data="menus"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="[2, 3]"
                        :default-checked-keys="[5]"
                        :props="defaultProps">
                    </el-tree>
                </el-card>
            </el-col>
        </el-row>
        <!-- 编辑角色-->
        <el-dialog title="编辑角色" :visible.sync="dialogFormVisible" width="700px">
            <el-form :model="editForm">
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="editForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-row :gutter="24">
                    <el-col :span="10">
                        <el-form-item label="角色级别" prop="level" :label-width="formLabelWidth">
                            <el-input-number v-model.number="editForm.level" :min="1" controls-position="right" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="数据范围" prop="dataScope" :label-width="formLabelWidth">
                            <el-select v-model="editForm.dataScope" placeholder="请选择数据范围">
                                <el-option
                                    v-for="item in dateScopes"
                                    :key="item"
                                    :label="item"
                                    :value="item"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="角色描述" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        :rows="5"
                        placeholder="请输入内容"
                        v-model="editForm.remark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
// import {getRequest} from "@/utils/api";

import {getParaListPage} from '../../api/api'

export default {
    data() {
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                //查询类型
                select: '',
                // 查询参数
                query: '',
                // 当前的页码数
                pagenum: 1,
                // 每页显示多少条数据
                pagesize: 5
            },
            listLoading: false,
            multipleSelection: [],
            // 总数
            total: 0,
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                permission: [
                    { required: true, message: '请输入权限', trigger: 'blur' }
                ]
            },
            formLabelWidth: '120px',
            dialogFormVisible: false,
            dateScopes: [
                '全部',
                '本级',
                '自定义'
            ],
            editForm: {
                name: '',
                dataScope: '',
                level: '',
                remark: ''
            },
            TableData: [],
            menus: [
                {
                    id: 1,
                    label: '教师管理'
                },
                {
                    id: 2,
                    label: '学生管理'
                },
                {
                    id: 3,
                    label: '课程管理'
                },
                {
                    id: 4,
                    label: '用户管理',
                },
                {
                    id: 5,
                    label: '角色管理',
                },
                {
                    id: 6,
                    label: '数据字典管理',
                },
                {
                    id: 7,
                    label: '系统参数管理',
                },
                {
                    id: 8,
                    label: '测试页面',
                },
                {
                    id: 9,
                    label: '相关页面',
                    children: [
                        {
                            id: 1,
                            label: '测试页面',
                        }
                    ]
                }
            ],
            currentId: 0,
            menuLoading: false,
            showButton: false,
            defaultProps: { children: 'children', label: 'label', isLeaf: 'leaf' },
            menuIds: [], depts: [], deptDatas: [], // 多选时使用
        }
    },
    created () {
        this.getUserList()
    },
    methods: {
        async getUserList () {
            this.listLoading = true
            getParaListPage(this.queryInfo).then((res) => {
                console.log(res)
                this.total = res.data.total
                this.TableData = res.data.users
                this.listLoading = false
            })
        },
        // 监听 pageSize 改变的事件
        handleSizeChange (newSize) {
            //   console.log(newSize)
            //  将监听接受到的每页显示多少条的数据 newSzie 赋值给 pagesize
            this.queryInfo.pagesize = newSize
            //  修改完以后，重新发起请求获取一次数据
            this.getUserList()
        },
        // 监听 页码值  改变的事件
        handleCurrentChange (newPage) {
            //   console.log(newPage)
            //  将监听接受到的页码值的数据 newPage 赋值给 pagenum
            this.queryInfo.pagenum = newPage
            //  修改完以后，重新发起请求获取一次数据
            this.getUserList()
        },

        deleteSelected() {
        },
        addItem () {
        },
        menuChange() {},
        saveMenu() {},
        getMenuDatas: function () {},
        handleEdit: function (index, row){
            this.dialogFormVisible = true
            this.editForm = Object.assign({}, row)
        },
        handleDelete: function (){},
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }
    }
}
</script>

<style scoped>
.container {
    margin-top: 8px;
    margin-left: 10px;
    margin-right: 10px;
    padding: 10px 10px;
    background-color: #FFFFFF;
    height: 100vh;
    border-radius: 5px;
}
.buttons {
    margin-left: 20px;
}
.block {
    float: right;
    margin-top: 30px;
    margin-right: 30px;
    margin-bottom: 30px;
}
</style>
