import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { offsetLimitPagination, relayStylePagination } from '@apollo/client/utilities';

const client = new ApolloClient({
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    leaderboard: relayStylePagination()
                }
            }
        }
    }),
    credentials: 'include',
    uri: 'http://localhost:8080/graphql'
    // link: createHttpLink({ uri: '/graphql' })
});

export default client;
