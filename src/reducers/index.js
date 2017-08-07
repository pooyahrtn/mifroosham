
import {combineReducers} from 'redux';
import GitReducer from './gitReducer.js';
import ActiveRepo from './activeReducer.js';
import ActiveTab from './activeTab.js';
import PendingNotifications from './pendingNotificationsReducer.js';
import RecentHistory from './recentHistory.js';
import UserReducer from './userReducer.js';
import ActiveUser from './activeUserReducer.js';
import CapturedImagePathReducer from './capturedImagePathReducer.js';

const allReducers= combineReducers({
  repos: GitReducer,
  activeRepo: ActiveRepo,
  activeTab: ActiveTab,
  pendingNotifications: PendingNotifications,
  recentHistory: RecentHistory,
  userInfo: UserReducer,
  activeUser: ActiveUser,
  capturedImagePath: CapturedImagePathReducer,
});

export default allReducers;
