import { BN } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export const testData = [
    {
        creator: new PublicKey('Auh2DLaxXjFAetZSTfZcMbZv8HPSmv1yziZPmaqnT7Qa'),
        ticketPricePrey: new BN(10000000000),
        ticketPriceSol: new BN(0),
        endTimestamp: new BN(1659182400),
        count: new BN(284),
        nftMint: new PublicKey('YFaSPenFrb8z8TAJnLRGj2FFhPfavf2w7wTpAVqwkFY'),
        raffleKey: 'dummy1',
        maxEntrants: new BN(5000),
        entrants: [
            new PublicKey('Auh2DLaxXjFAetZSTfZcMbZv8HPSmv1yziZPmaqnT7Qa'),
            new PublicKey('Auh2DLaxXjFAetZSTfZcMbZv8HPSmv1yziZPmaqnT7Qa')
        ],
        noRepeat: new BN(1),
        winner: [new PublicKey('11111111111111111111111111111111')],
        indexes: [new BN(1), new BN(2)],
        winnerCount: new BN(1),
        claimedWinner: [new BN(0)],
        whitelisted: new BN(1)
    },
    {
        creator: new PublicKey('Auh2DLaxXjFAetZSTfZcMbZv8HPSmv1yziZPmaqnT7Qa'),
        ticketPricePrey: new BN(5000000000),
        ticketPriceSol: new BN(0),
        endTimestamp: new BN(1659482400),
        count: new BN(567),
        nftMint: new PublicKey('2GkggV8o1uXb92cMXD6SmLS7QBMzhzaHiUVarke7MPnj'),
        raffleKey: 'dummy2',
        maxEntrants: new BN(8000),
        entrants: [
            new PublicKey('AxptBm1rnYjq3xxmTG45vgzKqfLZcy37cmHCPwE2MPpg'),
            new PublicKey('Auh2DLaxXjFAetZSTfZcMbZv8HPSmv1yziZPmaqnT7Qa'),
            new PublicKey('8a33S3YcfZrNKxGDA6vHgdpm1a3YEkJFdC1nwoaNq2iA'),
            new PublicKey('Auh2DLaxXjFAetZSTfZcMbZv8HPSmv1yziZPmaqnT7Qa')
        ],
        noRepeat: new BN(1),
        winner: [new PublicKey('11111111111111111111111111111111')],
        indexes: [new BN(1), new BN(2), new BN(3), new BN(4)],
        winnerCount: new BN(1),
        claimedWinner: [new BN(0)],
        whitelisted: new BN(1)
    },
    {
        creator: new PublicKey('Auh2DLaxXjFAetZSTfZcMbZv8HPSmv1yziZPmaqnT7Qa'),
        ticketPricePrey: new BN(25000000000),
        ticketPriceSol: new BN(0),
        endTimestamp: new BN(1657886400),
        count: new BN(8000),
        nftMint: new PublicKey('PhrEGSnWgmrtZKkNvS8seYp9KLednXRcjCPSzG6WZKY'),
        raffleKey: 'dummy3',
        maxEntrants: new BN(8000),
        entrants: [new PublicKey('FqQEBYatx9kd2Tac79woJvdRnrnYThVF5RZq9uY1qB1P')],
        noRepeat: new BN(1),
        winner: [new PublicKey('FqQEBYatx9kd2Tac79woJvdRnrnYThVF5RZq9uY1qB1P')],
        indexes: [new BN(1)],
        winnerCount: new BN(1),
        claimedWinner: [new BN(1)],
        whitelisted: new BN(1)
    },
    {
        creator: new PublicKey('Auh2DLaxXjFAetZSTfZcMbZv8HPSmv1yziZPmaqnT7Qa'),
        ticketPricePrey: new BN(5000000000),
        ticketPriceSol: new BN(0),
        endTimestamp: new BN(1659482400),
        count: new BN(567),
        nftMint: new PublicKey('HB9AHx8RGkysBvJWfEngjjyWQXUHnsrTyR9sZ7zz1jQZ'),
        raffleKey: 'dummy4',
        maxEntrants: new BN(5000),
        entrants: [
            new PublicKey('8a33S3YcfZrNKxGDA6vHgdpm1a3YEkJFdC1nwoaNq2iA'),
            new PublicKey('8a33S3YcfZrNKxGDA6vHgdpm1a3YEkJFdC1nwoaNq2iA'),
            new PublicKey('8a33S3YcfZrNKxGDA6vHgdpm1a3YEkJFdC1nwoaNq2iA'),
            new PublicKey('Auh2DLaxXjFAetZSTfZcMbZv8HPSmv1yziZPmaqnT7Qa')
        ],
        noRepeat: new BN(1),
        winner: [new PublicKey('11111111111111111111111111111111')],
        indexes: [new BN(1), new BN(2), new BN(3), new BN(4)],
        winnerCount: new BN(1),
        claimedWinner: [new BN(0)],
        whitelisted: new BN(1)
    },
    {
        creator: new PublicKey('Auh2DLaxXjFAetZSTfZcMbZv8HPSmv1yziZPmaqnT7Qa'),
        ticketPricePrey: new BN(25000000000),
        ticketPriceSol: new BN(0),
        endTimestamp: new BN(1657886400),
        count: new BN(10000),
        nftMint: new PublicKey('EPdeWZw9msMMT8QSWmQPZn4fLuBMRUzidKzu1jr9gzxr'),
        raffleKey: 'dummy5',
        maxEntrants: new BN(10000),
        entrants: [new PublicKey('FqQEBYatx9kd2Tac79woJvdRnrnYThVF5RZq9uY1qB1P')],
        noRepeat: new BN(1),
        winner: [new PublicKey('11111111111111111111111111111111')],
        indexes: [new BN(1)],
        winnerCount: new BN(1),
        claimedWinner: [new BN(0)],
        whitelisted: new BN(1)
    },
    {
        creator: new PublicKey('Auh2DLaxXjFAetZSTfZcMbZv8HPSmv1yziZPmaqnT7Qa'),
        ticketPricePrey: new BN(25000000000),
        ticketPriceSol: new BN(0),
        endTimestamp: new BN(1657886400),
        count: new BN(8000),
        nftMint: new PublicKey('PhrEGSnWgmrtZKkNvS8seYp9KLednXRcjCPSzG6WZKY'),
        raffleKey: 'dummy6',
        maxEntrants: new BN(8000),
        entrants: [
            new PublicKey('FqQEBYatx9kd2Tac79woJvdRnrnYThVF5RZq9uY1qB1P'),
            new PublicKey('Auh2DLaxXjFAetZSTfZcMbZv8HPSmv1yziZPmaqnT7Qa')
        ],
        noRepeat: new BN(1),
        winner: [
            new PublicKey('FqQEBYatx9kd2Tac79woJvdRnrnYThVF5RZq9uY1qB1P'),
            new PublicKey('Auh2DLaxXjFAetZSTfZcMbZv8HPSmv1yziZPmaqnT7Qa')
        ],
        indexes: [new BN(1), new BN(2)],
        winnerCount: new BN(2),
        claimedWinner: [new BN(1), new BN(0)],
        whitelisted: new BN(0)
    }
];

export default {
    testData
};
