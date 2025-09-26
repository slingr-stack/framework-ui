import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return {
      authorization: token ? `Bearer ${token}` : '',
    };
  },
});

// Example queries and mutations
export const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const GET_USER_QUERY = `
  query GetUser {
    me {
      id
      email
      name
    }
  }
`;