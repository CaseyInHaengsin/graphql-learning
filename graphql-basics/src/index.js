import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';
import db from './db';


const resolvers = {
    Query: {
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
    },
    Mutation: {
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
    },
    Post: {
        author(parent, args, { db }, info){
            return db.users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, { db }, info){
            return db.comments.filter((comment) => {
                return comment.post === parent.id;
            })
        }
    },
    User: {
        posts(parent, args, { db }, info){
            return db.posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, { db }, info){
            return db.comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, { db }, info){
            return db.users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, { db }, info){
            return db.posts.find((post) => {
                return post.id === parent.post
            })
        }
    },    
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
})

server.start(() => {
    console.log('the server is up');
})