import gql from 'graphql-tag';

export const GET_QUESTS = gql`
    query quests {
        quests {
            name
            description
            expiresAt
            cooldownDays
            rewardedXp
            rewardedPoints
            requiredLevel
            isClaimable
            isCompletable
            isCompletableAt
            isExpired
            isOneOff
        }
    }
`;

export const GET_QUEST = gql`
    query quests {
        quests {
            name
            description
            expiresAt
            cooldownDays
            rewardedXp
            rewardedPoints
            requiredLevel
            isClaimable
            isCompletable
            isCompletableAt
            isExpired
            isOneOff
        }
    }
`;
