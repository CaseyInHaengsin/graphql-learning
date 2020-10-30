import { GraphQLServer } from 'graphql-yoga';





const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        add(num1: Float, num2: Float): String!
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
        add(parent, args, ctx, info){
            if (args.num1 && args.num2){
                return `Result is: ${args.num1 + args.num2}`
            }
            return 0.00
        },
        greeting(parent, args, ctx, info){
            if (args.name && args.position){
                return `Hello ${args.name}, you are a ${args.position}`
            }
            return "Hello there"
            
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

