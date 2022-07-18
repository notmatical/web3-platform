// third-party
import { createSlice } from '@reduxjs/toolkit';
import { FormikValues } from 'formik';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['spaces'] = {
    error: null,
    spaces: []
};

const slice = createSlice({
    name: 'spaces',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET SPACES
        getSpacesSuccess(state, action) {
            state.spaces = action.payload;
        },

        // ADD SPACE
        addSpaceSuccess(state, action) {
            state.spaces = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getSpaces() {
    return async () => {
        try {
            const response = await axios.get('/api/spaces/list');
            dispatch(slice.actions.getSpacesSuccess(response.data.spaces));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function addSpace(space: FormikValues) {
    return async () => {
        try {
            const response = await axios.post('/api/spaces/new', space);
            dispatch(slice.actions.addSpaceSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
