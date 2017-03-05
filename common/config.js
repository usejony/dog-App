export default {
    header: {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    },
    api: {
        base:"http://rap.taobao.org/mockjs/14378/",
        creation:"api/creations",
        up:"api/up",
        comment:"api/comment",
				verify:"api/u/verify",
				signup:"api/u/signup",
    }
}