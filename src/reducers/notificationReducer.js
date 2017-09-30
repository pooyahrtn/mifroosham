import {ADD_FOCOUSED_NOTIFICATION, READ_NOTIFICATION} from '../actions/notificationActions.js'


export default function(state=null, action){
  switch (action.type) {
    case ADD_FOCOUSED_NOTIFICATION: {
      return action.transaction_uuid
    }
    case READ_NOTIFICATION:{
      return null;
    }
    break;
  }
  return state;
}
