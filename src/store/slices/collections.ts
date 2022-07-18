// third-party
import { createSlice } from '@reduxjs/toolkit';
import { FormikValues } from 'formik';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['collections'] = {
    error: null,
    projects: []
};

const slice = createSlice({
    name: 'collections',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET NFTS
        getProjectsSuccess(state, action) {
            state.projects = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getProjects() {
    return async () => {
        try {
            const response = await axios.get('/api/collections/projects');
            console.log(response);
            dispatch(slice.actions.getProjectsSuccess(response.data.projects));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// export function addAlert(event: FormikValues) {
//     return async () => {
//         try {
//             const response = await axios.post('/api/collections/alerts/new', event);
//             dispatch(slice.actions.addAlertSuccess(response.data));
//         } catch (error) {
//             dispatch(slice.actions.hasError(error));
//         }
//     };
// }

// export function updateAlert(event: FormikValues) {
//     return async () => {
//         try {
//             const response = await axios.post('/api/collections/alerts/update', event);
//             dispatch(slice.actions.updateAlertSuccess(response.data.alerts));
//         } catch (error) {
//             dispatch(slice.actions.hasError(error));
//         }
//     };
// }

// export function removeAlert(eventId: string) {
//     return async () => {
//         try {
//             const response = await axios.post('/api/collections/alerts/remove', { eventId });
//             dispatch(slice.actions.removeAlertSuccess(response.data));
//         } catch (error) {
//             dispatch(slice.actions.hasError(error));
//         }
//     };
// }
