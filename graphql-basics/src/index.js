import { GraphQLServer } from 'graphql-yoga';



// Demo user data

const users = [
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


const posts = [
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

const comments = [
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
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('the server is up');
})