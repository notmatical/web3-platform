import gql from 'graphql-tag';

export const CREATE_PROJECT = gql`
    mutation createWallet($project: String!, $wallet: String!) {
        createWallet(project: $project, wallet: $wallet) {
            project
            secretKey
        }
    }
`;

export const ADD_CLAIMER = gql`
    mutation createClaimer(
        $project: String!
        $name: String!
        $method: String!
        $amount: String!
        $wallet: String!
        $period: String!
        $time: String!
    ) {
        createClaimer(project: $project, name: $name, method: $method, amount: $amount, wallet: $wallet, period: $period, time: $time) {
            project
            name
            method
            amount
            wallet
            time
            period
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_CLAIMER = gql`
    mutation deleteClaimer($project: String!, $name: String!, $wallet: String!) {
        deleteClaimer(project: $project, name: $name, wallet: $wallet) {
            project
            name
            wallet
        }
    }
`;

export const CLAIM = gql`
    mutation clickClaim($project: String!, $wallet: String!, $method: String!, $claimTime: String!, $delayed: String!) {
        clickClaim(project: $project, wallet: $wallet, method: $method, claimTime: $claimTime, delayed: $delayed) {
            project
            name
            amount
            wallet
            period
            time
        }
    }
`;

export const WITHDRAW = gql`
    mutation clickWithdraw($project: String!, $method: String!, $amount: Int!) {
        clickWithdraw(project: $project, method: $method, amount: $amount)
    }
`;
