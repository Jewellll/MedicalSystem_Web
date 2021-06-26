//模拟评论数据
const comments = {
    status: "成功",
    code: 200,
    data: [
        {
            id: '1', //主键id
            date: '2021-06-05 08:30',  //评论时间
            ownerId: 'talents100020', //文章的id
            fromId: 'errhefe232213',  //评论者id
            fromName: '张同学',   //评论者昵称
            fromAvatar: 'http://ww4.sinaimg.cn/bmiddle/006DLFVFgy1ft0j2pddjuj30v90uvagf.jpg', //评论者头像
            likeNum: 3, //点赞人数
            content: '老师我想问下，高剂量照射能否减低肿瘤局部复发？',  //评论内容
            reply: [  //回复，或子评论
                {
                    id: '3452324455',  //主键id
                    commentId: 'comment0001',  //父评论id，即父亲的id
                    fromId: 'observer223432',  //评论者id
                    fromName: '黄老师',  //评论者昵称
                    fromAvatar: 'https://wx4.sinaimg.cn/mw690/69e273f8gy1ft1541dmb7j215o0qv7wh.jpg', //评论者头像
                    toId: 'errhefe232213',  //被评论者id
                    toName: '@张同学',  //被评论者昵称
                    toAvatar: 'http://ww4.sinaimg.cn/bmiddle/006DLFVFgy1ft0j2pddjuj30v90uvagf.jpg',  //被评论者头像
                    content: '中等剂量可以满足治疗需求，高剂量可能增加副作用，甚至诱发放疗后肉瘤。',  //评论内容
                    date: '2021-06-05 08:36'   //评论时间
                }
            ]
        },
        {
            id: '2',
            date: '2021-06-05 08:32',
            ownerId: 'talents100020',
            fromId: 'errhefe232214',
            fromName: '李同学',
            fromAvatar: 'http://ww1.sinaimg.cn/bmiddle/006DLFVFgy1ft0j2q2p8pj30v90uzmzz.jpg',
            likeNum: 0,
            content: '化疗持续时间多长时间适宜？',
            reply: [
                {
                    id: '3452324455',  //主键id
                    commentId: 'comment0001',  //父评论id，即父亲的id
                    fromId: 'observer223432',  //评论者id
                    fromName: '黄老师',  //评论者昵称
                    fromAvatar: 'https://wx4.sinaimg.cn/mw690/69e273f8gy1ft1541dmb7j215o0qv7wh.jpg', //评论者头像
                    toId: 'errhefe232214',  //被评论者id
                    toName: '@李同学',  //被评论者昵称
                    toAvatar: 'http://ww4.sinaimg.cn/bmiddle/006DLFVFgy1ft0j2pddjuj30v90uvagf.jpg',  //被评论者头像
                    content: '化疗一般持续2年，2 年是尤文肉瘤转移的观察期。',  //评论内容
                    date: '2021-06-05 08:38'   //评论时间
                }
            ]
        },
        {
            id: '3',
            date: '2021-07-05 08:35',
            ownerId: 'talents100022',
            fromId: 'errhefe232213',
            fromName: '李同学',
            fromAvatar: 'http://ww1.sinaimg.cn/bmiddle/006DLFVFgy1ft0j2q2p8pj30v90uzmzz.jpg',
            likeNum: 0,
            content: '尤文肉瘤预后相关指标是什么啊？',
            reply: [

            ]
        }
    ]
};

export {comments}
