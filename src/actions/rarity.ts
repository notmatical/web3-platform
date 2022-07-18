/* eslint-disable */

const traits = require('assets/data/traits.json');
const metadatas = require('assets/data/metadatas.json');
const ranks = require('assets/data/rank.json');

export const getAttributes = () => {
    let attributes: number = 0;
    for (let i = 0; i < traits.length; i++) {
        attributes += traits[i].length;
    }

    return attributes;
};

export const getSupply = () => metadatas.length;

export const getIdFromRank = (rank: number) => ranks[rank - 1].id;

export const getRankFromId = (id: number) => {
    return ranks.findIndex((item: { id: number }) => item.id == id) + 1;
};

export const getMetadataFromId = (id: number) => {
    const { metadata, mintKey } = metadatas.find((item: { id: number }) => item.id == id);
    const traitsValue = [];

    for (let i = 0; i < metadata.attributes.length; i++) {
        let isFound = false;
        for (let j = 0; j < traits[i].length; j++) {
            if (metadata.attributes[i].trait_type === traits[i][j].trait_type) {
                if (metadata.attributes[i].value === traits[i][j].value) {
                    traitsValue.push({
                        trait_type: metadata.attributes[i].trait_type,
                        value: metadata.attributes[i].value,
                        rar: traits[i][j].amount,
                        percentage: 0
                    });
                    isFound = true;
                } else if (j === traits[i].length - 1 && !isFound) {
                    traitsValue.push({
                        trait_type: metadata.attributes[i].trait_type,
                        value: metadata.attributes[i].value,
                        rar: 1,
                        percentage: 0
                    });
                }
            } else if (j === traits[i].length - 1 && !isFound) {
                traitsValue.push({
                    trait_type: metadata.attributes[i].trait_type,
                    value: metadata.attributes[i].value,
                    rar: 1,
                    percentage: 0
                });
            }
        }
    }

    const r = ranks.findIndex((item: { id: number }) => item.id == id) + 1;
    const tier = r <= Math.ceil(metadatas.length / 100) ? 'mythic' :
            r <= Math.ceil(metadatas.length * 5 / 100) ? 'legendary' :
            r <= Math.ceil(metadatas.length * 15 / 100) ? 'epic' :
            r <= Math.ceil(metadatas.length * 35 / 100) ? 'rare' :
            r <= Math.ceil(metadatas.length * 60 / 100) ? 'uncommon' : 'common';

    let average = 0;
    for (let i = 0; i < traitsValue.length; i++) {
        average += traitsValue[i].rar * 100 / metadatas.length;
        traitsValue[i].percentage = parseFloat((traitsValue[i].rar * 100 / metadatas.length).toFixed(2));
    }
    console.log(traitsValue);
    return { image: metadata.image, traitsValue: [...traitsValue], tier: tier, mintKey, average: (average / traitsValue.length).toFixed(2) };
};
