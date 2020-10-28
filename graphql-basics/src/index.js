import { GraphQLServer } from 'graphql-yoga';





const typeDefs = `
    type Query {
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
// Resolvers
// const resolvers = {
//     Query: {
//         id(){
//             return "abc123";
//         },
//         name(){
//             return "casey";
//         },
//         age(){
//             return 28
//         },
//         employed(){
//             return true

//         },
//         gpa(){
//             return null
//         }
        
//     }
// }

const resolvers = {
    Query: {
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

