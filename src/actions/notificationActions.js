export const ADD_FOCOUSED_NOTIFICATION = 'ADD_FOCOUSED_NOTIFICATION';
export const READ_NOTIFICATION = 'READ_NOTIFICATION';
export const SET_UNREAD_NOTIFICATIONS = 'SET_UNREAD_NOTIFICATIONS';
export const DELETE_UNREAD_NOTIFICATIONS = 'DELETE_UNREAD_NOTIFICATIONS';

export const addFocusedNotification = (transaction_uuid)=>{
  return{
    type : ADD_FOCOUSED_NOTIFICATION,
    transaction_uuid: transaction_uuid
  }
}

export const readNofification = () =>{
  return{
    type: READ_NOTIFICATION
  }
}

export const setUnreadNotifications = (count) =>{
  return{
    type: SET_UNREAD_NOTIFICATIONS,
    count : count
  }
}

export const deleteUnreadNotifications = () =>{
  return{
    type: DELETE_UNREAD_NOTIFICATIONS
  }
}
