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



const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
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
        post(){
            return {
                id: '12312',
                title: 'Title',
                body: 'of a lion',
                published: true
            }
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

