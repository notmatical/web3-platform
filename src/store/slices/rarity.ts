// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';
import { NftsFilter } from 'types/rarity';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['rarity'] = {
    error: null,
    nfts: [],
    nft: null,
    relatedNfts: []
};

const slice = createSlice({
    name: 'rarity',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET NFTS
        getNftsSuccess(state, action) {
            state.nfts = action.payload;
        },

        // FILTER NFTS
        filterNftsSuccess(state, action) {
            state.nfts = action.payload;
        },

        // GET NFT
        getNftSuccess(state, action) {
            state.nft = action.payload;
        },

        // GET RELATED NFTS
        getRelatedNftsSuccess(state, action) {
            state.relatedNfts = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getNfts() {
    return async () => {
        try {
            const response = await axios.get('/api/nfts/list');
            dispatch(slice.actions.getNftsSuccess(response.data.products));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function filterNfts(filter: NftsFilter) {
    return async () => {
        try {
            const response = await axios.post('/api/nfts/filter', { filter });
            dispatch(slice.actions.filterNftsSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getNft(id: string | undefined) {
    return async () => {
        try {
            const response = await axios.post('/api/nft/details', { id });
            dispatch(slice.actions.getNftSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getRelatedNfts(id: string | undefined) {
    return async () => {
        try {
            const response = await axios.post('/api/nft/related', { id });
            dispatch(slice.actions.getRelatedNftsSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
