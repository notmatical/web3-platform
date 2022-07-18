// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project imports
import snackbarReducer from './slices/snackbar';
import rarityReducer from './slices/rarity';
import calendarReducer from './slices/calendar';
import collectionReducer from './slices/collections';
import proposalReducer from './slices/proposals';
import spaceReducer from './slices/spaces';
import menuReducer from './slices/menu';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    snackbar: snackbarReducer,
    rarity: rarityReducer,
    calendar: calendarReducer,
    collections: collectionReducer,
    proposals: proposalReducer,
    spaces: spaceReducer,
    menu: menuReducer
});

export default reducer;
