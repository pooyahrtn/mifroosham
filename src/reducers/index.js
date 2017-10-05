
import {combineReducers} from 'redux';
import {feedsReducer} from './feedsReducer.js'
import RecentHistory from './recentHistory.js';
import soldTransactionsReducer from './soldTransactionsReducer.js';
import boughtTransactionsReducer from './boughtTransactionsReducer';
import notificationReducer from './notificationReducer.js';
import unreadNotificationsReducer from './unreadNotificationsReducer.js';

const allReducers= combineReducers({

  recentHistory: RecentHistory,
  feedsReducer: feedsReducer,
  boughtTransactionsReducer,
  soldTransactionsReducer,
  notificationReducer,
  unreadNotificationsReducer,

});



export default allReducers;
