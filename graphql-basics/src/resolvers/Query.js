
const Query = {
        users(parent, args, { db }, info){
            if (!args.query){
                return db.users
            }
            return db.users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            })

        },
        me(){
            return {
                id: '123090',
                name: 'casey',
                email: 'casey@example.com',
                age: null
            }
        },
        posts(parent, args, { db }, info){
            if (!args.query){
                return db.posts
            }
            return db.posts.filter(post => {
                return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase());
            })
            
        },
        comments(parent, args, { db }, info){
            return db.comments
        },
        post(){
            return {
                id: '12312',
                title: 'Title',
                body: 'of a lion',
                published: true
            }
        }
}

export { Query as default }