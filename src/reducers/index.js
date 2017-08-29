
import {combineReducers} from 'redux';
import {GitReducer} from './gitReducer.js';
import ActiveRepo from './activeReducer.js';
import ActiveTab from './activeTab.js';
import PendingNotifications from './pendingNotificationsReducer.js';
import RecentHistory from './recentHistory.js';
import UserReducer from './userReducer.js';
import ActiveUser from './activeUserReducer.js';
import CapturedImagePathReducer from './capturedImagePathReducer.js';
import ChangeConnectionState from './changeConnectionReducer.js'
import UserData from './UserDataReducer.js'
import TokenReducer from './tokenReducer.js'
import FeedsList from './feedsReducer.js'

const allReducers= combineReducers({
  repos: GitReducer,
  activeRepo: ActiveRepo,
  activeTab: ActiveTab,
  userData : UserData,
  pendingNotifications: PendingNotifications,
  recentHistory: RecentHistory,
  userInfo: UserReducer,
  activeUser: ActiveUser,
  capturedImagePath: CapturedImagePathReducer,
  connectionState: ChangeConnectionState,
  activeToken: TokenReducer,
  feedsList : FeedsList
});

// i hope connectionState is gonna be useless

export default allReducers;
