
import {combineReducers} from 'redux';
import {feedsReducer} from './feedsReducer.js'
import RecentHistory from './recentHistory.js';
import soldTransactionsReducer from './soldTransactionsReducer.js'
import boughtTransactionsReducer from './boughtTransactionsReducer'
const allReducers= combineReducers({

  recentHistory: RecentHistory,
  feedsReducer: feedsReducer,
  boughtTransactionsReducer,
  soldTransactionsReducer
});



export default allReducers;
