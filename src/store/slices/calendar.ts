// third-party
import { createSlice } from '@reduxjs/toolkit';
import { FormikValues } from 'formik';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['calendar'] = {
    error: null,
    drops: []
};

const slice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET DROPS
        getDropsSuccess(state, action) {
            state.drops = action.payload;
        },

        // ADD DROP
        addDropSuccess(state, action) {
            state.drops = action.payload;
        },

        // UPDATE DROP
        updateDropSuccess(state, action) {
            state.drops = action.payload;
        },

        // REMOVE DROP
        removeDropSuccess(state, action) {
            state.drops = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getDrops() {
    return async () => {
        try {
            const response = await axios.get('/api/calendar/events');
            dispatch(slice.actions.getDropsSuccess(response.data));
        } catch (error) {
            console.log(error);
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function addDrop(drop: FormikValues) {
    return async () => {
        try {
            const response = await axios.post('/api/calendar/events/new', drop);
            dispatch(slice.actions.addDropSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function updateDrop(drop: FormikValues) {
    return async () => {
        try {
            const response = await axios.post('/api/calendar/events/update', drop);
            dispatch(slice.actions.updateDropSuccess(response.data.events));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function removeDrop(dropId: string) {
    return async () => {
        try {
            const response = await axios.post('/api/calendar/events/remove', { dropId });
            dispatch(slice.actions.removeDropSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
