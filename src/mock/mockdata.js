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
            fromName: '犀利的评论家',   //评论者昵称
            fromAvatar: 'http://ww4.sinaimg.cn/bmiddle/006DLFVFgy1ft0j2pddjuj30v90uvagf.jpg', //评论者头像
            likeNum: 3, //点赞人数
            content: '老师请问下，多次活检无法明确诊断的原因？',  //评论内容
            reply: [  //回复，或子评论
            ]
        },
        {
            id: '2',
            date: '2021-06-05 08:32',
            ownerId: 'talents100020',
            fromId: 'errhefe232214',
            fromName: '天天向上',
            fromAvatar: 'http://ww1.sinaimg.cn/bmiddle/006DLFVFgy1ft0j2q2p8pj30v90uzmzz.jpg',
            likeNum: 0,
            content: '我想知道肺转移是否是血管肉瘤的手术标忌症？',
            reply: [
                {
                    id: '3452324455',  //主键id
                    commentId: 'comment0001',  //父评论id，即父亲的id
                    fromId: 'observer223432',  //评论者id
                    fromName: '张主任',  //评论者昵称
                    fromAvatar: 'https://wx4.sinaimg.cn/mw690/69e273f8gy1ft1541dmb7j215o0qv7wh.jpg', //评论者头像
                    toId: 'errhefe232214',  //被评论者id
                    toName: '天天向上',  //被评论者昵称
                    toAvatar: 'http://ww4.sinaimg.cn/bmiddle/006DLFVFgy1ft0j2pddjuj30v90uvagf.jpg',  //被评论者头像
                    content: '肺转移不适宜做根治性手术，只能做姑息性手术 ',  //评论内容
                    date: '2021-06-05 08:36'   //评论时间
                }
            ]
        },
        {
            id: '3',
            date: '2021-07-05 08:35',
            ownerId: 'talents100022',
            fromId: 'errhefe232213',
            fromName: '天天向上',
            fromAvatar: 'http://ww1.sinaimg.cn/bmiddle/006DLFVFgy1ft0j2q2p8pj30v90uzmzz.jpg',
            likeNum: 0,
            content: '请问放疗后肉瘤患者可能具有哪些临床病理特征？',
            reply: [
                {
                    id: '3452324455',  //主键id
                    commentId: 'comment0001',  //父评论id，即父亲的id
                    fromId: 'observer223432',  //评论者id
                    fromName: '张主任',  //评论者昵称
                    fromAvatar: 'https://wx4.sinaimg.cn/mw690/69e273f8gy1ft1541dmb7j215o0qv7wh.jpg', //评论者头像
                    toId: 'errhefe232213',  //被评论者id
                    toName: '犀利的评论家',  //被评论者昵称
                    toAvatar: 'http://ww4.sinaimg.cn/bmiddle/006DLFVFgy1ft0j2pddjuj30v90uvagf.jpg',  //被评论者头像
                    content: '放疗后肉瘤患者常伴有Li-Fraumeni综合症，具有多肿瘤家族史，表现TP53胚系突变。',  //评论内容
                    date: '2021-06-05 08:37'   //评论时间
                }
            ]
        }
    ]
};

export {comments}
