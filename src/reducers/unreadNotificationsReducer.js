import {SET_UNREAD_NOTIFICATIONS, DELETE_UNREAD_NOTIFICATIONS} from '../actions/notificationActions.js'


export default function(state=0, action){
  switch (action.type) {
    case SET_UNREAD_NOTIFICATIONS: {
      return action.count
    }
    case DELETE_UNREAD_NOTIFICATIONS:{
      return 0;
    }
    break;
  }
  return state;
}
