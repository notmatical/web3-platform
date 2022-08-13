import gql from 'graphql-tag';

export const GET_TOKEN = gql`
    query getToken($name: String!) {
        getToken(name: $name) {
            mint
            name
            symbol
            logo
            decimal
            value
        }
    }
`;

export const GET_TOKENS = gql`
    query getTokens {
        getTokens {
            mint
            name
            symbol
            decimal
            value
            logo
        }
    }
`;

export const GET_TRANSACTIONS = gql`
    query getTransactions {
        getTransactions {
            wallet
            transactionHash
            from
            to
            fromAmount
            toAmount
            type
        }
    }
`;

export const GET_TRANSACTION = gql`
    query getTransaction($transactionHash: String!) {
        getTransaction(transactionHash: $transactionHash) {
            wallet
            transactionHash
            from
            to
            fromAmount
            toAmount
            type
        }
    }
`;

export const GET_CLAIMER = gql`
    query getClaimer($wallet: String!) {
        getClaimer(wallet: $wallet) {
            project
            method
            name
            amount
            wallet
            period
            transactionHash {
                date
                txHash
            }
            time
        }
    }
`;

export const GET_CLAIMERS = gql`
    query getClaimers {
        getClaimers {
            project
            name
            method
            amount
            wallet
            period
            transactionHash {
                date
                txHash
            }
            time
        }
    }
`;

export const GET_EMPLOYEES = gql`
    query getEmployees($project: String!) {
        getEmployees(project: $project) {
            project
            name
            method
            amount
            wallet
            period
            transactionHash {
                date
                txHash
            }
            time
        }
    }
`;

export const GET_WALLETS = gql`
    query getWallets($wallet: String!) {
        getWallets(wallet: $wallet) {
            project
        }
    }
`;

export const GET_WALLETPUBKEY = gql`
    query getWalletPubkey($project: String!, $wallet: String!) {
        getWalletPubkey(project: $project, wallet: $wallet) {
            pubkey
        }
    }
`;
