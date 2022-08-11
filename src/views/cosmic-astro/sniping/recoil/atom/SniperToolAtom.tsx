import { atom } from 'recoil';
// app.tsx
export const wsConnAtom = atom({
    key: 'wsConn',
    default: false
});

// AutoBuy.tsx and onwards
export const WalletBalanceAtom = atom({
    key: 'walletBalance',
    default: 'N/A'
});

export const MEDataAtom = atom({
    key: 'MEData',
    default: []
});

export const viewAtom = atom({
    key: 'view',
    default: 'search'
});

export const loadingAutoBuyAtom = atom({
    key: 'loadingAutoBuy',
    default: true
});

// searchView.tsx and onwards
export const isShowingAtom = atom({
    key: 'isShowing',
    default: false
});

export const emptyQueryAtom = atom({
    key: 'emptyQuery',
    default: false
});

export const searchDataAtom = atom({
    key: 'searchData',
    default: []
});

export const searchStrAtom = atom({
    key: 'searchStr',
    default: ''
});

// collectionView.tsx and onwards
export const wsDataAtom = atom({
    key: 'wsData',
    default: []
});

export const listeningWSAtom = atom({
    key: 'listeningWS',
    default: false
});

export const NFTDataAtom = atom({
    key: 'NFTData',
    default: {}
});

export const loadingAtom = atom({
    key: 'loading',
    default: true
});

export const quantityAtom = atom({
    key: 'quantity',
    default: 0
});

export const priceAtom = atom({
    key: 'price',
    default: { min: 0.0, max: 0.0 }
});

export const rarityAtom = atom({
    key: 'rarity',
    default: []
});

export const rarityDivisionAtom = atom({
    key: 'rarityDivision',
    default: {
        Common: { Rarest: 0, Unique: 0 },
        Uncommon: { Rarest: 0, Unique: 0 },
        Rare: { Rarest: 0, Unique: 0 },
        Epic: { Rarest: 0, Unique: 0 },
        Legendary: { Rarest: 0, Unique: 0 },
        Mythic: { Rarest: 0, Unique: 0 }
    }
});

export const traitAtom = atom({
    key: 'trait',
    default: []
});

export const enableQuantityAtom = atom({
    key: 'enableQuantity',
    default: false
});

export const enablePriceAtom = atom({
    key: 'enablePrice',
    default: false
});

export const enableRarityAtom = atom({
    key: 'enableRarity',
    default: false
});

export const enableTraitAtom = atom({
    key: 'enableTrait',
    default: false
});

export const timerAtom = atom({
    key: 'timer',
    default: { hour: 0, min: 0, sec: 0 }
});

export const buttonStateAtom = atom({
    key: 'buttonState',
    default: 'Start'
});

export const randomIDAtom = atom({
    key: 'randomID',
    default: '1234abcdEFGH'
});

// SessionView.tsx and onwards
export const totalSnipesAtom = atom({
    key: 'TotalSnipes',
    default: 0
});

// ListingsView.tsx
export const listingsAtom = atom({
    key: 'listings',
    default: []
});

export const filteredListingsAtom = atom({
    key: 'filteredListings',
    default: []
});

export const snipedListingsAtom = atom({
    key: 'snipedListings',
    default: []
});

export const gotMRDataAtom = atom({
    key: 'gotMRData',
    default: false
});

export const mintDataAtom = atom({
    key: 'mintData',
    default: {}
});

export const listingLoadingAtom = atom({
    key: 'listingLoading',
    default: true
});

export const offsetAtom = atom({
    key: 'offset',
    default: 0
});

export const showListingImageAtom = atom({
    key: 'showListingImage',
    default: true
});

export const showSnipedImageAtom = atom({
    key: 'showSnipedImage',
    default: true
});

// transactionProcess.tsx

export const currentSnipeAtom = atom({
    key: 'currentSnipeImage',
    default: {}
});

// modal
export const modalViewAtom = atom({
    key: 'modalView',
    default: 0
    // 0 for no modal, 1 for Wallet Balance Low, 2 for price confirmation
});
