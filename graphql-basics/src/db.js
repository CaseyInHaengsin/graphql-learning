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


const db = {
    users,
    posts,
    comments
}

export { db as default }