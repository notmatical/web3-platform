import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { offsetLimitPagination, relayStylePagination } from '@apollo/client/utilities';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    credentials: 'include',
    // uri: 'http://localhost:8080/graphql'
    link: createHttpLink({ uri: '/api/graphql' })
});

export default client;
