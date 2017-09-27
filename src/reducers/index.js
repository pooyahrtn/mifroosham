
import {combineReducers} from 'redux';

import RecentHistory from './recentHistory.js';

const allReducers= combineReducers({

  recentHistory: RecentHistory,

});

// i hope connectionState is gonna be useless

export default allReducers;
