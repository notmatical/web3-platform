import { atom } from 'recoil';

export const snipedIdentifierAtom = atom({
    key: 'snipedIdentifier',
    default: []
});

export const showSearchAtom = atom({
    key: 'showSearch',
    default: false
});

export const searchResultAtom = atom({
    key: 'searchResult',
    default: []
});
export const MECollectionAtom = atom({
    key: 'MECollection',
    default: []
});

export const snipingCollectionAtom = atom<any[]>({
    key: 'snipingCollections',
    default: []
});

export const localCollectionDataAtom = atom({
    key: 'localCollectionData',
    default: {}
});

export const localCollectionDataPriceAtom = atom({
    key: 'localCollectionDataPrice',
    default: {}
});

export const rarityDataAtom = atom({
    key: 'rarityData',
    default: {}
});

export const fpAtom = atom({
    key: 'fpData',
    default: {}
});

export const allListingAtom = atom<any[]>({
    key: 'allListing',
    default: []
});

export const filteredListingAtom = atom<any[]>({
    key: 'filteredListing',
    default: []
});

export const walletBalanceAtom = atom({ key: 'walletBalance', default: 'N/A' });

export const rarityColorCodeAtom = atom({
    key: 'rarityColorCode',
    default: {
        C: { text: 'COMMON', color: '#969696' },
        U: { text: 'UNCOMMON', color: '#40D897' },
        R: { text: 'RARE', color: '#45C2FE' },
        E: { text: 'EPIC', color: '#A629F8' },
        L: { text: 'LEGENDARY', color: '#FD8F31' },
        M: { text: 'MYTHICS', color: '#ED3B50' }
    }
});
