// third-party
import { combineReducers } from 'redux';

// project imports
import menuReducer from './slices/menu';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    menu: menuReducer
});

export default reducer;
