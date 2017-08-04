var pendingNotifications= [];
export default function(state=pendingNotifications, action){
  switch (action.type) {
    case "Get_PendingNotifications": { pendingNotifications = action.payload;
      return pendingNotifications;
    }
      break;
  }
  return pendingNotifications;
}
