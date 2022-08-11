import { RewardTree } from './reward-tree';

import { BN } from '@project-serum/anchor';
import { u64 } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

export interface MerkleDistributorInfo {
    merkleRoot: Buffer;
    mints: {
        [mint: string]: {
            index: number;
            reward: u64;
            proof: Buffer[];
        };
    };
}

export function parseRewardMap(rewards: { mint: string; reward: string }[]): MerkleDistributorInfo {
    // Not sure why we need to sort by address

    const tree = new RewardTree(
        rewards.map(({ mint, reward }) => ({
            mint: new PublicKey(mint),
            // eslint-disable-next-line new-cap
            reward: new u64(reward)
        }))
    );

    const mints = rewards.reduce<MerkleDistributorInfo['mints']>((acc, xpMultiplier, index) => {
        const bnMultiplier = new BN(xpMultiplier.reward);
        acc[xpMultiplier.mint] = {
            index,
            reward: bnMultiplier,
            proof: tree.getProof(index, new PublicKey(xpMultiplier.mint), bnMultiplier)
        };
        return acc;
    }, {});

    return {
        merkleRoot: tree.getRoot(),
        mints
    };
}
