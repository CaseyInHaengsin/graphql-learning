import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';


// Demo user data

let users = [
    {
    id: '1',
    name: 'test',
    email: 'test@example.com',
    age: 99
},
    {
        id: '2',
        name: 'test2',
        email: 'test2@example.com',
        age: 87 
    },
    {
        id: '3',
        name: 'test3',
        email: 'test3@example.com',
        age: 18
    },
    {
        id: '4',
        name: 'mike',
        email: 'test4@example.com',
        age: 18
    },
    {
        id: '5',
        name: 'mike',
        email: 'test5@example.com',
        age: 18
    }
]


let posts = [
    {
      id: '123',
      title: 'First post',
      body: "first post body",
      published: true,
      author: '1'
    },
    {
        id: '1234',
        title: 'Second post',
        body: "second post body",
        published: true,
        author: '2'
    },
    {
        id: '12345',
        title: 'Third post',
        body: "Third post body",
        published: true,
        author: '5'
    },
    {
        id: '12345',
        title: 'random pos',
        body: "no",
        published: true,
        author: '3'
    }
]

let comments = [
    {
        id: '1',
        text: 'This is text',
        author: '3',
        post: '1234'
    },
    {
        id: '2',
        text: 'This is text',
        author: '2',
        post: '12345'
    },
    {
        id: '3',
        text: 'This is text',
        author: '5',
        post: '123'
    },
    {
        id: '4',
        text: 'This is text',
        author: '3',
        post: '1234'
    }
]

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        post: Post!
    }

    type Mutation {
        createUser(data: CreateUserInput): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePost): Post!
        createComment(data: CreateComment): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePost {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateComment {
        text: String! 
        author: ID! 
        post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post]!
        comments: [Comment]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

const resolvers = {
    Query: {
        users(parent, args, ctx, info){
            if (!args.query){
                return users
            }
            return users.filter((user) => {
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
        posts(parent, args, ctx, info){
            if (!args.query){
                return posts
            }
            return posts.filter(post => {
                return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase());
            })
            
        },
        comments(){
            return comments
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
        createUser(parent, args, ctx, info){
            const emailTaken = users.some((user) => user.email === args.data.email)
            if (emailTaken){
                throw new Error('Email taken.')
            }
            
            const user = { id: uuidv4(), ...args.data }

            users.push(user);
            return user
        },
        deleteUser(parent, args, ctx, info){
            const userIndex = users.findIndex((user) => {
                return user.id === args.id
            })

            if (userIndex === -1){
                throw new Error('user not found');
            }
            const deletedUsers = users.splice(userIndex, 1);

            posts = posts.filter((post) => {
                const match = post.author == args.id;
                if (match){
                    comments = comments.filter((comment) => comment.post !== post.id)
                }
                return !match

                
            })
            comments = comments.filter((comment) => comment.author !== args.id);
            return deletedUsers[0];

        },
        createPost(parent, args, ctx, info){
            const isPerson = users.some((user) => user.id === args.data.author)
            if (!isPerson){
                throw new Error('User not found')
            }
            const post = { id: uuidv4(), ...args.data }
            posts.push(post)
            return post;

        },
        createComment(parent, args, ctx, info){
            const isPost =  posts.some((post) => post.id === args.data.post && post.published)
            const hasUser = users.some((user) => user.id === args.data.author);

            if (!isPost || !hasUser){
                throw new Error('User or post do not exist')
            }

            const comment = { id: uuidv4(), ...args.data }

            comments.push(comment);
            return comment;
        }
        
    },
    Post: {
        author(parent, args, ctx, info){
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info){
            return comments.filter((comment) => {
                return comment.post === parent.id;
            })
        }
    },
    User: {
        posts(parent, args, ctx, info){
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info){
            return comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info){
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info){
            return posts.find((post) => {
                return post.id === parent.post
            })
        }
    },
    
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('the server is up');
})