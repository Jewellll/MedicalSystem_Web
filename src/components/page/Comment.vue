<!--评论模块-->
<template>
    <div class="container">
        <div class="user">
            <div class="input-user">
                <div class="avatar-user">
                    <img class="avatar" :src=userAvatar width="36" height="36" alt=""/>
                </div>
                <div class="input">
                    <el-input class="gray-bg-input"
                              v-model="userComment"
                              type="textarea"
                              :rows="1"
                              placeholder="写下你的评论">
                    </el-input>
                </div>
            </div>
            <div class="btn-control">
                <el-button size="small" class="btn" type="primary" @click="userSubmit">确定</el-button>
            </div>
        </div>
        <template v-if="comments.length==0">
            <div>暂无评论</div>
        </template>
        <template v-else>
            <div class="comment" v-for="item in comments" :key="item.id">
                <div class="info">
                    <img class="avatar" :src="item.fromAvatar" width="36" height="36" alt=""/>
                    <div class="right">
                        <div class="name">{{ item.fromName }}</div>
                        <div class="date">{{ item.createTime }}</div>
                    </div>
                </div>
                <div class="content"><p>{{ item.content }}</p></div>
                <div class="control">
                    <template v-if="item.fromId==userId">
                    <span class="comment-reply" @click="delComment(item)">
          <i class="iconfont icon-comment"></i>
          <span>删除</span>
        </span>
                    </template>
                    <span class="comment-reply" @click="showCommentInput(item)">
          <i class="iconfont icon-comment"></i>

          <span>回复</span>
        </span>
                </div>
                <div class="reply">
                    <div class="item" v-for="reply in item.reply" :key="reply.id">
                        <div class="reply-content">
                            <span class="from-name">{{ reply.fromName }}</span><span>: </span>
                            <span class="to-name">{{ reply.toName }}</span>
                            <span>{{ reply.content }}</span>
                        </div>
                        <div class="reply-bottom">
                            <span>{{ reply.creatTime }}</span>
                            <template v-if="reply.fromId==userId">
                                <div class="delete" style="margin-left: 10px;cursor: pointer" @click="delComment(reply)">删除</div>
                            </template>
                            <span class="reply-text" @click="showCommentInput(item, reply)">
              <i class="iconfont icon-comment"></i>
              <span>回复</span>
            </span>
                        </div>
                    </div>
                    <div class="write-reply" v-if="item.reply!=null&&item.reply.length > 0"
                         @click="showCommentInput(item)">
                        <i class="el-icon-edit"></i>
                        <span class="add-comment">添加新评论</span>
                    </div>
                    <transition name="fade">
                        <div class="input-wrapper" v-if="showItemId === item.id">
                            <el-input class="gray-bg-input"
                                      v-model="inputComment"
                                      type="textarea"
                                      :rows="3"
                                      autofocus
                                      placeholder="写下你的评论">
                            </el-input>
                            <div class="btn-control">
                                <span class="cancel" @click="cancel">取消</span>
                                <el-button class="btn" type="success" round @click="commitComment(item)">确定</el-button>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 3, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </template>
    </div>
</template>

<script>

import {deleteComment, removeUser, requestComment} from '../../api/api'

export default {
    props: {
        comments: {
            type: Array,
            required: true
        },
        getComments: {
            type: Function,
            default: null
        },
        caseId: {
            type: String,
            required: true
        },
        total:{
            type: Number,
            required: true
        }
    },
    components: {},
    data () {
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                // 查询参数
                query: '',
                // 当前的页码数
                pagenum: 1,
                // 每页显示多少条数据
                pagesize: 3
            },
            inputComment: '',
            showItemId: '',
            userComment: '',
            userAvatar: '',
            userId: '',
            total:0
        }
    },
    computed: {},
    created () {
        this.getAvatar()
    },
    methods: {
        getAvatar () {
            this.userAvatar = JSON.parse(localStorage.getItem('user')).avatar
            this.userId = JSON.parse(localStorage.getItem('user')).userId

            this.$emit('func',this.queryInfo);
        },
        /**
         * 点击取消按钮
         */
        cancel () {
            this.showItemId = ''
        },
        //新增评论
        userSubmit (item) {
            var user = JSON.parse(localStorage.getItem('user'))
            const param = {
                caseId: Number(this.caseId),
                content: this.userComment,
                fromId: user.userId,
                fromName: user.realName
            }
            requestComment(param).then((res) => {
                console.log(res)
                if (res.code === '200') {
                    this.$message.success(res.msg)
                    this.getComments()
                } else if (res.code === '400') {
                    this.$message.error(res.msg)
                }

            })
        },
        /**
         * 评论别人
         */
        commitComment (item) {
            var user = JSON.parse(localStorage.getItem('user'))
            const param = {
                caseId: Number(this.caseId),
                parentId: item.id,
                content: this.inputComment,
                fromId: user.userId,
                fromName: user.realName
            }
            requestComment(param).then((res) => {
                console.log(res)
                if (res.code === '200') {
                    this.$message.success(res.msg)
                    this.getComments()
                    this.showItemId = ''
                } else if (res.code === '400') {
                    this.$message.error(res.msg)
                }

            })
        },
        delComment (item) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                console.log(item)
                let para = {id: item.id}
               deleteComment(para).then((res) => {
                    if (res.code == '200') {
                        this.$message({message: res.msg, type: 'success'})
                        this.getComments()
                    }
                })
            }).catch(() => {
            })
        },

        /**
         * 点击评论按钮显示输入框
         * item: 当前大评论
         * reply: 当前回复的评论
         */
        showCommentInput (item, reply) {
            if (reply) {
                this.inputComment = '@' + reply.fromName + ' '
            } else {
                this.inputComment = ''
            }
            this.showItemId = item.id
        },
        // 监听 pageSize 改变的事件
        handleSizeChange (newSize) {
            //   console.log(newSize)
            //  将监听接受到的每页显示多少条的数据 newSzie 赋值给 pagesize
            this.queryInfo.pagesize = newSize
            this.$emit('func',this.queryInfo);
            //  修改完以后，重新发起请求获取一次数据
            this.getComments()
        },
        // 监听 页码值  改变的事件
        handleCurrentChange (newPage) {
            //   console.log(newPage)
            //  将监听接受到的页码值的数据 newPage 赋值给 pagenum
            this.queryInfo.pagenum = newPage
            this.$emit('func',this.queryInfo);
            //  修改完以后，重新发起请求获取一次数据
            this.getComments()
        },
    }
}
</script>

<style scoped lang="scss">

@import "src/css/comment";

.user {
    width: 100%;

    .input-user {
        width: 100%;

        .avatar-user {
            width: 6%;
            display: inline-block;
            vertical-align: -0.2em;

            .avatar {
                border-radius: 50%;
            }
        }

        .input {
            width: 91%;
            display: inline-block
        }
    }

    .btn-control {
        text-align: right;
        margin-top: 0.6em;
        margin-right: 0.5em;
    }
}

.container {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;

    .comment {
        display: flex;
        flex-direction: column;
        padding: 10px;
        border-bottom: 1px solid $border-fourth;

        .info {
            display: flex;
            align-items: center;

            .avatar {
                border-radius: 50%;
            }

            .right {
                display: flex;
                flex-direction: column;
                margin-left: 10px;

                .name {
                    font-size: 16px;
                    color: $text-main;
                    margin-bottom: 5px;
                    font-weight: 500;
                }

                .date {
                    font-size: 12px;
                    color: $text-minor;
                }
            }
        }
.delete:hover{
    color: $text-333;
}
        .content {
            font-size: 16px;
            color: $text-main;
            line-height: 20px;
            padding: 10px 0;

            p {
                float: left;
                margin-left: 20px;
            }
        }

        .control {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: $text-minor;
            margin-left: 20px;

            .like {
                display: flex;
                align-items: center;
                margin-right: 20px;
                cursor: pointer;

                &.active, &:hover {
                    color: $color-main;
                }

                .iconfont {
                    font-size: 14px;
                    margin-right: 5px;
                }
            }

            .comment-reply {
                display: flex;
                align-items: center;
                cursor: pointer;

                &:hover {
                    color: $text-333;
                }

                .iconfont {
                    font-size: 16px;
                    margin-right: 5px;
                }
            }

        }

        .reply {
            margin: 10px 0;
            margin-left: 20px;
            border-left: 2px solid $border-first;

            .item {
                margin: 0 10px;
                padding: 10px 0;
                border-bottom: 1px dashed $border-third;

                .reply-content {
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    color: $text-main;

                    .from-name {
                        color: $color-main;
                    }

                    .to-name {
                        color: $color-main;
                        margin-left: 5px;
                        margin-right: 5px;
                    }
                }

                .reply-bottom {
                    display: flex;
                    align-items: center;
                    margin-top: 6px;
                    font-size: 12px;
                    color: $text-minor;

                    .reply-text {
                        display: flex;
                        align-items: center;
                        margin-left: 10px;
                        cursor: pointer;

                        &:hover {
                            color: $text-333;
                        }

                        .icon-comment {
                            margin-right: 5px;
                        }
                    }
                }
            }

            .write-reply {
                display: flex;
                align-items: center;
                font-size: 14px;
                color: $text-minor;
                padding: 10px;
                cursor: pointer;

                &:hover {
                    color: $text-main;
                }

                .el-icon-edit {
                    margin-right: 5px;
                }
            }

            .fade-enter-active, .fade-leave-active {
                transition: opacity 0.5s;
            }

            .fade-enter, .fade-leave-to {
                opacity: 0;
            }

            .input-wrapper {
                padding: 10px;

                .gray-bg-input, .el-input__inner {
                    /*background-color: #67C23A;*/
                }

                .btn-control {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    padding-top: 10px;

                    .cancel {
                        font-size: 16px;
                        color: $text-normal;
                        margin-right: 20px;
                        cursor: pointer;

                        &:hover {
                            color: $text-333;
                        }
                    }

                    .confirm {
                        font-size: 16px;
                    }
                }
            }
        }
    }
}
</style>
