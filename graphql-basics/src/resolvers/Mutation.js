import { v4 as uuidv4 } from 'uuid';

const Mutation = {
    createUser(parent, args, { db }, info){
        const emailTaken = db.users.some((user) => user.email === args.data.email)
        if (emailTaken){
            throw new Error('Email taken.')
        }
        
        const user = { id: uuidv4(), ...args.data }

        db.users.push(user);
        return user
    },
    deleteUser(parent, args, { db }, info){
        const userIndex = db.users.findIndex((user) => {
            return user.id === args.id
        })

        if (userIndex === -1){
            throw new Error('user not found');
        }
        const deletedUsers = db.users.splice(userIndex, 1);

        db.posts = posts.filter((post) => {
            const match = post.author == args.id;
            if (match){
                db.comments = db.comments.filter((comment) => comment.post !== post.id)
            }
            return !match

            
        })
        db.comments = db.comments.filter((comment) => comment.author !== args.id);
        return deletedUsers[0];

    },
    createPost(parent, args, { db }, info){
        const isPerson = db.users.some((user) => user.id === args.data.author)
        if (!isPerson){
            throw new Error('User not found')
        }
        const post = { id: uuidv4(), ...args.data }
        db.posts.push(post)
        return post;
    },
    deletePost(parent, args, { db }, info){
        let postIndex = db.posts.findIndex((post) => post.id == args.id)
        if (postIndex === -1){
            throw new Error('post does not exist')
        }
        const deletedPost = posts.splice(postIndex, 1);
        db.comments = db.comments.filter((comment) =>  comment.post !== args.id)
        return deletedPost[0]
    },
    createComment(parent, args, { db }, info){
        const isPost =  db.posts.some((post) => post.id === args.data.post && post.published)
        const hasUser = db.users.some((user) => user.id === args.data.author);
        if (!isPost || !hasUser){
            throw new Error('User or post do not exist')
        }
        const comment = { id: uuidv4(), ...args.data }
        db.comments.push(comment);
        return comment;
    }
}

export { Mutation as default }