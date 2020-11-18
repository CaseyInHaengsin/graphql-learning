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
    updateUser(parent, args, { db }, info){
        const { id, data } = args;
        const user = db.users.find((user) => user.id === id)
        
        if (!user){
            throw new Error("user not found")
        }

        if (typeof data.email === 'string'){
            const emailTaken = db.users.some((user) => user.email === data.email);

            if (emailTaken){
                throw new Error('email taken')
            }

            user.email = data.email;
        }

        if (typeof data.name === 'string'){
            user.name = data.name;
        }

        if (typeof data.age !== 'undefined'){
            user.age = data.age;
        }
        return user;
    },
    createPost(parent, args, { db, pubsub }, info){
        const isPerson = db.users.some((user) => user.id === args.data.author)
        if (!isPerson){
            throw new Error('User not found')
        }
        const post = { id: uuidv4(), ...args.data }
        db.posts.push(post)
        if (post.published){
            pubsub.publish(`post`, {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            });
        }
        
        return post;
    },
    updatePost(parent, args, { db, pubsub }, info){
        const { id, data } = args;
        const post = db.posts.find((post) => post.id === id);
        const origPost = { ...post };
        if (!post){
            throw new Error("No post found");
        }
        if (typeof data.title === 'string'){
            post.title = data.title;
        }
        if (typeof data.body === 'string'){
            post.body = data.body;
        }
        if (typeof data.published === 'boolean'){
            post.published = data.published;

            if (origPost.published && !post.published){
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: origPost
                    }
                })
            }
            else if (!origPost.published && post.published){
                //created 

                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
            else if (post.published){
                pubsub.publish('post', {
                    post: {
                        mutation: 'UPDATED',
                        data: post
                    }
                })
            }
        }
        return post;
        
    },
    deletePost(parent, args, { db, pubsub }, info){
        let postIndex = db.posts.findIndex((post) => post.id == args.id)
        if (postIndex === -1){
            throw new Error('post does not exist')
        }
        const [post] = db.posts.splice(postIndex, 1);
        db.comments = db.comments.filter((comment) =>  comment.post !== args.id)
        if (post.published){
            pubsub.publish('post', {
                post: {
                    mutation: "DELETED",
                    data: post
                }
            })
        }
        return post
    },
    createComment(parent, args, { db, pubsub }, info){
        const isPost =  db.posts.some((post) => post.id === args.data.post && post.published)
        const hasUser = db.users.some((user) => user.id === args.data.author);
        if (!isPost || !hasUser){
            throw new Error('User or post do not exist')
        }
        const comment = { id: uuidv4(), ...args.data }
        db.comments.push(comment);
        pubsub.publish(`comment ${args.data.post}`, {comment})
        return comment;
    },
    updateComment(parent, args, { db }, info){
        const { id, data } = args;
        const comment = db.comments.find((comment) => comment.id === id);
        if (!comment){
            throw new Error("The comment doesn't exist, you fool!")
        }

        if (typeof data.text === 'string'){
            comment.text = data.text;
        }
        return comment;

    }
}

export { Mutation as default }