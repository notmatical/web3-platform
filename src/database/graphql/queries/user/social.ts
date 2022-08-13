import gql from 'graphql-tag';

export const GET_LEADERBOARD = gql`
    query ranking($first: Int) {
        leaderboard(first: $first) {
            followersRank
            followersCount
            user {
                wallet
                vanity
                avatarURI
                followed {
                    wallet
                }
                followers {
                    wallet
                }
            }
        }
    }
`;

export const GET_LEADERBOARD_BY = gql`
    query ranking($first: Int) {
        leaderboard(first: $first) {
            followersRank
            followersCount
            user {
                wallet
                vanity
                avatarURI
                followed {
                    wallet
                }
                followers {
                    wallet
                }
            }
        }
    }
`;
