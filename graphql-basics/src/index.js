import { GraphQLServer } from 'graphql-yoga';




// Type definitions
// const typeDefs = `
// 	type Query {
//         id: ID!
//         name: String!
//         age: Int!
//         employed: Boolean!
//         gpa: Float
//     }
// `

const typeDefs = `
    type Query {
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
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
        title(){
            return "of the kings";
        },
        price(){
            return 23.00;
        },
        releaseYear(){
            return 1980;
        },
        rating(){
            return 12.00;
        },
        inStock(){
            return true;
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

