// third-party
import { createSlice } from '@reduxjs/toolkit';
import { FormikValues } from 'formik';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['proposals'] = {
    error: null,
    proposals: []
};

const slice = createSlice({
    name: 'proposals',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET PROPOSALS
        getProposalsSuccess(state, action) {
            state.proposals = action.payload;
        },

        // ADD PROPOSAL
        addProposalSuccess(state, action) {
            state.proposals = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getProposals() {
    return async () => {
        try {
            const response = await axios.get('/api/proposals/list');
            console.log('resp', response);
            dispatch(slice.actions.getProposalsSuccess(response.data.proposals));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function addProposal(proposal: FormikValues) {
    return async () => {
        try {
            const response = await axios.post('/api/proposals/new', proposal);
            dispatch(slice.actions.addProposalSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
